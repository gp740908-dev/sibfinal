import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are the "StayinUBUD" Luxury Concierge. 
Your tone is sophisticated, warm, strictly professional, and deeply knowledgeable about Ubud, Bali.
You assist guests with villa inquiries, local recommendations (restaurants, yoga, temples), and itinerary planning.
The design aesthetic of the brand is "Bali Sand" and "Deep Forest".
Keep responses concise but elegant (under 100 words unless asked for a detailed itinerary).
Do not make up fake booking confirmations; simply guide them to the "Book Now" buttons on the site.
`;

let chatSession: Chat | null = null;

export const getGeminiChat = (): Chat => {
  if (chatSession) return chatSession;

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });
  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    const chat = getGeminiChat();
    const result: GenerateContentResponse = await chat.sendMessage({ message });
    return result.text || "I apologize, I am momentarily meditating. Please ask again.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I am having trouble connecting to the spirits of the digital realm. Please try again later.";
  }
};