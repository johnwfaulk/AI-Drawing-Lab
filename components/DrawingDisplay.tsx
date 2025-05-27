import React from 'react';
import Spinner from './Spinner';
import PencilIcon from './PencilIcon'; // Changed from ImageIcon to PencilIcon

interface DrawingDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
  currentConcept: string | null;
  isConceptRevealed: boolean;
}

const DrawingDisplay: React.FC<DrawingDisplayProps> = ({ imageUrl, isLoading, currentConcept, isConceptRevealed }) => {
  return (
    <div className="bg-dark p-6 rounded-lg shadow-xl flex flex-col items-center justify-center min-h-[300px] md:min-h-[400px] lg:min-h-[500px] w-full border border-panelBorder">
      {isLoading && <Spinner size="w-16 h-16" />} {/* Spinner color is text-primary-DEFAULT via Spinner.tsx */}
      {!isLoading && !imageUrl && (
        <div className="text-center text-secondaryText">
          <PencilIcon className="w-24 h-24 mx-auto mb-4 text-slate-600 opacity-30" /> {/* Updated Icon and style */}
          <p className="text-xl">Select a category and click "Generate New Drawing" to start!</p>
          <p className="text-sm mt-1">The AI will draw, and you guess!</p>
        </div>
      )}
      {!isLoading && imageUrl && (
         <div className="bg-white p-1 rounded-md shadow-inner border-4 border-imageBorder"> {/* Updated border and padding */}
            <img 
                src={imageUrl} 
                alt="AI Generated Drawing" 
                className="max-w-full max-h-[400px] lg:max-h-[450px] object-contain rounded-sm" // slightly smaller rounding for inner image
            />
        </div>
      )}
      {isConceptRevealed && currentConcept && (
        <div className="mt-6 p-4 bg-secondary-DEFAULT rounded-md shadow">
          <p className="text-lg text-light text-center">
            The concept was: <span className="font-semibold text-primary-DEFAULT">{currentConcept}</span> {/* Concept word uses primary accent */}
          </p>
        </div>
      )}
    </div>
  );
};

export default DrawingDisplay;