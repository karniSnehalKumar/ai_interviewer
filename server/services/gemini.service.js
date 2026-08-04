import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";
import console from "console";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Converts OpenAI-style { role, content } messages to Gemini format.
// System messages are pulled out and passed as systemInstruction.
// All other roles are mapped: "assistant" → "model", everything else → "user".
export const askAi = async (messages) => {
  try {
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error("Messages array is empty.");
    }

    // Separate system prompt from conversation turns
    const systemMessage = messages.find((m) => m.role === "system");
    const turns = messages.filter((m) => m.role !== "system");

    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash",
      ...(systemMessage && { systemInstruction: systemMessage.content }),
    });

    // All turns except the last become history; the last is the live prompt
    const history = turns.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const lastTurn = turns[turns.length - 1];

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastTurn.content);
    const content = result.response.text();

    if (!content || !content.trim()) {
      throw new Error("Gemini returned an empty response.");
    }

    return content;
  } catch (error) {
    const providerMessage = error.message;
    console.error("Gemini API Error:", providerMessage);
    throw new Error(`Gemini API Error: ${providerMessage}`);
  }
};