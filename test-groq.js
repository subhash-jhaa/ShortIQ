const Groq = require("groq-sdk");
require("dotenv").config({ path: ".env.local" });

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function run() {
    console.log("Testing Groq API (llama-3.3-70b-versatile) with JSON mode...\n");
    try {
        const completion = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{
                role: "user",
                content: "Generate a short video script for a 30-second motivational video about fitness. Return JSON with keys: title, total_script, scenes (array of {scene_script, image_prompt})."
            }],
            response_format: { type: "json_object" },
            temperature: 0.7,
        });

        const text = completion.choices[0]?.message?.content;
        const parsed = JSON.parse(text);
        console.log("✅ SUCCESS!");
        console.log("Title:", parsed.title);
        console.log("Scenes:", parsed.scenes?.length);
        console.log("Full output:", JSON.stringify(parsed, null, 2));
    } catch (err) {
        console.error("❌ FAILED:", err.message);
    }
}

run();
