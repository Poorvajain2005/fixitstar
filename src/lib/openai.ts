import OpenAI from "openai";

// Agar code browser par compile ho raha hai toh error nahi aayega
const apiKey = typeof window === "undefined" 
  ? (process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY) 
  : null;

export const openai = new OpenAI({
  apiKey: apiKey || "dummy-key-for-client-compilation",
  dangerouslyAllowBrowser: true, // Client-side hydration crash se bachane ke liye
});