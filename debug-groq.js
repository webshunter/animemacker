// Debug script untuk test Groq API
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

console.log("Environment check:");
console.log("GROQ_API_KEY:", process.env.GROQ_API_KEY ? "Present" : "Missing");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function testGroq() {
  try {
    console.log("Testing Groq API...");
    
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: "Generate a simple JSON: {\"test\": \"hello\"}"
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.8,
      max_tokens: 100,
    });

    console.log("Groq response:", response.choices[0]?.message?.content);
    console.log("✅ Groq API working!");
    
  } catch (error) {
    console.error("❌ Groq API error:", error.message);
  }
}

testGroq();
