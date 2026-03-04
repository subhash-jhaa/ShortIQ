
const { GoogleGenAI } = require("@google/genai");
require("dotenv").config({ path: ".env.local" });

const apiKey = process.env.GEMINI_API_KEY;

const client = new GoogleGenAI({
    apiKey: apiKey,
});

async function run() {
    // Try with gemini-2.0-flash which we know exists
    const modelId = "gemini-2.0-flash";

    console.log(`Testing JSON mode with ${modelId}...`);

    const tests = [
        { name: "camelCase", config: { responseMimeType: "application/json" } },
        { name: "snake_case", config: { response_mime_type: "application/json" } },
    ];

    for (const test of tests) {
        console.log(`\n--- Test: ${test.name} ---`);
        try {
            const resp = await client.models.generateContent({
                model: modelId,
                contents: "Respond with 'OK' in a JSON object with key 'status'.",
                config: test.config
            });
            console.log(`SUCCESS [${test.name}]! Value:`, JSON.stringify(resp.value));
        } catch (e) {
            console.log(`FAILED [${test.name}]:`, e.message);
            if (e.error) console.log("ERROR BODY:", JSON.stringify(e.error));
        }
    }
}

run();
