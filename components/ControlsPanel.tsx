
import React from 'react';
import { GameCategory, AIModel, SelectOption, DrawingDifficulty } from '../types'; // Added DrawingDifficulty
import SelectDropdown from './SelectDropdown';
import Button from './Button';
import TextInput from './TextInput';
import Spinner from './Spinner';
import SparkleIcon from './SparkleIcon';
import { DIFFICULTY_LEVELS } from '../constants'; // Added DIFFICULTY_LEVELS

interface ControlsPanelProps {
  categories: SelectOption[];
  selectedCategory: GameCategory;
  onCategoryChange: (category: GameCategory) => void;
  imageModels: SelectOption[];
  selectedImageModelId: string;
  onImageModelChange: (modelId: string) => void;
  
  selectedDifficulty: DrawingDifficulty; // Added
  onDifficultyChange: (difficulty: DrawingDifficulty) => void; // Added

  onGenerateNewDrawing: () => void;
  isGenerating: boolean;
  userGuess: string;
  onUserGuessChange: (guess: string) => void;
  onSubmitGuess: () => void;
  canSubmitGuess: boolean;
  onRevealConcept: () => void;
  canRevealConcept: boolean;
  feedbackMessage: string;
  error: string | null;
  apiKeyMissing: boolean;
  guessesRemaining: number;
  isRoundOver: boolean;
  hasActiveDrawing: boolean;
}

const ControlsPanel: React.FC<ControlsPanelProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  imageModels,
  selectedImageModelId,
  onImageModelChange,
  selectedDifficulty,
  onDifficultyChange,
  onGenerateNewDrawing,
  isGenerating,
  userGuess,
  onUserGuessChange,
  onSubmitGuess,
  canSubmitGuess,
  onRevealConcept,
  canRevealConcept,
  feedbackMessage,
  error,
  apiKeyMissing,
  guessesRemaining,
  isRoundOver,
  hasActiveDrawing,
}) => {
  
  const getFeedbackStyle = () => {
    if (error) return { bg: 'bg-error-bgOpacity', text: 'text-error-text' };
    if (feedbackMessage.toLowerCase().includes("correct")) return { bg: 'bg-success-bgOpacity', text: 'text-success-text' };
    if (feedbackMessage.toLowerCase().includes("incorrect") || feedbackMessage.toLowerCase().includes("ran out of guesses") || feedbackMessage.toLowerCase().includes("concept was")) {
        return { bg: 'bg-warning-bgOpacity', text: 'text-warning-text' };
    }
    if (feedbackMessage) return { bg: 'bg-primary-DEFAULT/10', text: 'text-primary-DEFAULT' };
    return { bg: '', text: ''};
  };

  const feedbackStyle = getFeedbackStyle();

  const difficultyToSliderValue = (difficulty: DrawingDifficulty): number => {
    return DIFFICULTY_LEVELS.indexOf(difficulty);
  };

  const sliderValueToDifficulty = (value: number): DrawingDifficulty => {
    return DIFFICULTY_LEVELS[value] || 'easy';
  };

  if (apiKeyMissing) {
    return (
      <div className="bg-dark p-6 rounded-lg shadow-xl space-y-4 w-full border border-panelBorder">
        <h2 className="text-xl font-semibold text-error-DEFAULT">API Key Error</h2>
        <p className="text-error-text">
          The Google Gemini API Key is not configured. Please ensure the <code>API_KEY</code> environment variable is set.
        </p>
        <p className="text-sm text-secondaryText">This application cannot function without a valid API key.</p>
      </div>
    );
  }

  return (
    <div className="bg-dark p-6 rounded-lg shadow-xl space-y-6 w-full border border-panelBorder">
      <div>
        <SelectDropdown
          label="Select Category:"
          options={categories}
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value as GameCategory)}
          disabled={isGenerating}
        />
      </div>
      <div>
        <SelectDropdown
          label="Select AI Image Model:"
          options={imageModels}
          value={selectedImageModelId}
          onChange={(e) => onImageModelChange(e.target.value)}
          disabled={isGenerating}
        />
         <p className="text-xs text-secondaryText mt-1">Changing model will re-draw current concept if one exists.</p>
      </div>

      <div>
        <label htmlFor="difficulty-slider" className="block mb-1.5 text-sm font-medium text-light">
          Drawing Difficulty: <span className="font-semibold text-primary-DEFAULT capitalize">{selectedDifficulty}</span>
        </label>
        <input
          id="difficulty-slider"
          type="range"
          min="0"
          max={DIFFICULTY_LEVELS.length - 1}
          step="1"
          value={difficultyToSliderValue(selectedDifficulty)}
          onChange={(e) => onDifficultyChange(sliderValueToDifficulty(parseInt(e.target.value, 10)))}
          disabled={isGenerating}
          className="w-full h-2 bg-secondary-DEFAULT rounded-lg appearance-none cursor-pointer accent-primary-DEFAULT disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={`Drawing difficulty: ${selectedDifficulty}`}
        />
        <div className="flex justify-between text-xs text-secondaryText mt-1 px-1">
          {DIFFICULTY_LEVELS.map(level => (
            <span key={level} className="capitalize">{level}</span>
          ))}
        </div>
         <p className="text-xs text-secondaryText mt-1">Changing difficulty will re-draw current concept if one exists.</p>
      </div>
      
      <Button
        onClick={onGenerateNewDrawing}
        disabled={isGenerating}
        className="w-full flex items-center justify-center"
        aria-label={isGenerating ? "Generating new drawing, please wait" : "Generate new drawing"}
        variant="primary"
      >
        <SparkleIcon className="w-5 h-5 mr-2" />
        {isGenerating && <Spinner size="w-5 h-5 mr-2" />}
        {isGenerating ? 'Generating...' : 'Generate New Drawing'}
      </Button>

      {hasActiveDrawing && !isRoundOver && (
        <div className="space-y-4 pt-6 border-t border-panelBorder">
          <div>
            <h3 className="text-lg font-semibold text-light">
              Your Guess:
              {guessesRemaining > 0 && !isRoundOver && !isGenerating && (
                <span className="text-sm text-secondaryText font-normal ml-2">
                  ({guessesRemaining} guess{guessesRemaining !== 1 ? 'es' : ''} remaining)
                </span>
              )}
            </h3>
          </div>
          <TextInput
            value={userGuess}
            onChange={(e) => onUserGuessChange(e.target.value)}
            placeholder="Enter your guess"
            disabled={isGenerating || isRoundOver}
            aria-label="Enter your guess for the drawing"
          />
          <Button
            onClick={onSubmitGuess}
            disabled={!canSubmitGuess || isGenerating || isRoundOver}
            className="w-full"
            variant="primary"
            aria-label="Submit your guess"
          >
            Submit Guess
          </Button>
          <Button
            onClick={onRevealConcept}
            disabled={!canRevealConcept || isGenerating || isRoundOver}
            variant="secondary"
            className="w-full"
            aria-label="Reveal the current concept"
          >
            Reveal Concept
          </Button>
        </div>
      )}

      {(feedbackMessage || error) && (
         <div className={`mt-4 p-3 rounded-md text-sm ${feedbackStyle.bg}`}>
          <p className={`${feedbackStyle.text} font-semibold`}>{error || feedbackMessage}</p>
        </div>
      )}
    </div>
  );
};

export default ControlsPanel;