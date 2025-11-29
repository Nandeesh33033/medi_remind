
import React, { useState } from 'react';
import { Medicine, Log } from '../types';
import MedicineForm from './MedicineForm';
import WeeklyReport from './WeeklyReport';
import { translations } from '../constants';

interface CaretakerViewProps {
  medicines: Medicine[];
  addMedicine: (med: Omit<Medicine, 'id'>) => void;
  logs: Log[];
}

type CaretakerSubView = 'SCHEDULE' | 'ADD' | 'REPORT';

const CaretakerView: React.FC<CaretakerViewProps> = ({ medicines, addMedicine, logs }) => {
  const [activeSubView, setActiveSubView] = useState<CaretakerSubView>('SCHEDULE');

  const activeBtnClasses = "bg-blue-600 text-white";
  const inactiveBtnClasses = "bg-white text-blue-600 hover:bg-blue-100";

  const formatTime12Hour = (time24: string) => {
    const [h, m] = time24.split(':');
    let hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${m} ${ampm}`;
  };

  const renderSubView = () => {
    switch (activeSubView) {
      case 'SCHEDULE':
        return (
           <div className="bg-white p-6 rounded-lg shadow-md mt-4">
              <h3 className="text-2xl font-bold mb-4">{translations.medicineListTitle}</h3>
              <ul className="space-y-4">
                {medicines.map(med => (
                  <li key={med.id} className="border-b pb-4 last:border-b-0 last:pb-0 flex items-center space-x-4">
                    <img src={med.image} alt={med.name} className="w-16 h-16 object-cover rounded-lg shadow-sm" />
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-lg">{med.name} <span className="font-normal text-gray-600">({med.dosage}mg)</span></p>
                           <p className="text-sm text-gray-700 font-semibold">{med.pills} Pill(s)</p>
                          <p className="text-sm text-gray-500">{med.schedule.day.map(d => d.substring(0,3)).join(', ')} at {formatTime12Hour(med.schedule.time)}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${med.beforeFood ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>
                          {med.beforeFood ? translations.beforeFood : translations.afterFood}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
                  {medicines.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No medicines scheduled yet.</p>
                )}
              </ul>
            </div>
        );
      case 'ADD':
        return (
          <div className="mt-4">
            <MedicineForm 
              addMedicine={addMedicine} 
              onMedicineAdded={() => setActiveSubView('SCHEDULE')}
            />
          </div>
        );
      case 'REPORT':
        return (
          <div className="mt-4">
             <h3 className="text-2xl font-bold mb-4">{translations.weeklyReportTitle}</h3>
             <WeeklyReport logs={logs} medicines={medicines} />
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="container mx-auto">
       <div className="flex rounded-md shadow-sm w-full">
            <button
              onClick={() => setActiveSubView('SCHEDULE')}
              className={`px-3 py-2 rounded-l-md text-sm font-medium transition w-1/3 ${activeSubView === 'SCHEDULE' ? activeBtnClasses : inactiveBtnClasses}`}
            >
              {translations.scheduledMedicinesView}
            </button>
            <button
              onClick={() => setActiveSubView('ADD')}
              className={`px-3 py-2 text-sm font-medium transition border-l border-r border-blue-200 w-1/3 ${activeSubView === 'ADD' ? activeBtnClasses : inactiveBtnClasses}`}
            >
              {translations.addNewMedicineView}
            </button>
             <button
              onClick={() => setActiveSubView('REPORT')}
              className={`px-3 py-2 rounded-r-md text-sm font-medium transition w-1/3 ${activeSubView === 'REPORT' ? activeBtnClasses : inactiveBtnClasses}`}
            >
              {translations.weeklyReportView}
            </button>
        </div>
        
        {renderSubView()}
    </div>
  );
};

export default CaretakerView;
