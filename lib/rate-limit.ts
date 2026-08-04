/**
 * In-memory sliding-window rate limiter.
 *
 * Three tiers:
 *  - standard  → 30 req / 60s  (reads, dashboards)
 *  - strict    → 10 req / 60s  (writes, mutations)
 *  - expensive →  5 req / 60s  (external API calls)
 *
 * No dependencies — uses a Map<string, number[]> of timestamps.
 */

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// ─── Tier Config ──────────────────────────────────────────────────────────────

const TIERS = {
    standard: { limit: 30, windowMs: 60_000 },
    strict: { limit: 10, windowMs: 60_000 },
    expensive: { limit: 5, windowMs: 60_000 },
} as const;

export type RateLimitTier = keyof typeof TIERS;

// ─── Store ────────────────────────────────────────────────────────────────────

const store = new Map<string, number[]>();

// Auto-purge stale keys every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, timestamps] of store) {
        const fresh = timestamps.filter((t) => now - t < 120_000);
        if (fresh.length === 0) store.delete(key);
        else store.set(key, fresh);
    }
}, 5 * 60_000).unref?.();

// ─── Core ─────────────────────────────────────────────────────────────────────

export function rateLimit(
    key: string,
    tier: RateLimitTier
): { success: boolean; remaining: number; resetIn: number } {
    const { limit, windowMs } = TIERS[tier];
    const now = Date.now();
    const windowStart = now - windowMs;

    const timestamps = (store.get(key) || []).filter((t) => t > windowStart);

    if (timestamps.length >= limit) {
        const oldestInWindow = timestamps[0];
        const resetIn = Math.ceil((oldestInWindow + windowMs - now) / 1000);
        return { success: false, remaining: 0, resetIn };
    }

    timestamps.push(now);
    store.set(key, timestamps);

    return {
        success: true,
        remaining: limit - timestamps.length,
        resetIn: Math.ceil(windowMs / 1000),
    };
}

// ─── Server Action Wrapper ────────────────────────────────────────────────────

/**
 * Wraps a server action with per-user rate limiting.
 * Extracts Clerk userId as the rate-limit key.
 *
 * Usage:
 *   export const myAction = rateLimitedAction("strict", async (arg) => { ... });
 */
export function rateLimitedAction<TArgs extends unknown[], TReturn>(
    tier: RateLimitTier,
    action: (...args: TArgs) => Promise<TReturn>
): (...args: TArgs) => Promise<TReturn> {
    return async (...args: TArgs): Promise<TReturn> => {
        const { userId } = await auth();
        const key = `action:${userId || "anon"}:${tier}`;
        const result = rateLimit(key, tier);

        if (!result.success) {
            return {
                success: false,
                error: `Rate limit exceeded. Try again in ${result.resetIn}s.`,
            } as TReturn;
        }

        return action(...args);
    };
}

// ─── API Route Wrapper ────────────────────────────────────────────────────────

/**
 * Wraps a Next.js API route handler with rate limiting.
 * Uses Clerk userId if authenticated, otherwise falls back to IP.
 *
 * Usage:
 *   export const GET = withRateLimit("standard", async (req) => { ... });
 */
export function withRateLimit(
    tier: RateLimitTier,
    handler: (req: NextRequest) => Promise<NextResponse | Response>
): (req: NextRequest) => Promise<NextResponse | Response> {
    return async (req: NextRequest) => {
        const { userId } = await auth();
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
        const key = `api:${userId || ip}:${tier}`;
        const result = rateLimit(key, tier);

        if (!result.success) {
            return NextResponse.json(
                {
                    error: "Too many requests",
                    retryAfter: result.resetIn,
                },
                {
                    status: 429,
                    headers: {
                        "Retry-After": String(result.resetIn),
                        "X-RateLimit-Remaining": "0",
                    },
                }
            );
        }

        const response = await handler(req);

        // Attach rate-limit headers to successful responses
        if (response instanceof NextResponse) {
            response.headers.set("X-RateLimit-Remaining", String(result.remaining));
        }

        return response;
    };
}
