require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');

async function testGemini() {
    let logOutput = "";
    function log(msg) {
        console.log(msg);
        logOutput += msg + "\n";
    }

    log("--- GEMINI API KEY TEST ---");
    const key = process.env.GEMINI_API_KEY;

    if (!key) {
        log("❌ ERROR: GEMINI_API_KEY is missing in .env");
        fs.writeFileSync('test_result.log', logOutput);
        return;
    }

    log("✅ Key found (Prefix): " + key.substring(0, 10) + "...");
    const genAI = new GoogleGenerativeAI(key);

    // 1. Try to list models (skipped, focusing on generation)

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        log("🔄 Attempting to generate with 'gemini-2.5-flash'...");
        const result = await model.generateContent("Test connection.");
        const response = await result.response;
        log("✅ 'gemini-2.5-flash' Success! Response: " + response.text());

    } catch (error) {
        log("❌ 'gemini-2.5-flash' Failed: " + error.message);

        // Try flash-lite again just in case
        try {
            const modelLite = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
            log("🔄 Attempting to generate with 'gemini-2.5-flash-lite'...");
            const resultLite = await modelLite.generateContent("Test connection.");
            log("✅ 'gemini-2.5-flash-lite' Success!");
        } catch (errLite) {
            log("❌ 'gemini-2.5-flash-lite' Failed: " + errLite.message);
        }
    }

    log("--- TEST END ---");
    fs.writeFileSync('test_result.log', logOutput);
}

testGemini();
