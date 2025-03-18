import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("Missing Gemini API key!");
      return NextResponse.json({ 
        output: "Error: Gemini API key is not configured. Please check server settings." 
      });
    }

    try {
      const analysis = await analyzeCodeWithGemini(code);
      return NextResponse.json({ output: analysis });
    } catch (geminiError) {
      console.error("Gemini API error:", geminiError);
      return NextResponse.json({ 
        output: "Error connecting to Gemini API. Details: " + ((geminiError as Error).message || "Unknown error")
      });
    }
    
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json({ 
      output: "Server error processing request. Check server logs for details." 
    }, { status: 500 });
  }
}

async function analyzeCodeWithGemini(code: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
  const prompt = `You are an expert code debugger and analyzer. Analyze the provided code for bugs, inefficiencies, and potential improvements. 
  Format your response in Markdown with the following sections:
  1. Code Overview - Briefly describe what the code seems to be doing
  2. Issues Found - List and describe any bugs, errors, or code smells
  3. Performance Considerations - Note any inefficiencies or performance issues
  4. Best Practices - Suggest improvements based on modern development standards
  5. Security Concerns - Highlight any security vulnerabilities
  6. Recommendations - Provide specific code improvements with examples
  
  Here is the code to analyze:
  
  ${code}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}