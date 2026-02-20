
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function run() {
    try {
        // For Node.js, we might need to use the model listing API if exposed, 
        // but the SDK structure focuses on getGenerativeModel.
        // However, we can try to "probe" common models.

        const modelsToCheck = [
            "gemini-1.5-flash",
            "gemini-1.5-flash-001",
            "gemini-1.5-flash-002",
            "gemini-1.5-pro",
            "gemini-pro",
            "gemini-1.0-pro"
        ];

        console.log("Checking models with provided API Key...");

        for (const modelName of modelsToCheck) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello");
                const response = await result.response;
                console.log(`✅ Model '${modelName}' is AVAILABLE. Response: ${response.text().slice(0, 20)}...`);
                return; // Found a working one, exit
            } catch (e) {
                console.log(`❌ Model '${modelName}' failed: ${e.message.split('[')[0]}`); // simplify error
            }
        }
    } catch (e) {
        console.error("Global error:", e);
    }
}

run();
