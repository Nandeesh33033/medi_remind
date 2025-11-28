import React from 'react';
import { translations } from '../constants';

interface LandingScreenProps {
  onRegisterClick: () => void;
  onLoginClick: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onRegisterClick, onLoginClick }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-2xl text-center">
        <div className="flex justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
        </div>
        
        <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{translations.landingTitle}</h1>
            <p className="text-gray-600">{translations.landingSubtitle}</p>
        </div>

        <div className="space-y-4 pt-6">
            <button
                onClick={onRegisterClick}
                className="w-full py-4 px-6 text-lg font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg transform transition hover:scale-105"
            >
                {translations.registerButton}
            </button>
            
            <button
                onClick={onLoginClick}
                className="w-full py-4 px-6 text-lg font-bold text-blue-600 bg-blue-50 border-2 border-blue-100 rounded-xl hover:bg-blue-100 shadow-sm transition"
            >
                {translations.loginButtonMain}
            </button>
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;