
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GameCategory, AIModel, DrawingDifficulty } from '../types'; // Added DrawingDifficulty
import { TEXT_MODEL_ID, CONCEPT_GENERATION_PROMPT_TEMPLATE, DRAWING_GENERATION_PROMPT_TEMPLATE, IMAGE_MODELS, DIFFICULTY_MODIFIERS } from '../constants'; // Added DIFFICULTY_MODIFIERS

let ai: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not configured. Please set the API_KEY environment variable.");
  }
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

const cleanGeminiTextResponse = (text: string): string => {
  let cleanedText = text.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = cleanedText.match(fenceRegex);
  if (match && match[2]) {
    cleanedText = match[2].trim();
  }
  if ((cleanedText.startsWith('"') && cleanedText.endsWith('"')) || (cleanedText.startsWith("'") && cleanedText.endsWith("'"))) {
    cleanedText = cleanedText.substring(1, cleanedText.length - 1);
  }
  return cleanedText;
};

export const generateConceptFromAPI = async (category: GameCategory): Promise<string> => {
  const client = getAiClient();
  const prompt = CONCEPT_GENERATION_PROMPT_TEMPLATE(category);
  try {
    const response: GenerateContentResponse = await client.models.generateContent({
      model: TEXT_MODEL_ID,
      contents: prompt,
    });
    const concept = cleanGeminiTextResponse(response.text);
    if (!concept) {
      throw new Error("AI failed to generate a concept.");
    }
    return concept;
  } catch (error) {
    console.error("Error generating concept:", error);
    if (error instanceof Error) {
       throw new Error(`Failed to generate concept: ${error.message}`);
    }
    throw new Error("Failed to generate concept due to an unknown error.");
  }
};

export const generateDrawingFromAPI = async (
  concept: string, 
  imageModelId: string, 
  difficulty: DrawingDifficulty // Added difficulty
): Promise<string> => {
  const client = getAiClient();
  
  const selectedModel = IMAGE_MODELS.find(model => model.id === imageModelId);
  if (!selectedModel) {
    throw new Error(`Image model with ID ${imageModelId} not found.`);
  }

  let fullPrompt = DRAWING_GENERATION_PROMPT_TEMPLATE(concept);
  
  if (selectedModel.promptModifier) {
    fullPrompt = selectedModel.promptModifier(fullPrompt);
  }

  fullPrompt += ` ${DIFFICULTY_MODIFIERS[difficulty]}`; // Append difficulty modifier

  try {
    const response = await client.models.generateImages({
        model: imageModelId,
        prompt: fullPrompt, // Use the fully constructed prompt
        config: { numberOfImages: 1, outputMimeType: 'image/png' },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
      throw new Error("AI failed to generate an image.");
    }
    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    return `data:image/png;base64,${base64ImageBytes}`;
  } catch (error) {
    console.error("Error generating drawing:", error);
    console.error("Full prompt sent to API:", fullPrompt); // Log the prompt on error
    if (error instanceof Error) {
       throw new Error(`Failed to generate drawing: ${error.message}`);
    }
    throw new Error("Failed to generate drawing due to an unknown error.");
  }
};