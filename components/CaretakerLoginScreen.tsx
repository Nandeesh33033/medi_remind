
import React, { useState } from 'react';
import { translations } from '../constants';

interface CaretakerLoginScreenProps {
  onLogin: (phone: string, password: string) => void;
  onBack: () => void;
}

const CaretakerLoginScreen: React.FC<CaretakerLoginScreenProps> = ({ onLogin, onBack }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone && password) {
        onLogin(phone, password);
    } else {
        alert("Please enter both phone number and password.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg relative">
        <button onClick={onBack} className="absolute top-4 left-4 text-gray-500 hover:text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
        </button>

        <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">{translations.caretakerLoginTitle}</h2>
            <p className="mt-2 text-sm text-gray-600">Enter your credentials.</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
                <label className="block text-sm font-medium text-gray-700">{translations.caretakerPhoneLabel}</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                     </svg>
                  </div>
                  <input
                      type="tel"
                      required
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 border"
                      placeholder={translations.caretakerPhoneLabel}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">{translations.passwordLabel}</label>
                <input
                    type="password"
                    required
                    className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            >
                Login
            </button>
        </form>
      </div>
    </div>
  );
};

export default CaretakerLoginScreen;
