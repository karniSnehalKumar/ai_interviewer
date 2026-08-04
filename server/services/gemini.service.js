import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";
import console from "console";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const askAi = async (messages) => {
  try {
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error("Messages array is empty.");
    }

    const systemMessage = messages.find((m) => m.role === "system");
    const turns = messages.filter((m) => m.role !== "system");

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      ...(systemMessage && { systemInstruction: systemMessage.content }),
    });

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