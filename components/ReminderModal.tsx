import React, { useEffect, useRef, useState } from 'react';
import { Medicine } from '../types';
import { translations } from '../constants';

interface ReminderModalProps {
  medicine: Medicine;
  onTaken: () => void;
  onTimeout: () => void;
}

const ReminderModal: React.FC<ReminderModalProps> = ({ medicine, onTaken, onTimeout }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.play().catch(error => console.error("Audio playback failed:", error));
    }

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onTimeout();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeout]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-11/12 max-w-lg text-center p-8 transform transition-all scale-100 relative">
        <h2 className="text-4xl md:text-5xl font-extrabold text-blue-600 mb-4">{translations.reminderTitle}</h2>
        
        <img src={medicine.image} alt={medicine.name} className="w-full h-48 object-cover rounded-lg mb-6 shadow-lg" />
        
        <p className="text-5xl md:text-6xl font-bold text-gray-900">{medicine.name}</p>
        <p className="text-3xl md:text-4xl text-gray-700 mt-2">{medicine.dosage} mg</p>
         <p className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">Take {medicine.pills} Pill(s)</p>
        <p className="text-2xl md:text-3xl text-blue-500 font-semibold mt-2">
          {medicine.beforeFood ? translations.beforeFood : translations.afterFood}
        </p>
        
        <audio ref={audioRef} src={medicine.audio} loop />
        
        <div className="mt-6">
          <p className="text-lg text-red-600 font-mono font-semibold">
            Time remaining: {formatTime(timeLeft)}
          </p>
        </div>

        <button
          onClick={onTaken}
          className="mt-6 w-full py-5 text-3xl font-bold text-white bg-green-500 rounded-xl shadow-lg hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 transform hover:scale-105 transition-transform"
        >
          {translations.takenButton}
        </button>
      </div>
    </div>
  );
};

export default ReminderModal;