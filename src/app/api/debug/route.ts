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
  
  const prompt = `You are an expert code debugger and analyzer. Analyze the provided code and format your response in a clear, structured way using Markdown. Include the following sections:

# Code Overview
Provide a brief description of what the code does.

# Issues Found
- List any bugs, errors, or code smells
- Each issue should be on a new line starting with a dash (-)
- Include specific line numbers or sections where issues are found

# Performance Considerations
- List any performance issues or inefficiencies
- Each point should be on a new line starting with a dash (-)
- Include suggestions for optimization

# Best Practices
- List improvements based on modern development standards
- Each point should be on a new line starting with a dash (-)
- Include code examples where relevant

# Security Concerns
- List any security vulnerabilities
- Each point should be on a new line starting with a dash (-)
- Include severity level and potential impact

# Recommendations
Provide specific code improvements with examples in code blocks:

\`\`\`
// Example of improved code
\`\`\`

Here is the code to analyze:

${code}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}