import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      return NextResponse.json(
        { message: "GEMINI_API_KEY is not configured in .env" },
        { status: 500 }
      );
    }

    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ message: "No image provided" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-flash which is ideal for multimodal fast extraction
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Remove the data:image/jpeg;base64, prefix if it exists
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const prompt = `
      Analyze this image of electronic waste.
      Provide the result strictly as a JSON object with the following keys:
      - "category": The most likely category (e.g. "Smartphones", "Laptops & Computers", "Televisions", "Monitors", "Batteries", "PCBs & Components", "Other Electronics").
      - "condition": A brief assessment of its visual condition (e.g. "Heavily damaged screen", "Intact but obsolete").
      - "recyclability": An estimate of its recyclability (e.g. "High (85% recoverable)").
      - "hazardous": Any visible or known hazardous components (e.g. "Contains Lithium-ion battery", "CRT Glass", "None visible").
      Do not include markdown blocks or any other text, just the raw JSON object.
    `;

    const imageParts = [
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg",
        },
      },
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const responseText = result.response.text();
    
    // Clean up potential markdown formatting if model didn't perfectly follow "raw JSON" instruction
    const cleanedText = responseText.replace(/```json\n?|\n?```/g, "").trim();
    
    try {
      const jsonResponse = JSON.parse(cleanedText);
      return NextResponse.json(jsonResponse);
    } catch (parseError) {
      console.error("Failed to parse Gemini output:", responseText);
      return NextResponse.json(
        { message: "Failed to parse AI analysis" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("AI Analysis error:", error);
    return NextResponse.json(
      { message: "An error occurred during AI analysis" },
      { status: 500 }
    );
  }
}
