
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
  // For example:
  // {
  //   id: 'another-image-model-id',
  //   name: 'Alternative Image Model',
  //   description: 'Generates images with a different style.',
  //   type: 'image',
  //   promptModifier: (currentPrompt: string) => `${currentPrompt} Style: cartoon.`, // Updated signature
  // },
];

export const INITIAL_GUESSES = 3;

export const CONCEPT_GENERATION_PROMPT_TEMPLATE = (category: string): string =>
  `Generate a single, common, concrete, and SFW (Safe For Work) noun or simple verb phrase suitable for a Pictionary-style drawing game, from the category: "${category}". Return only the word or phrase itself. Do not include any introductory text, explanations, or quotation marks. For example, if the category is "Food", a valid response would be "Banana" or "Drinking Coffee".`;

export const DRAWING_GENERATION_PROMPT_TEMPLATE = (concept: string): string =>
  `Simple Pictionary-style black and white line art drawing of "${concept}". Minimalist, black outline on a plain white background. Clear, easily recognizable subject. **Do not include any text, words, letters, or labels on the drawing itself. The image should contain only the drawing, no accompanying text.**`;

// Difficulty settings
export const DIFFICULTY_LEVELS: DrawingDifficulty[] = ['easy', 'medium', 'hard'];

export const DIFFICULTY_MODIFIERS: Record<DrawingDifficulty, string> = {
  easy: "Very clear, simple, bold outlines. Highly recognizable, like a quick sketch.",
  medium: "Slightly abstract, minimalist lines, some deliberate ambiguity. Can be slightly messy or less detailed.",
  hard: "Highly minimalist, abstract, only essential features. Very challenging to guess, wobbly lines, hurried sketch effect. Minimal strokes to convey the idea.",
};

export const SVG_NAMESPACE = "http://www.w3.org/2000/svg";