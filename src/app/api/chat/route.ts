import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("Missing Gemini API key!");
      return NextResponse.json({ 
        output: "I'm sorry, I'm having trouble connecting to my services. Please try again later." 
      });
    }

    try {
      const response = await generateChatResponse(code);
      return NextResponse.json({ output: response });
    } catch (geminiError) {
      console.error("Gemini API error:", geminiError);
      return NextResponse.json({ 
        output: "I'm sorry, I'm having trouble processing your request right now. Please try again later."
      });
    }
    
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json({ 
      output: "I apologize, but something went wrong. Please try again later." 
    }, { status: 500 });
  }
}

async function generateChatResponse(message: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
  const prompt = `You are a helpful, intelligent assistant. Respond to the following message from a user:

"${message}"

Respond in a conversational manner. If the user asks for code, format it properly using Markdown. If the user asks for a list, use Markdown to format it properly. If the user asks for a table, use Markdown to format it properly.`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}