// Test environment variables di frontend
console.log("Frontend Environment Test:");
console.log("GROQ_API_KEY:", import.meta.env.VITE_GROQ_API_KEY ? "Present" : "Missing");
console.log("process.env.GROQ_API_KEY:", process.env.GROQ_API_KEY ? "Present" : "Missing");
