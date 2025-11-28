
import React, { useState } from 'react';
import { translations } from '../constants';

interface LoginScreenProps {
  onLogin: (caretakerPhone: string, patientPhone: string, password: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [caretakerPhone, setCaretakerPhone] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError(translations.passwordMismatchError);
      return;
    }
    if (caretakerPhone.trim() !== '' && patientPhone.trim() !== '' && password.trim() !== '') {
      setError('');
      onLogin(caretakerPhone, patientPhone, password);
    } else {
      setError('Please fill in all fields.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                {translations.loginWelcome}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
                {translations.loginPrompt}
            </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm space-y-4">
                {/* Caretaker Phone Input */}
                <div className="relative">
                    <label htmlFor="caretaker-phone" className="sr-only">{translations.caretakerPhoneLabel}</label>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {/* Shield/Admin icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                        id="caretaker-phone"
                        name="caretaker-phone"
                        type="tel"
                        autoComplete="tel"
                        required
                        className="appearance-none rounded-md relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder={translations.caretakerPhoneLabel}
                        value={caretakerPhone}
                        onChange={(e) => setCaretakerPhone(e.target.value)}
                    />
                </div>
                 
                 {/* Patient Phone Input */}
                 <div className="relative">
                    <label htmlFor="patient-phone" className="sr-only">{translations.patientPhoneLabel}</label>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {/* User/Patient icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                        id="patient-phone"
                        name="patient-phone"
                        type="tel"
                        autoComplete="tel"
                        required
                        className="appearance-none rounded-md relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder={translations.patientPhoneLabel}
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                    />
                </div>

                 <div>
                    <label htmlFor="password-new" className="sr-only">{translations.passwordLabel}</label>
                    <input
                        id="password-new"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder={translations.passwordLabel}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                 <div>
                    <label htmlFor="confirm-password" className="sr-only">{translations.confirmPasswordLabel}</label>
                    <input
                        id="confirm-password"
                        name="confirm-password"
                        type="password"
                        autoComplete="new-password"
                        required
                        className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder={translations.confirmPasswordLabel}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
            </div>

            {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
            <div>
                <button
                    type="submit"
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-4"
                >
                    {translations.loginButton}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
