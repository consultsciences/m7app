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
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `You are a legendary software architect. Given the user's prompt, generate a full-stack Next.js project scaffold.
    Include core files: package.json, tsconfig.json, tailwind.config.ts, layout.tsx, page.tsx, and at least 2 relevant components/lib files.
    The code must be beautiful, modern, and follow best practices.
    
    User Request: "${prompt}"`,
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
                path: { type: Type.STRING, description: "Relative path from root (e.g. app/page.tsx)" },
                content: { type: Type.STRING },
                language: { type: Type.STRING, description: "file extension without dot (e.g. tsx, ts, json)" }
              },
              required: ["path", "content", "language"]
            }
          }
        },
        required: ["projectName", "description", "steps", "files"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse codebase generation", e);
    throw e;
  }
}
