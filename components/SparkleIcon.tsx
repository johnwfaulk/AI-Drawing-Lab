import React from 'react';
import { SVG_NAMESPACE } from '../constants';

const SparkleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns={SVG_NAMESPACE}
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10 2.5a.75.75 0 01.75.75V5.5h2.25a.75.75 0 010 1.5H10.75V9.25a.75.75 0 01-1.5 0V7H7.75a.75.75 0 010-1.5H9.25V3.25A.75.75 0 0110 2.5zM5.397 5.397a.75.75 0 011.06 0l1.25 1.25a.75.75 0 01-1.06 1.06L5.397 6.457a.75.75 0 010-1.06zm9.206 9.206a.75.75 0 01-1.06 0l-1.25-1.25a.75.75 0 011.06-1.06l1.25 1.25a.75.75 0 010 1.06zM14.604 5.397a.75.75 0 010 1.06L13.353 7.707a.75.75 0 01-1.06-1.06l1.25-1.25a.75.75 0 011.06 0zM5.397 14.604a.75.75 0 011.06 0l1.25-1.25a.75.75 0 011.06 1.06L6.457 15.664a.75.75 0 01-1.06 0l-.001-.001zM10 12.5a.75.75 0 01.75.75V15.5h2.25a.75.75 0 010 1.5H10.75V19.25a.75.75 0 01-1.5 0V17H7.75a.75.75 0 010-1.5H9.25V13.25A.75.75 0 0110 12.5z"
      clipRule="evenodd"
    />
  </svg>
);

export default SparkleIcon;