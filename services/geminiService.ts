
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, EvaluationResult, StudyPlanParams } from "../types.ts";

// Fix: Initialize GoogleGenAI using process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAITutorResponse = async (history: { role: 'user' | 'model', parts: { text: string }[] }[], message: string) => {
  const model = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [...history, { role: 'user', parts: [{ text: message }] }],
    config: {
      systemInstruction: `You are 'UPSC Ease Mentor', an expert academic coach for the Indian Civil Services Examination. 
      Your goal is to simplify complex topics (Polity, Economy, History, Geography, Ethics) into easy-to-understand concepts.
      Use analogies, clear structures, and bullet points. Always link concepts to the UPSC syllabus where relevant.
      Be encouraging, precise, and professional.`
    }
  });
  return model.text;
};

export const generateQuiz = async (topic: string): Promise<QuizQuestion[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate 5 challenging UPSC Prelims-style MCQs about: ${topic}. Each question must include a 'subject' field (e.g., 'Polity', 'History', 'Economy').`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.INTEGER, description: "Index of the correct option (0-3)" },
            explanation: { type: Type.STRING },
            subject: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswer", "explanation", "subject"]
        }
      }
    }
  });
  
  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    console.error("Failed to parse quiz JSON", e);
    return [];
  }
};

export const generateMockTest = async (count: number = 10): Promise<QuizQuestion[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a mixed UPSC Prelims Mock Test with ${count} questions covering Polity, History, Economy, Geography, and S&T.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.INTEGER },
            explanation: { type: Type.STRING },
            subject: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswer", "explanation", "subject"]
        }
      }
    }
  });
  
  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    return [];
  }
};

export const generateStudyPlan = async (params: StudyPlanParams): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Create a personalized UPSC study plan. 
    Params: ${params.hoursPerDay} hours/day for ${params.durationWeeks} weeks. 
    Focus Topics: ${params.focusTopics.join(', ')}. 
    Level: ${params.level}.
    Format the output with Markdown, including weekly goals and a daily routine example.`,
    config: {
      thinkingConfig: { thinkingBudget: 2000 }
    }
  });
  return response.text || "Failed to generate plan.";
};

export const evaluateMainsAnswer = async (question: string, answer: string): Promise<EvaluationResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Evaluate this UPSC Mains answer.\nQuestion: ${question}\nAnswer: ${answer}`,
    config: {
      thinkingConfig: { thinkingBudget: 4000 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER, description: "Score out of 10" },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          modelAnswerSummary: { type: Type.STRING, description: "Key points that should have been included" }
        },
        required: ["score", "strengths", "weaknesses", "suggestions", "modelAnswerSummary"]
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    throw new Error("Evaluation failed to parse.");
  }
};

export const getDailyCurrentAffairs = async () => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: "Provide the top 5 news highlights for today relevant to UPSC (Polity, Economy, International Relations, S&T, Environment). Include the 'Syllabus Link' for each.",
    config: {
      tools: [{ googleSearch: {} }]
    }
  });
  
  // Fix: Extract and append grounding chunks (URLs) as per Google Search grounding guidelines
  let text = response.text || '';
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (chunks && chunks.length > 0) {
    const links = chunks
      .map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri)
      .map((web: any) => `- [${web.title || web.uri}](${web.uri})`)
      .join('\n');
    
    if (links) {
      text += `\n\n### Sources & References\n${links}`;
    }
  }
  return text;
};
