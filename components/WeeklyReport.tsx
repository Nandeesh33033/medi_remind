import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Medicine, Log } from '../types';
import { DAYS_OF_WEEK, translations } from '../constants';

interface WeeklyReportProps {
  logs: Log[];
  medicines: Medicine[];
}

const WeeklyReport: React.FC<WeeklyReportProps> = ({ logs, medicines }) => {
  const data = DAYS_OF_WEEK.map(day => {
    const dayLogs = logs.filter(log => log.timestamp.toLocaleDateString('en-US', { weekday: 'long' }) === day);
    const dosesTaken = dayLogs.filter(log => log.status === 'taken').length;
    const dosesMissed = dayLogs.filter(log => log.status === 'missed').length;
    
    return { 
      name: day.substring(0, 3), 
      [translations.dosesTaken]: dosesTaken,
      [translations.dosesMissed]: dosesMissed,
    };
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* 
          FIX: Added explicit inline style for width/height.
          This prevents the "width(-1) and height(-1)" warning from Recharts
          by ensuring the container has dimensions before the chart renders.
      */}
      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey={translations.dosesTaken} stackId="a" fill="#22c55e" />
            <Bar dataKey={translations.dosesMissed} stackId="a" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-8 pt-4 border-t">
        <h4 className="text-lg font-bold mb-4 text-gray-800">Daily Log Details</h4>
        <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
          {DAYS_OF_WEEK.map(day => {
            const dayLogs = logs
              .filter(log => log.timestamp.toLocaleDateString('en-US', { weekday: 'long' }) === day)
              .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

            if (dayLogs.length === 0) return null;

            return (
              <div key={day}>
                <p className="font-semibold text-gray-700 border-b pb-1 mb-2">{day}</p>
                <ul className="space-y-2">
                  {dayLogs.map(log => {
                    const medicine = medicines.find(m => m.id === log.medicineId);
                    if (!medicine) return null;

                    const isTaken = log.status === 'taken';
                    return (
                      <li key={log.id} className="flex justify-between items-center text-sm p-2 rounded-md bg-gray-50">
                        <div>
                          <span className="font-medium text-gray-900">{medicine.name}</span>
                          <span className="text-gray-500 ml-2">({log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</span>
                        </div>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${isTaken ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {isTaken ? 'Taken' : 'Missed'}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
          {logs.length === 0 && <p className="text-center text-gray-500 py-4">No logs recorded this week.</p>}
        </div>
      </div>
    </div>
  );
};

export default WeeklyReport;