/**
 * GET /api/tts-preview?voice=Dhwani&language=Hindi&text=Hello
 *
 * Generates a short TTS audio preview on-demand.
 * Streams audio back as audio/mpeg — does NOT store files.
 *
 * - Indian languages → Fonadalabs API
 * - Foreign languages → Deepgram API
 */

import { NextRequest, NextResponse } from "next/server";
import { getProvider, LANGUAGE_CODES } from "@/lib/voice-config";

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY || "";
const FONADALABS_API_KEY = process.env.FONADALABS_API_KEY || "";

// Default preview text per language
const DEFAULT_PREVIEW_TEXT: Record<string, string> = {
    English: "Hello! I am your voice assistant. Let me help you create amazing content.",
    Spanish: "¡Hola! Soy tu asistente de voz. Déjame ayudarte a crear contenido increíble.",
    German: "Hallo! Ich bin Ihr Sprachassistent. Lassen Sie mich Ihnen helfen, großartige Inhalte zu erstellen.",
    French: "Bonjour! Je suis votre assistant vocal. Laissez-moi vous aider à créer un contenu incroyable.",
    Dutch: "Hallo! Ik ben uw stemassistent. Laat me u helpen geweldige content te maken.",
    Italian: "Ciao! Sono il tuo assistente vocale. Lascia che ti aiuti a creare contenuti straordinari.",
    Japanese: "こんにちは！私はあなたの音声アシスタントです。素晴らしいコンテンツを作りましょう。",
    Hindi: "नमस्ते! मैं आपका वॉइस असिस्टेंट हूँ। आइए मिलकर शानदार कंटेंट बनाते हैं।",
    Tamil: "வணக்கம்! நான் உங்கள் குரல் உதவியாளர். அற்புதமான உள்ளடக்கத்தை உருவாக்குவோம்.",
    Telugu: "నమస్కారం! నేను మీ వాయిస్ అసిస్టెంట్. అద్భుతమైన కంటెంట్ రూపొందిద్దాం.",
    Bengali: "নমস্কার! আমি আপনার ভয়েস অ্যাসিস্ট্যান্ট। চলুন দুর্দান্ত কন্টেন্ট তৈরি করি।",
    Marathi: "नमस्कार! मी तुमचा व्हॉइस असिस्टंट आहे. चला अप्रतिम कंटेंट तयार करूया.",
    Kannada: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ವಾಯ್ಸ್ ಅಸಿಸ್ಟೆಂಟ್. ಅದ್ಭುತ ವಿಷಯವನ್ನು ರಚಿಸೋಣ.",
    Malayalam: "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ വോയ്സ് അസിസ്റ്റന്റ് ആണ്. മികച്ച ഉള്ളടക്കം സൃഷ്ടിക്കാം.",
    Gujarati: "નમસ્તે! હું તમારો વૉઇસ આસિસ્ટન્ટ છું. ચાલો અદ્ભુત કન્ટેન્ટ બનાવીએ.",
};

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const voice = searchParams.get("voice");
    const language = searchParams.get("language");
    const text = searchParams.get("text");

    // ── Validate ─────────────────────────────────────────────────────
    if (!voice || !language) {
        return NextResponse.json(
            { error: "Missing required parameters: voice, language" },
            { status: 400 }
        );
    }

    const previewText = text || DEFAULT_PREVIEW_TEXT[language] || DEFAULT_PREVIEW_TEXT["English"];
    const provider = getProvider(language);

    try {
        let audioBuffer: ArrayBuffer;
        let contentType: string;

        if (provider === "deepgram") {
            // ── Deepgram TTS ─────────────────────────────────────────
            if (!DEEPGRAM_API_KEY) {
                return NextResponse.json(
                    { error: "DEEPGRAM_API_KEY not configured" },
                    { status: 500 }
                );
            }

            const response = await fetch(
                `https://api.deepgram.com/v1/speak?model=${voice}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${DEEPGRAM_API_KEY}`,
                    },
                    body: JSON.stringify({ text: previewText }),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Deepgram TTS error: ${response.status}`, errorText);
                return NextResponse.json(
                    { error: `Deepgram API error: ${response.status}`, detail: errorText },
                    { status: response.status }
                );
            }

            audioBuffer = await response.arrayBuffer();
            contentType = response.headers.get("content-type") || "audio/mpeg";

        } else {
            // ── Fonadalabs TTS ───────────────────────────────────────
            if (!FONADALABS_API_KEY) {
                return NextResponse.json(
                    { error: "FONADALABS_API_KEY not configured" },
                    { status: 500 }
                );
            }

            const fonadaLang = LANGUAGE_CODES[language] || "Hindi";

            // Try with requested language first
            let response = await fetch(
                "https://api.fonada.ai/tts/generate-audio-large",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${FONADALABS_API_KEY}`,
                    },
                    body: JSON.stringify({
                        input: previewText,
                        voice: voice,
                        language: fonadaLang,
                    }),
                }
            );

            // Fallback: if language not supported, retry with Hindi
            if (!response.ok && fonadaLang !== "Hindi") {
                console.warn(`Fonadalabs: ${fonadaLang} failed (${response.status}), falling back to Hindi`);
                const hindiText = DEFAULT_PREVIEW_TEXT["Hindi"];
                response = await fetch(
                    "https://api.fonada.ai/tts/generate-audio-large",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${FONADALABS_API_KEY}`,
                        },
                        body: JSON.stringify({
                            input: hindiText,
                            voice: voice,
                            language: "Hindi",
                        }),
                    }
                );
            }

            // Fallback 2: try English if Hindi also fails
            if (!response.ok) {
                console.warn(`Fonadalabs: Hindi fallback failed (${response.status}), trying English`);
                const englishText = DEFAULT_PREVIEW_TEXT["English"];
                response = await fetch(
                    "https://api.fonada.ai/tts/generate-audio-large",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${FONADALABS_API_KEY}`,
                        },
                        body: JSON.stringify({
                            input: englishText,
                            voice: voice,
                            language: "English",
                        }),
                    }
                );
            }

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Fonadalabs TTS error: ${response.status}`, errorText);
                return NextResponse.json(
                    { error: `Fonadalabs API error: ${response.status}`, detail: errorText },
                    { status: response.status }
                );
            }

            audioBuffer = await response.arrayBuffer();
            contentType = response.headers.get("content-type") || "audio/mpeg";
        }

        // ── Stream audio back ────────────────────────────────────────
        return new NextResponse(audioBuffer, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Content-Length": String(audioBuffer.byteLength),
                "Cache-Control": "public, max-age=3600",
            },
        });

    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("TTS Preview generation failed:", message);
        return NextResponse.json(
            { error: "Failed to generate audio preview", detail: message },
            { status: 500 }
        );
    }
}
