import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export interface GenerationPlan {
  projectName: string;
  steps: string[];
  description: string;
}

export interface CodeFile {
  path: string;
  content: string;
  language: string;
}

export interface CodebasePlan extends GenerationPlan {
  files: CodeFile[];
}

export async function generateCodebase(prompt: string): Promise<CodebasePlan> {
  console.log("Generating codebase with Gemini for prompt:", prompt);
  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: 'user', parts: [{ text: `You are a software architect. Generate a modern application codebase.
        Include package.json, global.css, and core components.
        Target user intent: "${prompt}"` }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            projectName: { type: Type.STRING },
            description: { type: Type.STRING },
            steps: { type: Type.ARRAY, items: { type: Type.STRING } },
            files: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  path: { type: Type.STRING, description: "Relative path from root (e.g. components/Header.tsx)" },
                  content: { type: Type.STRING },
                  language: { type: Type.STRING, description: "file extension without dot" }
                },
                required: ["path", "content", "language"]
              }
            }
          },
          required: ["projectName", "description", "steps", "files"]
        }
      }
    });
    
    console.log("Gemini response received");
    // Structured output in @google/genai is available via .value
    return (result as any).value as CodebasePlan;
  } catch (e) {
    console.error("Gemini failed synthesis:", e);
    throw e;
  }
}
