
import React, { useState, useEffect, useCallback } from 'react';
import { Medicine, Log, View, RegisteredUser } from './types';
import { initialMedicines, initialLogs, translations } from './constants';
import CaretakerView from './components/CaretakerView';
import PatientView from './components/PatientView';
import ReminderModal from './components/ReminderModal';
import Header from './components/Header';
import LandingScreen from './components/LandingScreen';
import RegisterScreen from './components/RegisterScreen';
import LoginChoiceScreen from './components/LoginChoiceScreen';
import CaretakerLoginScreen from './components/CaretakerLoginScreen';
import PatientLoginScreen from './components/PatientLoginScreen';

// --- CONFIGURATION ---
const FAST2SMS_API_KEY = 'tJE8T3LG0yQIRDdNgFaKloxeZ9rXqsmiO5bMcY7Sj4hHpCvA2zHLnNZyDTIuS7c1Y4MgJklifRd3ebB9';

const App: React.FC = () => {
  // --- STATE WITH PERSISTENCE (V2 Keys to Wipe Old Data) ---
  
  // 1. ALL USERS (Database Simulation)
  const [allUsers, setAllUsers] = useState<RegisteredUser[]>(() => {
    const saved = localStorage.getItem('users_v2');
    if (saved) {
        return JSON.parse(saved);
    }
    return [];
  });

  // 2. ACTIVE SESSION
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(() => {
    const saved = localStorage.getItem('currentUser_v2');
    return saved ? JSON.parse(saved) : null;
  });

  // 3. ALL MEDICINES
  const [allMedicines, setAllMedicines] = useState<Medicine[]>(() => {
    const saved = localStorage.getItem('medicines_v2');
    return saved ? JSON.parse(saved) : initialMedicines;
  });

  // 4. ALL LOGS
  const [allLogs, setAllLogs] = useState<Log[]>(() => {
     const saved = localStorage.getItem('logs_v2');
     if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((l: any) => ({ ...l, timestamp: new Date(l.timestamp) }));
     }
     return initialLogs;
  });

  const [currentView, setCurrentView] = useState<View>(View.Landing);
  const [activeReminder, setActiveReminder] = useState<Medicine | null>(null);
  
  const isLoggedIn = !!currentUser;
  
  // Persist SMS timestamps to avoid duplicate sending on refresh
  const [lastSmsTime, setLastSmsTime] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('lastSmsTime_v2');
    return saved ? JSON.parse(saved) : {};
  });

  // --- PERSISTENCE EFFECTS ---
  useEffect(() => {
    localStorage.setItem('users_v2', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    if (currentUser) {
        localStorage.setItem('currentUser_v2', JSON.stringify(currentUser));
    } else {
        localStorage.removeItem('currentUser_v2');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('medicines_v2', JSON.stringify(allMedicines));
  }, [allMedicines]);

  useEffect(() => {
    localStorage.setItem('logs_v2', JSON.stringify(allLogs));
  }, [allLogs]);

  useEffect(() => {
    localStorage.setItem('lastSmsTime_v2', JSON.stringify(lastSmsTime));
  }, [lastSmsTime]);

  // --- HELPER FUNCTIONS ---
  const formatTime12Hour = (time24: string) => {
    if (!time24) return '';
    const [h, m] = time24.split(':');
    let hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${m} ${ampm}`;
  };

  // --- DERIVED STATE ---
  const userMedicines = currentUser 
    ? allMedicines.filter(m => m.caretakerId === currentUser.caretakerPhone)
    : [];

  const userLogs = currentUser
    ? allLogs.filter(l => l.caretakerId === currentUser.caretakerPhone)
    : [];

  const addMedicine = (med: Omit<Medicine, 'id' | 'caretakerId'>) => {
    if (!currentUser) return;
    const newMed: Medicine = { 
        ...med, 
        id: Date.now().toString(),
        caretakerId: currentUser.caretakerPhone 
    };
    setAllMedicines(prev => [...prev, newMed].sort((a,b) => a.schedule.time.localeCompare(b.schedule.time)));
  };

  const addLog = (medicineId: string, status: 'taken' | 'missed', ownerId?: string) => {
    const cid = ownerId || currentUser?.caretakerPhone;
    if (!cid) return;

    const newLog: Log = {
      id: Date.now().toString(),
      medicineId,
      caretakerId: cid,
      timestamp: new Date(),
      status,
    };
    setAllLogs(prev => [...prev, newLog]);
    setActiveReminder(null);
  };
  
  const sendSmsViaApi = async (phone: string, message: string): Promise<{ success: boolean; error?: string }> => {
    if (!phone || !FAST2SMS_API_KEY) return { success: false, error: 'Missing Phone or API Key' };

    const cleanPhone = phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.length > 10 ? cleanPhone.slice(-10) : cleanPhone;

    try {
      const fast2SmsUrl = `https://www.fast2sms.com/dev/bulkV2?authorization=${FAST2SMS_API_KEY}&message=${encodeURIComponent(message)}&language=english&route=q&numbers=${formattedPhone}&flash=0`;
      const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(fast2SmsUrl)}`;

      const response = await fetch(proxyUrl);
      const data = await response.json();

      if (data && data.return === true) {
        return { success: true };
      } else {
        return { success: false, error: data?.message || "Unknown API Error" };
      }
    } catch (error: any) {
      if (error instanceof SyntaxError) {
         return { success: false, error: "Network/Proxy Error (Invalid JSON)" };
      }
      return { success: false, error: error.message };
    }
  };

  const handleReminderTimeout = async () => {
    if (activeReminder) {
      const medicineOwner = allUsers.find(u => u.caretakerPhone === activeReminder.caretakerId);
      const cPhone = medicineOwner?.caretakerPhone;

      if (cPhone) {
        const foodInstruction = activeReminder.beforeFood ? 'BEFORE' : 'AFTER';
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
        const messageContent = `ALERT: Patient MISSED medicine. Name: ${activeReminder.name} (${activeReminder.dosage}mg). Quantity: ${activeReminder.pills} pill(s). Instruction: ${foodInstruction} food. Time: ${formatTime12Hour(activeReminder.schedule.time)}. [${timestamp}]`;
        
        await sendSmsViaApi(cPhone, messageContent);
      }
      addLog(activeReminder.id, 'missed', activeReminder.caretakerId);
    }
  };

  // --- AUTHENTICATION HANDLERS ---

  const handleRegister = (cPhone: string, pPhone: string, password: string, faceImage: string) => {
    if (allUsers.some(u => u.caretakerPhone === cPhone)) {
        alert("An account with this Caretaker Phone Number already exists.");
        return;
    }

    const newUser: RegisteredUser = {
      caretakerPhone: cPhone,
      patientPhone: pPhone,
      password: password,
      faceImage: faceImage,
    };

    setAllUsers(prev => [...prev, newUser]);
    alert("Registration Successful! Please login.");
    setCurrentView(View.Landing);
  };

  const handleCaretakerLogin = (phone: string, password: string) => {
    const user = allUsers.find(u => u.caretakerPhone === phone);
    if (!user) {
        alert("No account found with this Caretaker Phone Number.");
        return;
    }
    if (password === user.password) {
        setCurrentUser(user);
        setCurrentView(View.Caretaker);
    } else {
        alert(translations.incorrectPasswordError);
    }
  };

  const handlePatientLogin = (matchedUserPhone: string) => {
     // Because Face ID simulation matched a user, we get their phone number and log them in
     const user = allUsers.find(u => u.patientPhone === matchedUserPhone);
     if (!user) {
        alert("Authentication Error: User not found.");
        return;
    }
    setCurrentUser(user);
    setCurrentView(View.Patient);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView(View.Landing);
  };

  const sendReminderSMS = async (medicine: Medicine, manualTrigger: boolean = false) => {
    const owner = allUsers.find(u => u.caretakerPhone === medicine.caretakerId);
    const targetPhone = owner?.patientPhone;

    if (!targetPhone) {
      if (manualTrigger) alert("Error: No patient phone number found.");
      return;
    }
    
    const now = Date.now();
    // Throttle SMS: Do not send if sent in the last 2 minutes for this medicine
    if (!manualTrigger && lastSmsTime[medicine.id] && now - lastSmsTime[medicine.id] < 120000) {
      return;
    }
    
    setLastSmsTime(prev => ({ ...prev, [medicine.id]: now }));
    const foodInstruction = medicine.beforeFood ? 'BEFORE' : 'AFTER';
    const messageContent = `MediRemind:\nTake ${medicine.pills} pill(s) of\n${medicine.name} (${medicine.dosage}mg)\n${foodInstruction} food.\nTime: ${formatTime12Hour(medicine.schedule.time)}.`;
    
    await sendSmsViaApi(targetPhone, messageContent);
  };

  const checkReminders = useCallback(() => {
    if (activeReminder) return; 

    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
    const currentTimeStr = now.toTimeString().substring(0, 5); // HH:MM
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const medsToCheck = allMedicines;

    for (const med of medsToCheck) {
      if (!med.schedule.day.includes(currentDay)) continue;

      const [schedH, schedM] = med.schedule.time.split(':').map(Number);
      const schedMinutes = schedH * 60 + schedM;
      const diff = currentMinutes - schedMinutes;

      // Check window: Trigger if within 30 minutes of schedule
      if (diff >= 0 && diff <= 30) {
        const takenToday = allLogs.some(log => 
          log.medicineId === med.id && 
          log.timestamp.toDateString() === now.toDateString() &&
          log.status === 'taken'
        );
        
        // Also check if we already marked it as missed to prevent re-alarming
        const missedToday = allLogs.some(log =>
            log.medicineId === med.id &&
            log.timestamp.toDateString() === now.toDateString() &&
            log.status === 'missed'
        );

        if (!takenToday && !missedToday) {
           setActiveReminder(med);
           // Only send SMS at the exact minute (or close to it) to avoid spamming 
           // and rely on lastSmsTime for throttling
           if (med.schedule.time === currentTimeStr) {
               sendReminderSMS(med, false); 
           }
        }
      }
    }
  }, [allMedicines, allLogs, activeReminder, lastSmsTime, allUsers]); 

  useEffect(() => {
    if (allMedicines.length > 0) {
        const interval = setInterval(checkReminders, 1000);
        return () => clearInterval(interval);
    }
  }, [checkReminders, allMedicines]);


  const renderActiveReminder = () => {
    if (activeReminder) {
        return (
            <ReminderModal 
              medicine={activeReminder} 
              onTaken={() => addLog(activeReminder.id, 'taken', activeReminder.caretakerId)}
              onTimeout={handleReminderTimeout}
            />
        );
    }
    return null;
  };

  if (!isLoggedIn) {
      return (
        <>
            {renderActiveReminder()}
            {(() => {
                switch (currentView) {
                    case View.Landing:
                        return <LandingScreen 
                            onRegisterClick={() => setCurrentView(View.Register)}
                            onLoginClick={() => setCurrentView(View.LoginChoice)}
                        />;
                    case View.Register:
                        return <RegisterScreen 
                            onRegister={handleRegister} 
                            onBack={() => setCurrentView(View.Landing)}
                        />;
                    case View.LoginChoice:
                        return <LoginChoiceScreen
                            onCaretakerSelect={() => setCurrentView(View.LoginCaretaker)}
                            onPatientSelect={() => setCurrentView(View.LoginPatient)}
                            onBack={() => setCurrentView(View.Landing)}
                        />;
                    case View.LoginCaretaker:
                        return <CaretakerLoginScreen 
                            onLogin={handleCaretakerLogin}
                            onBack={() => setCurrentView(View.LoginChoice)}
                        />;
                    case View.LoginPatient:
                        return <PatientLoginScreen 
                            onSuccess={handlePatientLogin}
                            onBack={() => setCurrentView(View.LoginChoice)}
                            registeredUsers={allUsers}
                        />;
                    default:
                        return <LandingScreen onRegisterClick={() => setCurrentView(View.Register)} onLoginClick={() => setCurrentView(View.LoginChoice)} />;
                }
            })()}
        </>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onLogout={handleLogout} />
      <main className="flex-grow p-4">
        {currentView === View.Caretaker ? (
          <CaretakerView medicines={userMedicines} addMedicine={addMedicine} logs={userLogs} />
        ) : (
          <PatientView medicines={userMedicines} logs={userLogs} />
        )}
      </main>
      {renderActiveReminder()}
    </div>
  );
};

export default App;
