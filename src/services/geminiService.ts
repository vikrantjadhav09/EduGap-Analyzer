import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export interface AnalysisResult {
  skills: string[];
  gaps: string[];
  matchPercentage: number;
  roadmap: string;
  optimizedResume: string;
  jobDescription?: string;
  resumeText?: string;
}

export async function fetchJobDescription(companyName: string, role: string): Promise<string> {
  const model = "gemini-3-flash-preview";
  const prompt = `Find the job description for a ${role} position at ${companyName}. Provide the full text of the job description, including requirements and responsibilities.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    return response.text;
  } catch (error: any) {
    if (error?.status === 429 || error?.message?.includes("429")) {
      throw new Error("Gemini API quota exceeded. Please check your billing/plan.");
    }
    const msg = error?.message || error?.toString();
    throw new Error(`Gemini API Error: ${msg}`);
  }
}

export async function analyzeResume(resumeText: string, jobDescription: string): Promise<AnalysisResult> {
  const model = "gemini-3-flash-preview";

  const prompt = `
    Compare this Resume Text with this Job Description.
    
    Resume Text:
    ${resumeText}
    
    Job Description:
    ${jobDescription}
    
    Analyze the following:
    1. Extract technical skills from the resume.
    2. Identify missing technical skills based on the job description.
    3. Calculate a match percentage (0-100).
    4. Provide a 7-day or 30-day "Sprint" learning roadmap with links to documentation.
    5. Rewrite the resume bullet points to better match the keywords in the job description.
    
    Return the result in JSON format with the following schema:
    {
      "skills": ["skill1", "skill2"],
      "gaps": ["gap1", "gap2"],
      "matchPercentage": number,
      "roadmap": "markdown string",
      "optimizedResume": "markdown string"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            skills: { type: Type.ARRAY, items: { type: Type.STRING } },
            gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
            matchPercentage: { type: Type.NUMBER },
            roadmap: { type: Type.STRING },
            optimizedResume: { type: Type.STRING },
          },
          required: ["skills", "gaps", "matchPercentage", "roadmap", "optimizedResume"],
        },
      },
    });

    return JSON.parse(response.text);
  } catch (error: any) {
    if (error?.status === 429 || error?.message?.includes("429")) {
      throw new Error("Gemini API quota exceeded. Please check your billing/plan.");
    }
    const msg = error?.message || error?.toString();
    throw new Error(`Gemini API Error: ${msg}`);
  }
}
