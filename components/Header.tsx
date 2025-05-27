import React from 'react';
import SparkleIcon from './SparkleIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-dark py-6 px-4 shadow-xl border-b border-panelBorder">
      <div className="container mx-auto flex items-center justify-center">
        <SparkleIcon className="w-8 h-8 text-primary-DEFAULT mr-3" />
        <h1 className="text-4xl font-bold text-center text-light">
          AI <span className="text-primary-DEFAULT">Drawing</span> Lab
        </h1>
      </div>
    </header>
  );
};

export default Header;