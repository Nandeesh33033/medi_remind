import React from 'react';
import { translations } from '../constants';

interface LoginChoiceScreenProps {
  onCaretakerSelect: () => void;
  onPatientSelect: () => void;
  onBack: () => void;
}

const LoginChoiceScreen: React.FC<LoginChoiceScreenProps> = ({ onCaretakerSelect, onPatientSelect, onBack }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg relative">
         <button onClick={onBack} className="absolute top-4 left-4 text-gray-500 hover:text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
        </button>
        
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">{translations.loginChoiceTitle}</h2>
        
        <div className="grid grid-cols-1 gap-6">
          <button
            onClick={onCaretakerSelect}
            className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200">
               {/* Shield Icon */}
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
               </svg>
            </div>
            <span className="text-lg font-bold text-gray-800">{translations.caretakerView}</span>
            <span className="text-sm text-gray-500 mt-1">Password Login</span>
          </button>

          <button
            onClick={onPatientSelect}
            className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group"
          >
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200">
               {/* User Icon */}
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
               </svg>
            </div>
            <span className="text-lg font-bold text-gray-800">{translations.patientView}</span>
            <span className="text-sm text-gray-500 mt-1">Face Authorization</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginChoiceScreen;