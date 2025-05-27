
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import ControlsPanel from './components/ControlsPanel';
import DrawingDisplay from './components/DrawingDisplay';
import { GameCategory, GameState, SelectOption, DrawingDifficulty } from './types'; // Added DrawingDifficulty
import { GAME_CATEGORIES, IMAGE_MODELS, DEFAULT_IMAGE_MODEL_ID, INITIAL_GUESSES, DIFFICULTY_LEVELS } from './constants'; // Added DIFFICULTY_LEVELS
import { generateConceptFromAPI, generateDrawingFromAPI } from './services/geminiService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentConcept: null,
    generatedImageUrl: null,
    guessesRemaining: INITIAL_GUESSES,
    isConceptRevealed: false,
    isRoundOver: false,
    feedbackMessage: "",
    selectedCategory: GAME_CATEGORIES[0],
    selectedImageModelId: DEFAULT_IMAGE_MODEL_ID,
    selectedDifficulty: 'easy', // Added, default to easy
    isLoadingConcept: false,
    isLoadingDrawing: false,
    error: null,
    userGuess: "",
    apiKeyMissing: false,
  });

  const currentConceptRef = useRef<string | null>(null);
  useEffect(() => {
    currentConceptRef.current = gameState.currentConcept;
  }, [gameState.currentConcept]);


  useEffect(() => {
    if (typeof process.env.API_KEY === 'undefined' || process.env.API_KEY === "") {
      setGameState(prev => ({ 
        ...prev, 
        apiKeyMissing: true, 
        error: "API Key is not configured. Please check environment variables.",
        feedbackMessage: "" 
      }));
    }
  }, []);

  const handleCategoryChange = (category: GameCategory) => {
    setGameState(prev => ({ ...prev, selectedCategory: category }));
  };

  const handleImageModelChange = useCallback(async (modelId: string) => {
    setGameState(prev => ({ ...prev, selectedImageModelId: modelId, error: null, feedbackMessage: "" }));
    if (currentConceptRef.current) {
      setGameState(prev => ({ ...prev, isLoadingDrawing: true, generatedImageUrl: null, feedbackMessage: "Re-generating drawing with new model..." }));
      try {
        const imageUrl = await generateDrawingFromAPI(currentConceptRef.current, modelId, gameState.selectedDifficulty); // Pass difficulty
        setGameState(prev => ({ ...prev, generatedImageUrl: imageUrl, isLoadingDrawing: false, feedbackMessage: "Drawing updated with new model." }));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
        setGameState(prev => ({ ...prev, error: `Failed to re-generate drawing: ${errorMessage}`, isLoadingDrawing: false, feedbackMessage: "" }));
      }
    }
  }, [gameState.selectedDifficulty]); // Added gameState.selectedDifficulty


  const handleGenerateNewDrawing = useCallback(async () => {
    if (gameState.apiKeyMissing) return;
    setGameState(prev => ({
      ...prev,
      isLoadingConcept: true,
      isLoadingDrawing: true,
      error: null,
      feedbackMessage: "Generating new concept...",
      currentConcept: null,
      generatedImageUrl: null,
      isRoundOver: false,
      isConceptRevealed: false,
      userGuess: "",
    }));

    try {
      const concept = await generateConceptFromAPI(gameState.selectedCategory);
      setGameState(prev => ({ ...prev, currentConcept: concept, isLoadingConcept: false, feedbackMessage: "Concept generated! Now drawing..." }));

      const imageUrl = await generateDrawingFromAPI(concept, gameState.selectedImageModelId, gameState.selectedDifficulty); // Pass difficulty
      setGameState(prev => ({
        ...prev,
        generatedImageUrl: imageUrl,
        isLoadingDrawing: false,
        guessesRemaining: INITIAL_GUESSES,
        feedbackMessage: "New drawing generated! Make your guess.",
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setGameState(prev => ({
        ...prev,
        error: `Failed to start new round: ${errorMessage}`,
        isLoadingConcept: false,
        isLoadingDrawing: false,
        feedbackMessage: "",
      }));
    }
  }, [gameState.selectedCategory, gameState.selectedImageModelId, gameState.selectedDifficulty, gameState.apiKeyMissing]); // Added gameState.selectedDifficulty

  const handleDifficultyChange = useCallback(async (newDifficulty: DrawingDifficulty) => {
    setGameState(prev => ({ ...prev, selectedDifficulty: newDifficulty, error: null, feedbackMessage: "" }));
    if (currentConceptRef.current) {
      setGameState(prev => ({ ...prev, isLoadingDrawing: true, generatedImageUrl: null, feedbackMessage: "Re-generating drawing with new difficulty..." }));
      try {
        const imageUrl = await generateDrawingFromAPI(currentConceptRef.current, gameState.selectedImageModelId, newDifficulty);
        setGameState(prev => ({ ...prev, generatedImageUrl: imageUrl, isLoadingDrawing: false, feedbackMessage: "Drawing updated with new difficulty." }));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
        setGameState(prev => ({ ...prev, error: `Failed to re-generate drawing: ${errorMessage}`, isLoadingDrawing: false, feedbackMessage: "" }));
      }
    }
  }, [gameState.selectedImageModelId]); // Added gameState.selectedImageModelId to dependencies as it's used in API call


  const handleUserGuessChange = (guess: string) => {
    setGameState(prev => ({ ...prev, userGuess: guess }));
  };

  const handleSubmitGuess = () => {
    if (!currentConceptRef.current || gameState.isRoundOver || gameState.userGuess.trim() === "") return;

    const guess = gameState.userGuess.trim().toLowerCase();
    const concept = currentConceptRef.current.trim().toLowerCase();

    if (guess === concept) {
      setGameState(prev => ({
        ...prev,
        feedbackMessage: `Correct! The concept was "${currentConceptRef.current}". Well done!`,
        isRoundOver: true,
        isConceptRevealed: true,
      }));
    } else {
      const guessesLeft = gameState.guessesRemaining - 1;
      if (guessesLeft > 0) {
        setGameState(prev => ({
          ...prev,
          guessesRemaining: guessesLeft,
          feedbackMessage: `Incorrect. Try again!`,
          userGuess: "",
        }));
      } else {
        setGameState(prev => ({
          ...prev,
          guessesRemaining: 0,
          feedbackMessage: `You ran out of guesses! The concept was "${currentConceptRef.current}". Better luck next time!`,
          isRoundOver: true,
          isConceptRevealed: true,
        }));
      }
    }
  };

  const handleRevealConcept = () => {
    if (!currentConceptRef.current || gameState.isRoundOver) return;
    setGameState(prev => ({
      ...prev,
      isConceptRevealed: true,
      isRoundOver: true,
      feedbackMessage: `The concept was "${currentConceptRef.current}".`,
    }));
  };

  const categoryOptions: SelectOption[] = GAME_CATEGORIES.map(cat => ({ value: cat, label: cat }));
  const imageModelOptions: SelectOption[] = IMAGE_MODELS.map(model => ({ value: model.id, label: `${model.name}`}));
  
  const isGenerating = gameState.isLoadingConcept || gameState.isLoadingDrawing;
  const canSubmitGuess = gameState.userGuess.trim() !== "" && !gameState.isRoundOver && !!gameState.generatedImageUrl && !isGenerating;
  const canRevealConcept = !gameState.isConceptRevealed && !gameState.isRoundOver && !!gameState.generatedImageUrl && !isGenerating;
  const hasActiveDrawing = !!currentConceptRef.current;


  return (
    <div className="min-h-screen flex flex-col bg-darker">
      <Header />
      <main className="container mx-auto mt-8 mb-8 flex-grow flex flex-col lg:flex-row gap-8 w-full max-w-6xl px-4">
        <div className="lg:w-2/5 w-full flex flex-col">
          <ControlsPanel
            categories={categoryOptions}
            selectedCategory={gameState.selectedCategory}
            onCategoryChange={handleCategoryChange}
            imageModels={imageModelOptions}
            selectedImageModelId={gameState.selectedImageModelId}
            onImageModelChange={handleImageModelChange}
            
            selectedDifficulty={gameState.selectedDifficulty} // Pass difficulty
            onDifficultyChange={handleDifficultyChange}      // Pass handler

            onGenerateNewDrawing={handleGenerateNewDrawing}
            isGenerating={isGenerating}
            userGuess={gameState.userGuess}
            onUserGuessChange={handleUserGuessChange}
            onSubmitGuess={handleSubmitGuess}
            canSubmitGuess={canSubmitGuess}
            onRevealConcept={handleRevealConcept}
            canRevealConcept={canRevealConcept}
            feedbackMessage={gameState.feedbackMessage}
            error={gameState.error}
            apiKeyMissing={gameState.apiKeyMissing}
            guessesRemaining={gameState.guessesRemaining}
            isRoundOver={gameState.isRoundOver}
            hasActiveDrawing={hasActiveDrawing}
          />
        </div>
        <div className="lg:w-3/5 w-full flex">
          <DrawingDisplay
            imageUrl={gameState.generatedImageUrl}
            isLoading={isGenerating}
            currentConcept={gameState.currentConcept}
            isConceptRevealed={gameState.isConceptRevealed}
          />
        </div>
      </main>
      <footer className="text-center p-6 mt-auto text-sm text-secondaryText border-t border-panelBorder">
        AI Drawing Lab - Powered by Google Gemini &amp; Project IDX.
      </footer>
    </div>
  );
};

export default App;