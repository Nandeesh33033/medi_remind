
import React, { useState, useRef, useEffect } from 'react';
import { translations } from '../constants';

interface RegisterScreenProps {
  onRegister: (caretakerPhone: string, patientPhone: string, password: string, faceImage: string) => void;
  onBack: () => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ onRegister, onBack }) => {
  const [caretakerPhone, setCaretakerPhone] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  
  // Face Capture State
  const [faceImage, setFaceImage] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Password Validation Helper
  const checkPasswordCriteria = (pwd: string) => {
    return {
      length: pwd.length >= 6,
      letter: /[a-zA-Z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    };
  };

  const startCamera = async () => {
    try {
      setIsCameraOpen(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError(translations.cameraPermissionError);
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setFaceImage(dataUrl);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFaceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera(); // Cleanup on unmount
    };
  }, []);


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

    if (!faceImage) {
        setError("Please capture or upload the patient's face.");
        return;
    }

    if (caretakerPhone.trim() !== '' && patientPhone.trim() !== '' && password.trim() !== '') {
      setError('');
      onRegister(caretakerPhone, patientPhone, password, faceImage);
    } else {
      setError('Please fill in all fields.');
    }
  };

  const passwordCriteria = checkPasswordCriteria(password);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-4xl p-8 bg-white rounded-xl shadow-lg relative flex flex-col md:flex-row gap-8">
        <button onClick={onBack} className="absolute top-4 left-4 text-gray-500 hover:text-gray-800 z-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
        </button>

        {/* Left Side: Form */}
        <div className="flex-1 mt-8 md:mt-0">
            <div className="text-center md:text-left mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
                <p className="mt-2 text-sm text-gray-600">Enter details and register patient face.</p>
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

        {/* Right Side: Face ID */}
        <div className="flex-1 flex flex-col items-center justify-center border-l border-gray-200 pl-0 md:pl-8">
             <h3 className="text-lg font-bold mb-4">Patient Face ID</h3>
             
             <div className="w-64 h-64 bg-gray-200 rounded-xl overflow-hidden mb-4 relative flex items-center justify-center border-4 border-dashed border-gray-400">
                {isCameraOpen ? (
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
                ) : faceImage ? (
                    <img src={faceImage} alt="Patient Face" className="w-full h-full object-cover" />
                ) : (
                    <div className="text-gray-500 text-center p-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>No Face Captured</p>
                    </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
             </div>

             <div className="space-y-2 w-64">
                {!isCameraOpen && (
                    <button
                        type="button"
                        onClick={startCamera}
                        className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    >
                        {faceImage ? translations.retakePhoto : translations.captureFace}
                    </button>
                )}
                
                {isCameraOpen && (
                     <button
                        type="button"
                        onClick={takePhoto}
                        className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition font-bold"
                    >
                        Capture Now
                    </button>
                )}

                <div className="relative">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="face-upload"
                    />
                    <label 
                        htmlFor="face-upload"
                        className="block w-full py-2 px-4 bg-white border border-gray-300 text-gray-700 text-center rounded-md hover:bg-gray-50 cursor-pointer transition"
                    >
                        {translations.uploadPhoto}
                    </label>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
