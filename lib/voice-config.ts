/**
 * Centralized Voice Configuration System
 *
 * - Language list with country flags
 * - Static voice pools for Deepgram and Fonadalabs (no dynamic API calls)
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
export type Provider = "deepgram" | "fonadalabs";

export function getProvider(language: string): Provider {
    return INDIAN_LANGUAGES.has(language) ? "fonadalabs" : "deepgram";
}

// ── Voice interface ──────────────────────────────────────────────────
export interface VoiceOption {
    id: string;          // Unique identifier used for selection & API calls
    name: string;        // Human-friendly display name
    gender: "male" | "female";
    provider: Provider;
    voiceId: string;     // Actual voice ID sent to the TTS API
}

// ── Deepgram Aura-2 Voice Pool ───────────────────────────────────────
// All confirmed Aura-2 voices with gender metadata
const DEEPGRAM_VOICE_POOL: VoiceOption[] = [
    // Male voices
    { id: "aura-2-odysseus-en", name: "Odysseus", gender: "male", provider: "deepgram", voiceId: "aura-2-odysseus-en" },
    { id: "aura-2-apollo-en", name: "Apollo", gender: "male", provider: "deepgram", voiceId: "aura-2-apollo-en" },
    { id: "aura-2-arcas-en", name: "Arcas", gender: "male", provider: "deepgram", voiceId: "aura-2-arcas-en" },
    { id: "aura-2-perseus-en", name: "Perseus", gender: "male", provider: "deepgram", voiceId: "aura-2-perseus-en" },
    // Female voices
    { id: "aura-2-thalia-en", name: "Thalia", gender: "female", provider: "deepgram", voiceId: "aura-2-thalia-en" },
    { id: "aura-2-andromeda-en", name: "Andromeda", gender: "female", provider: "deepgram", voiceId: "aura-2-andromeda-en" },
    { id: "aura-2-amathea-en", name: "Amathea", gender: "female", provider: "deepgram", voiceId: "aura-2-amathea-en" },
    { id: "aura-2-stella-en", name: "Stella", gender: "female", provider: "deepgram", voiceId: "aura-2-stella-en" },
];

// ── Fonadalabs Voice Pool ────────────────────────────────────────────
// Known voices with assigned gender tags
const FONADALABS_VOICE_POOL: VoiceOption[] = [
    // Female voices
    { id: "fonadalabs-dhwani", name: "Dhwani", gender: "female", provider: "fonadalabs", voiceId: "Dhwani" },
    { id: "fonadalabs-vaanee", name: "Vaanee", gender: "female", provider: "fonadalabs", voiceId: "Vaanee" },
    { id: "fonadalabs-swara", name: "Swara", gender: "female", provider: "fonadalabs", voiceId: "Swara" },
    { id: "fonadalabs-geetika", name: "Geetika", gender: "female", provider: "fonadalabs", voiceId: "Geetika" },
    { id: "fonadalabs-shruti", name: "Shruti", gender: "female", provider: "fonadalabs", voiceId: "Shruti" },
    { id: "fonadalabs-madhura", name: "Madhura", gender: "female", provider: "fonadalabs", voiceId: "Madhura" },
    // Male voices
    { id: "fonadalabs-naad", name: "Naad", gender: "male", provider: "fonadalabs", voiceId: "Naad" },
    { id: "fonadalabs-taal", name: "Taal", gender: "male", provider: "fonadalabs", voiceId: "Taal" },
    { id: "fonadalabs-raaga", name: "Raaga", gender: "male", provider: "fonadalabs", voiceId: "Raaga" },
    { id: "fonadalabs-sangeet", name: "Sangeet", gender: "male", provider: "fonadalabs", voiceId: "Sangeet" },
    { id: "fonadalabs-pancham", name: "Pancham", gender: "male", provider: "fonadalabs", voiceId: "Pancham" },
    { id: "fonadalabs-rishabh", name: "Rishabh", gender: "male", provider: "fonadalabs", voiceId: "Rishabh" },
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
    // Indian languages
    Hindi: "Hindi",
    Tamil: "Tamil",
    Telugu: "Telugu",
    Bengali: "Bengali",
    Marathi: "Marathi",
    Kannada: "Kannada",
    Malayalam: "Malayalam",
    Gujarati: "Gujarati",
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
    const pool = provider === "deepgram" ? DEEPGRAM_VOICE_POOL : FONADALABS_VOICE_POOL;

    const males = pool.filter((v) => v.gender === "male");
    const females = pool.filter((v) => v.gender === "female");

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
 * Returns the full voice pool for a provider (for admin/debug use).
 */
export function getVoicePool(provider: Provider): VoiceOption[] {
    return provider === "deepgram" ? DEEPGRAM_VOICE_POOL : FONADALABS_VOICE_POOL;
}
