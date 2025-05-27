
export enum GameCategory {
  OBJECTS = "Objects",
  ANIMALS = "Animals",
  ACTIONS = "Actions",
  FOOD = "Food",
  NATURE = "Nature",
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
  type: 'text' | 'image';
  promptModifier?: (currentPrompt: string) => string; // Updated signature
}

export type DrawingDifficulty = 'easy' | 'medium' | 'hard';

export interface GameState {
  currentConcept: string | null;
  generatedImageUrl: string | null;
  guessesRemaining: number;
  isConceptRevealed: boolean;
  isRoundOver: boolean;
  feedbackMessage: string;
  selectedCategory: GameCategory;
  selectedImageModelId: string;
  selectedDifficulty: DrawingDifficulty; // Added
  isLoadingConcept: boolean;
  isLoadingDrawing: boolean;
  error: string | null;
  userGuess: string;
  apiKeyMissing: boolean;
}

export interface SelectOption {
  value: string;
  label: string;
}