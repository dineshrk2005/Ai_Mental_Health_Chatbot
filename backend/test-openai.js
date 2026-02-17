require('dotenv').config();
const OpenAI = require("openai");

async function testOpenAI() {
    console.log("--- OPENAI/OPENROUTER REPLACEMENT TEST ---");

    // Explicitly use the key user provided if not in .env yet, or load from .env
    // But since we are about to test if the key works, let's look at .env or use the one we plan to use.
    // For this test script, I will try to read from env, but if missing, I warn.

    const apiKey = process.env.OPENAI_API_KEY;
    const baseURL = process.env.OPENAI_BASE_URL;

    console.log("API Key Prefix: " + (apiKey ? apiKey.substring(0, 15) + "..." : "MISSING"));
    console.log("Base URL: " + (baseURL || "Default (https://api.openai.com/v1)"));

    if (!apiKey) {
        console.error("❌ No API Key found.");
        return;
    }

    const openai = new OpenAI({
        apiKey: apiKey,
        baseURL: baseURL
    });

    const fs = require('fs');
    let logBuffer = "";
    function log(msg) {
        console.log(msg);
        logBuffer += msg + "\n";
    }

    const modelsToTry = [
        "google/gemini-2.0-flash-exp:free",
        "google/gemini-2.0-flash-thinking-exp:free",
        "meta-llama/llama-3.2-1b-instruct:free",
        "meta-llama/llama-3.2-3b-instruct:free",
        "meta-llama/llama-3-8b-instruct:free",
        "mistralai/mistral-7b-instruct:free",
        "microsoft/phi-3-mini-128k-instruct:free",
        "huggingfaceh4/zephyr-7b-beta:free",
        "openchat/openchat-7:free"
    ];

    log("--- OPENAI/OPENROUTER TEST LOG ---");
    log("API Key Prefix: " + (apiKey ? apiKey.substring(0, 10) + "..." : "MISSING"));

    for (const model of modelsToTry) {
        try {
            log(`\n🔄 Testing Model: ${model}...`);
            const response = await openai.chat.completions.create({
                model: model,
                messages: [
                    { role: "user", content: "Hello! Just checking if you work." }
                ],
            });

            log(`✅ Success with ${model}!`);
            log("Response: " + response.choices[0].message.content);
            log(`\n💡 RECOMMENDATION: Update your .env file with: OPENAI_MODEL=${model}`);
            fs.writeFileSync('test_openai_log.txt', logBuffer);
            return; // Exit on first success
        } catch (error) {
            log(`❌ Failed with ${model}:`);
            if (error.response) {
                log(`   Status: ${error.status}`);
                log(`   Data: ${JSON.stringify(error.error || error.response.data)}`);
            } else {
                log(`   Error: ${error.message}`);
            }
        }
    }
    log("\n❌ All models failed.");
    log("--- TEST END ---");
    fs.writeFileSync('test_openai_log.txt', logBuffer);
}

testOpenAI();
