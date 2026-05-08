/**
 * Centralized Voice Configuration System
 *
 * - Language list with country flags
 * - Static voice pools for Deepgram and Sarvam AI (no dynamic API calls)
 * - Indian language detection
 * - Helper to get exactly 2 male + 2 female voices per language
 */

// ── Language interface & list ────────────────────────────────────────
export interface Language {
    language: string;
    countryCode: string;
    countryFlag: string;
}

export const languages: Language[] = [
    { language: "English", countryCode: "US", countryFlag: "🇺🇸" },
    { language: "Spanish", countryCode: "MX", countryFlag: "🇲🇽" },
    { language: "German", countryCode: "DE", countryFlag: "🇩🇪" },
    { language: "Hindi", countryCode: "IN", countryFlag: "🇮🇳" },
    { language: "Marathi", countryCode: "IN", countryFlag: "🇮🇳" },
    { language: "Telugu", countryCode: "IN", countryFlag: "🇮🇳" },
    { language: "Tamil", countryCode: "IN", countryFlag: "🇮🇳" },
    { language: "Bengali", countryCode: "IN", countryFlag: "🇮🇳" },
    { language: "Kannada", countryCode: "IN", countryFlag: "🇮🇳" },
    { language: "Malayalam", countryCode: "IN", countryFlag: "🇮🇳" },
    { language: "Gujarati", countryCode: "IN", countryFlag: "🇮🇳" },
    { language: "French", countryCode: "FR", countryFlag: "🇫🇷" },
    { language: "Dutch", countryCode: "NL", countryFlag: "🇳🇱" },
    { language: "Italian", countryCode: "IT", countryFlag: "🇮🇹" },
    { language: "Japanese", countryCode: "JP", countryFlag: "🇯🇵" },
];

// ── Indian languages list ────────────────────────────────────────────
export const INDIAN_LANGUAGES = new Set([
    "Hindi",
    "Tamil",
    "Telugu",
    "Bengali",
    "Marathi",
    "Kannada",
    "Malayalam",
    "Gujarati",
    "Punjabi",
    "Odia",
    "Assamese",
    "Urdu",
    "Konkani",
    "Sanskrit",
]);

// ── Provider detection ───────────────────────────────────────────────
export type Provider = "edge" | "sarvam";

export function getProvider(language: string): Provider {
    return INDIAN_LANGUAGES.has(language) ? "sarvam" : "edge";
}

// ── Voice interface ──────────────────────────────────────────────────
export interface VoiceOption {
    id: string;          // Unique identifier used for selection & API calls
    name: string;        // Human-friendly display name
    gender: "male" | "female";
    provider: Provider;
    voiceId: string;     // Actual voice ID sent to the TTS API
}

// ── Microsoft Edge TTS Voice Pool ────────────────────────────────────
// High-quality free voices from Microsoft Edge
const EDGE_VOICE_POOL: VoiceOption[] = [
    // English (US)
    { id: "edge-andrew-en", name: "Andrew", gender: "male", provider: "edge", voiceId: "en-US-AndrewNeural" },
    { id: "edge-brian-en", name: "Brian", gender: "male", provider: "edge", voiceId: "en-US-BrianNeural" },
    { id: "edge-emma-en", name: "Emma", gender: "female", provider: "edge", voiceId: "en-US-EmmaNeural" },
    { id: "edge-ava-en", name: "Ava", gender: "female", provider: "edge", voiceId: "en-US-AvaNeural" },
    
    // Spanish (Mexico)
    { id: "edge-jorge-es", name: "Jorge", gender: "male", provider: "edge", voiceId: "es-MX-JorgeNeural" },
    { id: "edge-dalia-es", name: "Dalia", gender: "female", provider: "edge", voiceId: "es-MX-DaliaNeural" },
    
    // French
    { id: "edge-henri-fr", name: "Henri", gender: "male", provider: "edge", voiceId: "fr-FR-HenriNeural" },
    { id: "edge-denise-fr", name: "Denise", gender: "female", provider: "edge", voiceId: "fr-FR-DeniseNeural" },

    // German
    { id: "edge-conrad-de", name: "Conrad", gender: "male", provider: "edge", voiceId: "de-DE-ConradNeural" },
    { id: "edge-katja-de", name: "Katja", gender: "female", provider: "edge", voiceId: "de-DE-KatjaNeural" },
];

