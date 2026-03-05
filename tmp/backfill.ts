import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// --- Logic from lib/voice-config.ts (mirrored for backfill) ---
const INDIAN_LANGUAGES = new Set([
    "Hindi", "Tamil", "Telugu", "Bengali", "Marathi", "Kannada", "Malayalam", "Gujarati",
    "Punjabi", "Odia", "Assamese", "Urdu", "Konkani", "Sanskrit",
]);

const LANGUAGE_CODES: Record<string, string> = {
    English: "en", Spanish: "es", German: "de", French: "fr", Dutch: "nl", Italian: "it", Japanese: "ja",
    Hindi: "Hindi", Tamil: "Tamil", Telugu: "Telugu", Bengali: "Bengali", Marathi: "Marathi",
    Kannada: "Kannada", Malayalam: "Malayalam", Gujarati: "Gujarati",
};

function getProvider(language: string) {
    return INDIAN_LANGUAGES.has(language) ? "fonadalabs" : "deepgram";
}

async function backfill() {
    console.log("Fetching series with missing model metadata...");
    const { data: series, error } = await supabase
        .from("series")
        .select("id, language")
        .or("model_name.is.null,model_lang_code.is.null");

    if (error) {
        console.error("Error fetching series:", error);
        return;
    }

    console.log(`Found ${series?.length || 0} series to backfill.`);

    if (!series || series.length === 0) return;

    for (const item of series) {
        const provider = getProvider(item.language);
        const langCode = LANGUAGE_CODES[item.language] || item.language;

        console.log(`Updating series ${item.id}: language=${item.language} -> provider=${provider}, code=${langCode}`);

        const { error: updateError } = await supabase
            .from("series")
            .update({
                model_name: provider,
                model_lang_code: langCode,
            })
            .eq("id", item.id);

        if (updateError) {
            console.error(`Failed to update series ${item.id}:`, updateError);
        }
    }

    console.log("Backfill complete! 🎉");
}

backfill();
