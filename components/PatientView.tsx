
import React from 'react';
import { Medicine, Log } from '../types';
import { translations } from '../constants';

interface PatientViewProps {
  medicines: Medicine[];
  logs: Log[];
}

const PatientView: React.FC<PatientViewProps> = ({ medicines, logs }) => {
  const today = new Date();
  const todayString = today.toLocaleDateString('en-US', { weekday: 'long' });
  
  const todaysMedicines = medicines
    .filter(med => med.schedule.day.includes(todayString))
    .sort((a, b) => a.schedule.time.localeCompare(b.schedule.time));

  const getStatus = (medicineId: string): { text: 'Taken' | 'Missed' | 'Pending'; color: string } => {
    const todayLog = logs.find(log => 
      log.medicineId === medicineId && 
      log.timestamp.toDateString() === today.toDateString()
    );

    if (todayLog) {
      if (todayLog.status === 'taken') {
        return { text: 'Taken', color: 'bg-green-100 text-green-800' };
      }
      return { text: 'Missed', color: 'bg-red-100 text-red-800' };
    }
    
    return { text: 'Pending', color: 'bg-gray-100 text-gray-800' };
  };

  const formatTime12Hour = (time24: string) => {
    const [h, m] = time24.split(':');
    let hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${m} ${ampm}`;
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">{translations.patientTitle}</h2>
      <div className="space-y-4">
        {todaysMedicines.length > 0 ? (
          todaysMedicines.map(med => {
            const status = getStatus(med.id);
            return (
              <div key={med.id} className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img src={med.image} alt={med.name} className="w-20 h-20 object-cover rounded-lg shadow-md" />
                  <div>
                    <p className="text-2xl md:text-3xl font-bold text-gray-800">{med.name}</p>
                    <p className="text-lg md:text-xl text-gray-600">{med.dosage} mg</p>
                    <p className="text-lg md:text-xl font-bold text-gray-700">Take {med.pills} Pill(s)</p>
                    <p className="text-md md:text-lg text-blue-600 font-semibold">{med.beforeFood ? translations.beforeFood : translations.afterFood}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl md:text-4xl font-mono font-bold text-blue-500">{formatTime12Hour(med.schedule.time)}</p>
                  <span className={`mt-2 inline-block px-3 py-1 text-sm font-semibold rounded-full ${status.color}`}>
                    {status.text}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-xl text-gray-500 mt-8">No medicines scheduled for today.</p>
        )}
      </div>
    </div>
  );
};

export default PatientView;