// ── Sarvam AI Voice Pool ────────────────────────────────────────────
// High-quality Indian voices using Bulbul v3
const SARVAM_VOICE_POOL: VoiceOption[] = [
    // Female voices
    { id: "sarvam-ritu", name: "Ritu", gender: "female", provider: "sarvam", voiceId: "ritu" },
    { id: "sarvam-neha", name: "Neha", gender: "female", provider: "sarvam", voiceId: "neha" },
    { id: "sarvam-kavya", name: "Kavya", gender: "female", provider: "sarvam", voiceId: "kavya" },
    // Male voices
    { id: "sarvam-rahul", name: "Rahul", gender: "male", provider: "sarvam", voiceId: "rahul" },
    { id: "sarvam-amit", name: "Amit", gender: "male", provider: "sarvam", voiceId: "amit" },
    { id: "sarvam-rohan", name: "Rohan", gender: "male", provider: "sarvam", voiceId: "rohan" },
];


// ── Language-to-code mapping (for TTS API calls) ─────────────────────
export const LANGUAGE_CODES: Record<string, string> = {
    // Foreign languages
    English: "en",
    Spanish: "es",
    German: "de",
    French: "fr",
    Dutch: "nl",
    Italian: "it",
    Japanese: "ja",
    // Indian languages (Sarvam uses hi-IN, ta-IN, etc.)
    Hindi: "hi-IN",
    hi: "hi-IN",
    Tamil: "ta-IN",
    ta: "ta-IN",
    Telugu: "te-IN",
    te: "te-IN",
    Bengali: "bn-IN",
    bn: "bn-IN",
    Marathi: "mr-IN",
    mr: "mr-IN",
    Kannada: "kn-IN",
    kn: "kn-IN",
    Malayalam: "ml-IN",
    ml: "ml-IN",
    Gujarati: "gu-IN",
    gu: "gu-IN",
};

// ── Main helper: get voices for a language ───────────────────────────
export interface VoiceResult {
    language: string;
    provider: Provider;
    voices: VoiceOption[];
}

/**
 * Returns exactly 2 male + 2 female voices for a given language.
 * If fewer exist, returns as many as available.
 */
export function getVoicesForLanguage(language: string): VoiceResult {
    const provider = getProvider(language);
    const pool = provider === "edge" ? EDGE_VOICE_POOL : SARVAM_VOICE_POOL;

    // Filter by language suffix if needed, or just return pool for simplicity
    // For Edge, we'll just filter by what's in the pool for now
    let filteredPool = pool;
    if (provider === "edge") {
        const langCode = LANGUAGE_CODES[language] || "en";
        filteredPool = pool.filter(v => v.voiceId.startsWith(langCode));
        // Fallback to English if no voices found for that language in our static pool
        if (filteredPool.length === 0) filteredPool = pool.filter(v => v.voiceId.startsWith("en"));
    }

    const males = filteredPool.filter((v) => v.gender === "male");
    const females = filteredPool.filter((v) => v.gender === "female");

    // Pick up to 2 of each gender
    const selectedMales = males.slice(0, 2);
    const selectedFemales = females.slice(0, 2);

    // Interleave: female, male, female, male for nice display
    const voices: VoiceOption[] = [];
    const maxLen = Math.max(selectedFemales.length, selectedMales.length);
    for (let i = 0; i < maxLen; i++) {
        if (i < selectedFemales.length) voices.push(selectedFemales[i]);
        if (i < selectedMales.length) voices.push(selectedMales[i]);
    }

    return { language, provider, voices };
}

/**
 * Returns a voice option by its unique internal ID.
 */
export function getVoiceById(id: string): VoiceOption | undefined {
    const allVoices = [...EDGE_VOICE_POOL, ...SARVAM_VOICE_POOL];
    return allVoices.find((v) => v.id === id);
}

/**
 * Returns the full voice pool for a provider (for admin/debug use).
 */
export function getVoicePool(provider: Provider): VoiceOption[] {
    if (provider === "edge") return EDGE_VOICE_POOL;
    return SARVAM_VOICE_POOL;
}

