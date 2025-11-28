import React, { useState } from 'react';
import { translations } from '../constants';

interface RegisterScreenProps {
  onRegister: (caretakerPhone: string, patientPhone: string, password: string) => void;
  onBack: () => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ onRegister, onBack }) => {
  const [caretakerPhone, setCaretakerPhone] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // Password Validation Helper
  const checkPasswordCriteria = (pwd: string) => {
    return {
      length: pwd.length >= 6,
      letter: /[a-zA-Z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate Password
    const criteria = checkPasswordCriteria(password);
    if (!criteria.length || !criteria.letter || !criteria.number || !criteria.special) {
      setError(translations.passwordInvalidError);
      return;
    }

    if (password !== confirmPassword) {
      setError(translations.passwordMismatchError);
      return;
    }

    if (caretakerPhone.trim() !== '' && patientPhone.trim() !== '' && password.trim() !== '') {
      setError('');
      onRegister(caretakerPhone, patientPhone, password);
    } else {
      setError('Please fill in all fields.');
    }
  };

  const passwordCriteria = checkPasswordCriteria(password);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg relative">
        <button onClick={onBack} className="absolute top-4 left-4 text-gray-500 hover:text-gray-800 z-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
        </button>

        <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
            <p className="mt-2 text-sm text-gray-600">Enter details to register.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
                <label className="block text-sm font-medium text-gray-700">{translations.caretakerPhoneLabel}</label>
                <input
                    type="tel"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={caretakerPhone}
                    onChange={(e) => setCaretakerPhone(e.target.value)}
                />
            </div>
                
                <div>
                <label className="block text-sm font-medium text-gray-700">{translations.patientPhoneLabel}</label>
                <input
                    type="tel"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                />
            </div>

                <div className="relative">
                <label className="block text-sm font-medium text-gray-700">{translations.passwordLabel}</label>
                <input
                    type="password"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                />
                
                {/* Password Requirements Popover */}
                {isPasswordFocused && (
                    <div className="absolute z-10 bottom-full mb-2 w-full bg-white p-3 rounded-lg shadow-xl border border-gray-200 text-xs">
                        <p className="font-bold text-gray-700 mb-2">{translations.passwordRequirementsTitle}</p>
                        <ul className="space-y-1">
                            <li className={`flex items-center ${passwordCriteria.length ? 'text-green-600' : 'text-gray-500'}`}>
                                <span className="mr-2">{passwordCriteria.length ? '✔' : '•'}</span> {translations.pwdReqLength}
                            </li>
                            <li className={`flex items-center ${passwordCriteria.letter ? 'text-green-600' : 'text-gray-500'}`}>
                                <span className="mr-2">{passwordCriteria.letter ? '✔' : '•'}</span> {translations.pwdReqLetter}
                            </li>
                            <li className={`flex items-center ${passwordCriteria.number ? 'text-green-600' : 'text-gray-500'}`}>
                                <span className="mr-2">{passwordCriteria.number ? '✔' : '•'}</span> {translations.pwdReqNumber}
                            </li>
                            <li className={`flex items-center ${passwordCriteria.special ? 'text-green-600' : 'text-gray-500'}`}>
                                <span className="mr-2">{passwordCriteria.special ? '✔' : '•'}</span> {translations.pwdReqSpecial}
                            </li>
                        </ul>
                    </div>
                )}
            </div>
                <div>
                <label className="block text-sm font-medium text-gray-700">{translations.confirmPasswordLabel}</label>
                <input
                    type="password"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>

            {error && <p className="text-red-500 text-sm text-center font-semibold">{error}</p>}
            
            <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                Register
            </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterScreen;