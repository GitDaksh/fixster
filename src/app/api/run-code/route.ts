import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { code, language = "javascript" } = await req.json();

    if (!code) {
      return NextResponse.json({ 
        output: "Output:\nNo code provided\n\nErrors or Warnings:\nCode cannot be empty\n\nExplanation:\nPlease provide some code to execute."
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        output: "Output:\nError\n\nErrors or Warnings:\nAPI key not configured\n\nExplanation:\nThe server's API key is not properly configured. Please contact support."
      });
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      const prompt = `Act as a code execution engine. You will be provided with ${language} code to execute.
Your response must follow this exact format without any additional text or formatting:

Output:
[Print the actual output from executing the code. If there is no output, write "No output"]

Errors or Warnings:
[List any errors or warnings encountered. If none, write "None"]

Explanation:
[Write a brief, clear explanation of what the code does or attempted to do]

Here is the code to execute:
${code}

Important rules:
1. Do not include any markdown formatting, code blocks, or special characters
2. Keep the exact section headers: "Output:", "Errors or Warnings:", and "Explanation:"
3. Show the actual output that would appear when running the code
4. If there's an error, explain specifically what caused it
5. Keep explanations clear and concise
6. Do not include any additional sections or text`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      
      if (!response.text().includes('Output:') || 
          !response.text().includes('Errors or Warnings:') || 
          !response.text().includes('Explanation:')) {
        throw new Error('Invalid response format from AI');
      }

      return NextResponse.json({ output: response.text() });
    } catch (error) {
      console.error("Code execution error:", error);
      return NextResponse.json({ 
        output: "Output:\nExecution error\n\nErrors or Warnings:\nFailed to process code execution\n\nExplanation:\nThe system encountered an error while trying to execute your code. This might be due to invalid syntax or unsupported operations."
      });
    }
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json({ 
      output: "Output:\nSystem error\n\nErrors or Warnings:\nRequest processing failed\n\nExplanation:\nThe server failed to process your request. Please verify your code and try again."
    });
  }
} 