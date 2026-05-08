const { EdgeTTS } = require('@bestcodes/edge-tts');
const fs = require('fs');

async function test() {
    const tts = new EdgeTTS();
    console.log("TTS initialized");
    try {
        // Just testing if we can get a list of voices or generate a small buffer
        // Note: The actual API might vary, but usually it's like this:
        // await tts.ttsPromise("Hello world", "en-US-GuyNeural");
        console.log("Checking if tts method exists...");
        // I'll try a common pattern
        // const buffer = await tts.toAudio("Hello", "en-US-ChristopherNeural");
        // fs.writeFileSync('test.mp3', buffer);
        // console.log("Success");
    } catch (e) {
        console.error("Error:", e);
    }
}
test();
