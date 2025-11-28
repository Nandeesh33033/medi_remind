import React, { useState } from 'react';
import { Medicine } from '../types';
import { DAYS_OF_WEEK, translations } from '../constants';

interface MedicineFormProps {
  addMedicine: (med: Omit<Medicine, 'id'>) => void;
  onMedicineAdded: () => void;
}

const MedicineForm: React.FC<MedicineFormProps> = ({ addMedicine, onMedicineAdded }) => {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [pills, setPills] = useState('1'); // Default to 1 pill
  const [beforeFood, setBeforeFood] = useState(false);
  const [hour, setHour] = useState('08');
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
  const [days, setDays] = useState<string[]>([]);
  const [image, setImage] = useState('');
  const [audio, setAudio] = useState('');
  const [imageFileName, setImageFileName] = useState('');
  const [audioFileName, setAudioFileName] = useState('');


  const handleDayChange = (day: string) => {
    setDays(prevDays =>
      prevDays.includes(day)
        ? prevDays.filter(d => d !== day)
        : [...prevDays, day]
    );
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>, 
    setFileState: (value: string) => void,
    setFileNameState: (value: string) => void
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileNameState(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileState(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert 12-hour time to 24-hour format
    let convertedHour = parseInt(hour, 10);
    if (period === 'PM' && convertedHour !== 12) {
      convertedHour += 12;
    } else if (period === 'AM' && convertedHour === 12) {
      convertedHour = 0; // Midnight case
    }
    const formattedTime = `${convertedHour.toString().padStart(2, '0')}:${minute}`;

    if (name && dosage && pills && formattedTime && days.length > 0) {
      addMedicine({
        name,
        dosage: parseInt(dosage),
        pills: parseInt(pills),
        beforeFood,
        schedule: { time: formattedTime, day: days },
        image: image || `https://via.placeholder.com/150?text=${name.replace(/\s/g, '+')}`,
        audio: audio || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Placeholder
      });
      // Reset form
      setName('');
      setDosage('');
      setPills('1');
      setBeforeFood(false);
      setHour('08');
      setMinute('00');
      setPeriod('AM');
      setDays([]);
      setImage('');
      setAudio('');
      setImageFileName('');
      setAudioFileName('');
      onMedicineAdded();
    }
  };

  const foodBtnBase = "px-4 py-2 rounded-md text-sm font-medium transition-colors w-1/2";
  const foodBtnActive = "bg-blue-600 text-white shadow";
  const foodBtnInactive = "bg-gray-200 text-gray-700 hover:bg-gray-300";

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-4">{translations.addMedicineTitle}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">{translations.medicineNameLabel}</label>
            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2" />
          </div>
          <div>
            <label htmlFor="dosage" className="block text-sm font-medium text-gray-700">{translations.dosageLabel}</label>
            <input type="number" id="dosage" value={dosage} onChange={e => setDosage(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2" />
          </div>
          <div>
            <label htmlFor="pills" className="block text-sm font-medium text-gray-700">{translations.pillsLabel}</label>
            <input type="number" id="pills" min="1" value={pills} onChange={e => setPills(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{translations.scheduleTimeLabel}</label>
          <div className="mt-1 flex space-x-2">
            <select value={hour} onChange={e => setHour(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2">
              {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                <option key={h} value={h.toString().padStart(2, '0')}>{h.toString().padStart(2, '0')}</option>
              ))}
            </select>
            <select value={minute} onChange={e => setMinute(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2">
              {Array.from({ length: 60 }, (_, i) => i).map(m => (
                <option key={m} value={m.toString().padStart(2, '0')}>{m.toString().padStart(2, '0')}</option>
              ))}
            </select>
            <select value={period} onChange={e => setPeriod(e.target.value as 'AM' | 'PM')} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2">
              <option value="AM">{translations.am}</option>
              <option value="PM">{translations.pm}</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{translations.scheduleDaysLabel}</label>
          <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {DAYS_OF_WEEK.map(day => (
              <label key={day} className="flex items-center space-x-2 text-sm">
                <input type="checkbox" checked={days.includes(day)} onChange={() => handleDayChange(day)} className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-offset-0 focus:ring-blue-200 focus:ring-opacity-50" />
                <span>{day.substring(0,3)}</span>
              </label>
            ))}
          </div>
        </div>
         <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meal Time</label>
          <div className="flex rounded-md shadow-sm">
             <button type="button" onClick={() => setBeforeFood(true)} className={`${foodBtnBase} rounded-l-md ${beforeFood ? foodBtnActive : foodBtnInactive}`}>
              {translations.beforeFood}
            </button>
             <button type="button" onClick={() => setBeforeFood(false)} className={`${foodBtnBase} rounded-r-md ${!beforeFood ? foodBtnActive : foodBtnInactive}`}>
              {translations.afterFood}
            </button>
          </div>
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">{translations.addImageLabel}</label>
             <input type="file" id="image-upload" accept="image/*" onChange={(e) => handleFileChange(e, setImage, setImageFileName)} className="hidden" />
             <div className="mt-1 flex items-center space-x-2">
               <label htmlFor="image-upload" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <span>Choose Image</span>
               </label>
               <span className="text-sm text-gray-500 truncate">{imageFileName || "No file chosen"}</span>
             </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{translations.addAudioLabel}</label>
            <input type="file" id="audio-upload" accept="audio/*" onChange={(e) => handleFileChange(e, setAudio, setAudioFileName)} className="hidden" />
             <div className="mt-1 flex items-center space-x-2">
               <label htmlFor="audio-upload" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <span>Choose Audio</span>
               </label>
               <span className="text-sm text-gray-500 truncate">{audioFileName || "No file chosen"}</span>
             </div>
          </div>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-semibold">
          {translations.addMedicineButton}
        </button>
      </form>
    </div>
  );
};

export default MedicineForm;