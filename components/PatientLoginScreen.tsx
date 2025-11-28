
import React, { useState, useEffect, useRef } from 'react';
import { translations } from '../constants';
import { RegisteredUser } from '../types';

interface PatientLoginScreenProps {
  onSuccess: (matchedUserPhone: string) => void;
  onBack: () => void;
  // In a real app, we'd compare the live face to stored embeddings.
  // Here we assume "scanning" finds the registered user if one exists.
  registeredUsers: RegisteredUser[]; 
}

const PatientLoginScreen: React.FC<PatientLoginScreenProps> = ({ onSuccess, onBack, registeredUsers }) => {
  const [status, setStatus] = useState<'IDLE' | 'SCANNING' | 'VERIFIED' | 'FAILED'>('IDLE');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
        stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setStatus('SCANNING');
        
        // Simulate scanning delay
        setTimeout(() => {
            attemptLogin();
        }, 3000);
      }
    } catch (err) {
      console.error("Camera error:", err);
      setStatus('FAILED');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const attemptLogin = () => {
    // In this simulation, if any user exists, we log them in.
    // Ideally, this would match facial features.
    if (registeredUsers.length > 0) {
        setStatus('VERIFIED');
        setTimeout(() => {
            // Log in the first/most recent user found
            const matchedUser = registeredUsers[registeredUsers.length - 1];
            onSuccess(matchedUser.patientPhone);
        }, 1500);
    } else {
        setStatus('FAILED');
        alert("No users registered. Please register first.");
    }
  };

  const retry = () => {
      setStatus('SCANNING');
      setTimeout(attemptLogin, 3000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg relative text-center">
        <button onClick={onBack} className="absolute top-4 left-4 text-gray-500 hover:text-gray-800 z-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">{translations.patientLoginTitle}</h2>

        <div className="relative w-64 h-64 mx-auto rounded-full overflow-hidden border-4 border-blue-500 shadow-2xl bg-black">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
            
            {/* Scanning Overlay */}
            {status === 'SCANNING' && (
                <div className="absolute inset-0 bg-blue-500 opacity-20 animate-pulse"></div>
            )}
            {/* Scanning Line */}
            {status === 'SCANNING' && (
                 <div className="absolute top-0 left-0 w-full h-1 bg-blue-400 shadow-lg animate-[scan_2s_ease-in-out_infinite]"></div>
            )}
        </div>

        <div className="mt-8 min-h-[60px]">
            {status === 'SCANNING' && (
                <p className="text-xl font-mono text-blue-600 animate-pulse">{translations.scanningFace}</p>
            )}
            {status === 'VERIFIED' && (
                <div className="flex items-center justify-center text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xl font-bold">{translations.faceVerified}</p>
                </div>
            )}
            {status === 'FAILED' && (
                <div>
                     <p className="text-red-500 font-semibold mb-2">{translations.faceNotRecognized} or Camera Blocked.</p>
                     <button onClick={retry} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Retry</button>
                </div>
            )}
        </div>
        
        <style>{`
            @keyframes scan {
                0% { top: 0%; }
                50% { top: 100%; }
                100% { top: 0%; }
            }
        `}</style>
      </div>
    </div>
  );
};

export default PatientLoginScreen;
