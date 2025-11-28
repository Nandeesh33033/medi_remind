import React, { useState } from 'react';
import { translations } from '../constants';

interface PatientLoginScreenProps {
  onSuccess: (phone: string) => void;
  onBack: () => void;
  registeredFaceImage?: string; // Kept for prop compatibility but unused
}

const PatientLoginScreen: React.FC<PatientLoginScreenProps> = ({ onSuccess, onBack }) => {
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(phone);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg relative">
        <button onClick={onBack} className="absolute top-4 left-4 text-gray-500 hover:text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
        </button>

        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">{translations.patientLoginTitle}</h2>
            <p className="mt-2 text-sm text-gray-600">{translations.patientLoginPrompt}</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
                <label className="block text-sm font-medium text-gray-700">{translations.patientPhoneLabel}</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                     </svg>
                  </div>
                  <input
                      type="tel"
                      required
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 border"
                      placeholder="Enter registered number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
            </div>

            <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
                Login as Patient
            </button>
        </form>
      </div>
    </div>
  );
};

export default PatientLoginScreen;