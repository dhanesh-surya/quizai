import { GoogleGenAI, Type } from "@google/genai";
import { Difficulty, QuizData, Language } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize the client
const ai = new GoogleGenAI({ apiKey });

export const generateQuiz = async (
  topic: string,
  difficulty: Difficulty,
  count: number,
  language: Language
): Promise<QuizData> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const langName = language === 'hi' ? 'Hindi (Devanagari script)' : 'English';

  const prompt = `
    Generate a quiz about "${topic}" with exactly ${count} questions in ${langName}.
    Difficulty level: ${difficulty}.
    Ensure the questions are clear, accurate, and have exactly 4 options.
    The correctIndex must be 0, 1, 2, or 3 corresponding to the options array.
    Provide a brief explanation for why the answer is correct.
    IMPORTANT: Return the response in ${langName}, but keep the JSON property keys in English (topic, questions, id, question, options, correctIndex, explanation).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  correctIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING }
                },
                required: ["id", "question", "options", "correctIndex", "explanation"]
              }
            }
          },
          required: ["topic", "questions"]
        },
        temperature: 0.7,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response received from AI");

    const data = JSON.parse(text);
    
    // Inject difficulty back into the object for the certificate
    return {
      ...data,
      difficulty
    };

  } catch (error) {
    console.error("Quiz generation error:", error);
    throw new Error("Failed to generate quiz. Please try a different topic or try again later.");
  }
};