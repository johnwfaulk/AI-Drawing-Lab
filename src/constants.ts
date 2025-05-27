
import { GameCategory, AIModel, DrawingDifficulty } from './types'; // Added DrawingDifficulty

export const GAME_CATEGORIES: GameCategory[] = [
  GameCategory.OBJECTS,
  GameCategory.ANIMALS,
  GameCategory.ACTIONS,
  GameCategory.FOOD,
  GameCategory.NATURE,
];

export const TEXT_MODEL_ID = 'gemini-2.5-flash-preview-04-17';
export const DEFAULT_IMAGE_MODEL_ID = 'imagen-3.0-generate-002';

export const TEXT_MODEL_INFO: AIModel = {
  id: TEXT_MODEL_ID,
  name: 'Gemini 2.5 Flash (Concept Generation)',
  description: 'Generates concepts for drawing.',
  type: 'text',
};

export const IMAGE_MODELS: AIModel[] = [
  {
    id: DEFAULT_IMAGE_MODEL_ID,
    name: 'Imagen 3 (Default)',
    description: 'Generates Pictionary-style drawings.',
    type: 'image',
    // Example of new promptModifier signature, though not used by default model
    // promptModifier: (currentPrompt: string) => `${currentPrompt} Another style detail.`,
  },
  // Add other image models here for comparison if needed in the future.
];

export const INITIAL_GUESSES = 3;

export const CONCEPT_GENERATION_PROMPT_TEMPLATE = (category: string): string =>
  `Generate a single, common, concrete, and SFW (Safe For Work) noun or simple verb phrase suitable for a Pictionary-style drawing game, from the category: "${category}". Return only the word or phrase itself. Do not include any introductory text, explanations, or quotation marks. For example, if the category is "Food", a valid response would be "Banana" or "Drinking Coffee".`;

export const SYSTEM_INSTRUCTION_FOR_IMAGE_MODEL = `You are an AI specialized in creating minimalist, black and white, Pictionary-style line drawings.
CRITICAL RULE: NEVER, UNDER ANY CIRCUMSTANCES, include any text, words, letters, labels, or alphanumeric characters directly on the image itself. The output must be purely a visual drawing.
Your drawings should resemble quick, hand-drawn sketches by a human, focusing on essential features only. No shading, no complex details, no colors. The background must be plain white.`;

export const DRAWING_GENERATION_PROMPT_TEMPLATE = (concept: string): string =>
  `Draw a simple line art representation of "${concept}".`;

// Difficulty settings
export const DIFFICULTY_LEVELS: DrawingDifficulty[] = ['easy', 'medium', 'hard'];

export const DIFFICULTY_MODIFIERS: Record<DrawingDifficulty, string> = {
  easy: "The drawing should be very clear and instantly recognizable, like a neat sketch.",
  medium: "The drawing should have slight imperfections, with some deliberate wobbles or less precise lines, resembling a hasty human sketch. Focus on simplification.",
  hard: "The drawing should be highly abstract and minimalist, with very rough, wobbly, and hurried lines. Only essential features should be present, conveying the idea with deliberate imperfection and extreme simplification, akin to a challenging, quickly drawn Pictionary sketch by a less skilled artist.",
};

export const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
