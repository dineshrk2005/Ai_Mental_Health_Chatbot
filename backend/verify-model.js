require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');

async function testModels() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        fs.writeFileSync('model_test_log.txt', "API Key Missing");
        return;
    }

    const genAI = new GoogleGenerativeAI(key);
    const modelsToTry = [
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "models/gemini-2.5-flash"
    ];

    let log = `Testing with Key: ${key.substring(0, 10)}...\n\n`;

    // 1. Try to fetch available models
    try {
        log += "--- API Model List ---\n";
        // Using fetch to bypass potential SDK quirks for listing
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        if (!response.ok) {
            log += `Failed to list models: ${response.status} ${response.statusText}\n`;
            const errText = await response.text();
            log += `Error details: ${errText}\n`;
        } else {
            const data = await response.json();
            if (data.models) {
                data.models.forEach(m => {
                    log += `- ${m.name}\n`;
                });
            }
        }
    } catch (e) {
        log += `Error listing models: ${e.message}\n`;
    }

    log += "\n--- Generation Tests ---\n";

    for (const modelName of modelsToTry) {
        try {
            log += `\nTesting model: ${modelName} ... `;
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            const response = await result.response;
            const text = response.text();
            log += `SUCCESS! Response: ${text.substring(0, 50)}...\n`;
        } catch (error) {
            log += `FAILED: ${error.message}\n`;
        }
    }

    fs.writeFileSync('model_test_log.txt', log);
    console.log("Test complete. Login written to model_test_log.txt");
}

testModels();
