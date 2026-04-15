import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function getAIResponse(message: string) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent([
      "You are a smart safety assistant for Bangladesh. Reply short (max 2 lines), clear, and helpful.",
      message,
    ]);

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error(error);
    return "AI is not available right now.";
  }
}