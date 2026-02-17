require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error("GEMINI_API_KEY missing");
        return;
    }

    // Initialize with key, but for listing models we might use a different approach depending on SDK version
    // The current SDK exposes it on the client or via a specific method.
    // However, let's try to make a raw HTTP request to list models if the SDK doesn't obviously expose it in a simple way in this context
    // Actually, let's try to use the SDK if possible, but fallback to fetch.

    console.log("Using Key:", key.substring(0, 10) + "...");

    try {
        const genAI = new GoogleGenerativeAI(key);
        // The SDK might not export listModels directly on the main class in all versions
        // Let's try a raw fetch to the API endpoint to be sure

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await response.json();

        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name}`);
                }
            });
        } else {
            console.log("Error listing models:", data);
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();
