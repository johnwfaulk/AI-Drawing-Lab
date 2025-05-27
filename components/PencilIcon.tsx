import React from 'react';
import { SVG_NAMESPACE } from '../constants';

const PencilIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns={SVG_NAMESPACE} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    aria-hidden="true"
  >
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
    <path d="m15 5 4 4"></path>
  </svg>
);

export default PencilIcon;