import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const session = req.auth;
    const { pathname } = req.nextUrl;

    // Protect dashboard routes — redirect unauthenticated users to sign-in
    if (pathname.startsWith("/dashboard") && !session) {
        return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
    ],
};
