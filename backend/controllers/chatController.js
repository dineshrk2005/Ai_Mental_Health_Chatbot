const asyncHandler = require('express-async-handler');
const Chat = require('../models/Chat');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const OpenAI = require('openai');

// Initialize AI Providers
console.log("--- Chat Controller Initializing ---");
console.log("AI_PROVIDER:", process.env.AI_PROVIDER);
console.log("OpenAI Key Present:", !!process.env.OPENAI_API_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

let openai;
if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: process.env.OPENAI_BASE_URL || undefined
    });
}

const PROVIDER = process.env.AI_PROVIDER || 'gemini';

// Master Prompt System (Shared)
const generateSystemPrompt = (language = 'English') => `
You are Serenity AI, an empathetic, professional mental health companion.
Your goal is to provide emotional support and evidence-based suggestions.

INPUT CONTEXT:
- The user is speaking in ${language}.
- Reply in ${language}.

OUTPUT FORMAT:
Return a JSON object with this exact schema:
{
  "text": "Your helpful, empathetic response here (max 3-4 sentences).",
  "sentiment": "Positive" | "Neutral" | "Negative" | "Anxious" | "Sad" | "Angry",
  "isCrisis": boolean (true if self-harm, suicide, or extreme danger is detected)
}

RULES:
- Handle typos like "I am fail in love" intelligently (interpret context).
- If 'isCrisis' is true, your 'text' MUST be a supportive safety message urging professional help immediately.
- Never diagnose or prescribe.
`;

// Helper: Process with Gemini
const processWithGemini = async (message, history, language) => {
    // Try primary model first (gemini-2.5-flash)
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { responseMimeType: "application/json" } });
        return await executeGeminiChat(model, message, history, language);
    } catch (error) {
        console.warn("Gemini 2.5 Flash failed, trying fallback to 2.5 Flash Lite...");
        console.error(error);
        // Fallback to lighter model
        const fallbackModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
        return await executeGeminiChat(fallbackModel, message, history, language);
    }
};

const executeGeminiChat = async (model, message, history, language) => {
    const formattedHistory = history.map(doc => ({
        role: doc.sender === 'user' ? 'user' : 'model',
        parts: [{ text: doc.message }]
    }));

    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: generateSystemPrompt(language) + "\nIMPORTANT: RESPONSE MUST BE VALID JSON." }]
            },
            {
                role: "model",
                parts: [{ text: JSON.stringify({ text: "Understood. Serenity AI ready.", sentiment: "Neutral", isCrisis: false }) }]
            },
            ...formattedHistory
        ]
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    // Clean up response if it has markdown code blocks (Gemini Pro often adds them)
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
};

// Helper: Process with OpenAI
const processWithOpenAI = async (message, history, language) => {
    if (!openai) throw new Error("OpenAI API Key not configured");

    const formattedHistory = history.map(doc => ({
        role: doc.sender === 'user' ? 'user' : 'assistant',
        content: doc.message
    }));

    const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o",
        response_format: { type: "json_object" },
        messages: [
            { role: "system", content: generateSystemPrompt(language) },
            ...formattedHistory,
            { role: "user", content: message }
        ]
    });

    return JSON.parse(completion.choices[0].message.content);
};

// @desc    Process a new message from user
// @route   POST /api/chat
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
    console.log("sendMessage called");
    console.log("Body:", req.body);
    console.log("User Context:", req.user ? req.user._id : "No User");
    const { message, language = 'English' } = req.body;

    // 1. Fetch recent history for context
    const historyDocs = await Chat.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(10);

    // Reverse to chronological order
    const history = historyDocs.reverse();

    try {
        let aiData;

        // Switch Provider with Fallback
        console.log("Using Provider logic. Configured:", PROVIDER);
        if (PROVIDER === 'openai' && openai) {
            aiData = await processWithOpenAI(message, history, language);
        } else {
            if (PROVIDER === 'openai') console.warn("OpenAI provider selected but key missing. Falling back to Gemini.");
            aiData = await processWithGemini(message, history, language);
        }

        // 2. Save User Message
        const userChat = await Chat.create({
            user: req.user._id,
            message,
            sender: 'user',
            sentiment: aiData.sentiment
        });

        // 3. Save AI Response
        const aiChat = await Chat.create({
            user: req.user._id,
            message: aiData.text,
            sender: 'ai',
            sentiment: 'neutral'
        });

        // Return structured data
        res.status(201).json({
            userMessage: userChat,
            aiMessage: aiChat,
            analysis: {
                sentiment: aiData.sentiment,
                isCrisis: aiData.isCrisis
            }
        });

    } catch (error) {
        console.error("!!! CRITICAL AI CONTROLLER ERROR !!!");
        console.error("Error Message:", error.message);
        console.error("Error Stack:", error.stack);
        console.error("Request Body:", req.body);

        // --- EMERGENCY MOCK FALLBACK ---
        // If both keys fail (Gemini 404/Quota, OpenAI Missing), we fall back to a local rules-based response
        // so the user isn't left hanging.

        console.warn("Falling back to local mock response due to API failure.");

        const mockResponse = {
            text: "I am having trouble reaching my brain (API Connection Error), but I am still here. This is a local backup response. Please verify your API Keys in the backend .env file.",
            sentiment: "Neutral",
            isCrisis: false
        };

        // Simple Keyword Matching for Mock Logic
        const lowerMsg = message.toLowerCase();
        if (lowerMsg.includes('sad') || lowerMsg.includes('depress')) {
            mockResponse.text = "I hear that you're feeling down. I'm operating in offline mode, but I want you to know you matter.";
            mockResponse.sentiment = "Sad";
        } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
            mockResponse.text = "Hello! I am currently offline (Mode: Standby), but I can still listen.";
            mockResponse.sentiment = "Happy";
        }

        // 2. Save User Message
        const userChat = await Chat.create({
            user: req.user._id,
            message,
            sender: 'user',
            sentiment: mockResponse.sentiment
        });

        // 3. Save AI Response (Mock)
        const aiChat = await Chat.create({
            user: req.user._id,
            message: mockResponse.text,
            sender: 'ai',
            sentiment: 'neutral'
        });

        res.status(201).json({
            userMessage: userChat,
            aiMessage: aiChat,
            analysis: {
                sentiment: mockResponse.sentiment,
                isCrisis: mockResponse.isCrisis
            }
        });
    }
});

// @desc    Get chat history
// @route   GET /api/chat
// @access  Private
const getChatHistory = asyncHandler(async (req, res) => {
    const chats = await Chat.find({ user: req.user._id }).sort({ createdAt: 1 });
    res.json(chats);
});

module.exports = { sendMessage, getChatHistory };
