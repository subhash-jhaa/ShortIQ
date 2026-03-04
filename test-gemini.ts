
import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("GEMINI_API_KEY not found in .env.local");
    process.exit(1);
}

console.log("Testing Gemini API...");
const client = new GoogleGenAI(apiKey); // Note: Simple string pass to constructor for older SDK versions
const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });

async function run() {
    try {
        console.log("Sending prompt...");
        const result = await model.generateContent("Respond with 'HELLO WORLD' if you can read this.");
        const text = result.response.text();
        console.log("Response:", text);
    } catch (err: any) {
        console.error("Error:", err.message);
    }
}

run();
