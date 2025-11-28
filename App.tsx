
import React, { useState, useEffect, useCallback } from 'react';
import { Medicine, Log, View, RegisteredUser } from './types';
import { initialMedicines, initialLogs, translations } from './constants';
import CaretakerView from './components/CaretakerView';
import PatientView from './components/PatientView';
import ReminderModal from './components/ReminderModal';
import Header from './components/Header';
// Import new auth components
import LandingScreen from './components/LandingScreen';
import RegisterScreen from './components/RegisterScreen';
import LoginChoiceScreen from './components/LoginChoiceScreen';
import CaretakerLoginScreen from './components/CaretakerLoginScreen';
import PatientLoginScreen from './components/PatientLoginScreen';

// --- CONFIGURATION ---
// API Key for Fast2SMS
const FAST2SMS_API_KEY = 'tJE8T3LG0yQIRDdNgFaKloxeZ9rXqsmiO5bMcY7Sj4hHpCvA2zHLnNZyDTIuS7c1Y4MgJklifRd3ebB9';

const App: React.FC = () => {
  // --- STATE WITH PERSISTENCE ---
  
  // 1. ALL USERS (Database Simulation)
  const [allUsers, setAllUsers] = useState<RegisteredUser[]>(() => {
    const saved = localStorage.getItem('allUsers');
    return saved ? JSON.parse(saved) : [];
  });

  // 2. ACTIVE SESSION (Currently Logged in User)
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  // 3. ALL MEDICINES (Filtered by view, stored globally)
  const [allMedicines, setAllMedicines] = useState<Medicine[]>(() => {
    const saved = localStorage.getItem('medicines');
    return saved ? JSON.parse(saved) : initialMedicines;
  });

  // 4. ALL LOGS
  const [allLogs, setAllLogs] = useState<Log[]>(() => {
     const saved = localStorage.getItem('logs');
     if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((l: any) => ({ ...l, timestamp: new Date(l.timestamp) }));
     }
     return initialLogs;
  });

  const [currentView, setCurrentView] = useState<View>(View.Landing);
  const [activeReminder, setActiveReminder] = useState<Medicine | null>(null);
  
  // Auth State (derived from currentUser)
  const isLoggedIn = !!currentUser;
  const [lastSmsTime, setLastSmsTime] = useState<number>(0);

  // --- PERSISTENCE EFFECTS ---
  useEffect(() => {
    localStorage.setItem('allUsers', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    if (currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
        localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('medicines', JSON.stringify(allMedicines));
  }, [allMedicines]);

  useEffect(() => {
    localStorage.setItem('logs', JSON.stringify(allLogs));
  }, [allLogs]);

  // --- DERIVED STATE (DATA FOR CURRENT USER) ---
  // We only show medicines/logs belonging to the currently logged-in caretaker ID
  const userMedicines = currentUser 
    ? allMedicines.filter(m => m.caretakerId === currentUser.caretakerPhone)
    : [];

  const userLogs = currentUser
    ? allLogs.filter(l => l.caretakerId === currentUser.caretakerPhone)
    : [];


  // --- DEEP LINK HANDLING (SMS LINK CLICK) ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const takeMedId = params.get('take_med_id');
    const action = params.get('action');

    if (takeMedId && allMedicines.length > 0) {
      const medToTake = allMedicines.find(m => m.id === takeMedId);
      
      if (medToTake) {
        console.log("Deep link detected for medicine:", medToTake.name);
        
        // If not logged in, we need to temporarily find the user associated with this medicine
        // to enable functionality, or just allow the specific medicine action.
        // For security, we usually require login, but for "Quick Take" links we can allow it
        // strictly for the logging action.
        
        if (action === 'taken') {
            addLog(medToTake.id, 'taken', medToTake.caretakerId); // Pass caretakerId explicitly
            alert(`Success! ${medToTake.name} marked as taken.`);
        } else {
            setActiveReminder(medToTake);
        }
        
        // Clean URL
        const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({path: newUrl}, '', newUrl);
      }
    }
  }, [allMedicines]);


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
    // If ownerId is passed (from deep link), use it. Otherwise use current user.
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
  
  // Helper to send SMS via Fast2SMS API
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
      console.log(`Missed dose for ${activeReminder.name}. Notifying caretaker.`);
      
      // Find the user who owns this medicine
      const medicineOwner = allUsers.find(u => u.caretakerPhone === activeReminder.caretakerId);
      const cPhone = medicineOwner?.caretakerPhone;

      if (cPhone) {
        const foodInstruction = activeReminder.beforeFood ? 'BEFORE' : 'AFTER';
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
        const messageContent = `ALERT: Patient MISSED medicine. Name: ${activeReminder.name} (${activeReminder.dosage}mg). Quantity: ${activeReminder.pills} pill(s). Instruction: ${foodInstruction} food. Time: ${activeReminder.schedule.time}. [${timestamp}]`;
        
        await sendSmsViaApi(cPhone, messageContent);
      }

      addLog(activeReminder.id, 'missed', activeReminder.caretakerId);
    }
  };

  // --- AUTHENTICATION HANDLERS ---

  const handleRegister = (cPhone: string, pPhone: string, password: string) => {
    // Check if user already exists
    if (allUsers.some(u => u.caretakerPhone === cPhone)) {
        alert("An account with this Caretaker Phone Number already exists.");
        return;
    }

    const newUser: RegisteredUser = {
      caretakerPhone: cPhone,
      patientPhone: pPhone,
      password: password,
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

  const handlePatientLogin = (enteredPhone: string) => {
     // Search for any user where the patient phone matches
     const user = allUsers.find(u => u.patientPhone === enteredPhone);

     if (!user) {
        alert("No account found linked to this Patient Phone Number.");
        return;
    }

    // Login successful
    setCurrentUser(user);
    setCurrentView(View.Patient);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView(View.Landing);
  };

  const openNativeSms = (phone: string, message: string) => {
      const ua = navigator.userAgent.toLowerCase();
      const isiOS = ua.includes('iphone') || ua.includes('ipad');
      const separator = isiOS ? '&' : '?';
      const smsLink = `sms:${phone}${separator}body=${encodeURIComponent(message)}`;
      window.location.href = smsLink;
  };

  const sendReminderSMS = async (medicine: Medicine, manualTrigger: boolean = false) => {
    // Find owner of medicine to get patient phone
    const owner = allUsers.find(u => u.caretakerPhone === medicine.caretakerId);
    const targetPhone = owner?.patientPhone;

    if (!targetPhone) {
      if (manualTrigger) alert("Error: No patient phone number found.");
      return;
    }
    
    const now = Date.now();
    if (!manualTrigger && now - lastSmsTime < 120000) {
      return;
    }
    setLastSmsTime(now);

    const foodInstruction = medicine.beforeFood ? 'BEFORE' : 'AFTER';
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    
    const appUrl = `${window.location.origin}${window.location.pathname}`;
    const actionLink = `${appUrl}?take_med_id=${medicine.id}&action=taken`;

    const messageContent = `Take ${medicine.pills} ${medicine.name}. ${foodInstruction} food. Click to confirm: ${actionLink} [${timestamp}]`;
    
    const result = await sendSmsViaApi(targetPhone, messageContent);

    if (result.success) {
      if (manualTrigger) alert(`SMS sent successfully!`);
    } else {
      const errorMsg = result.error || "Unknown Error";
      let reason = `Automated SMS Failed: ${errorMsg}\n\nSwitching to manual mode...`;
      if (typeof errorMsg === 'string' && errorMsg.includes("100 INR")) {
          reason = `Fast2SMS requires a minimum account balance.\n\nOpening your phone's messaging app instead...`;
      }
      triggerManualSmsFallback(reason, targetPhone, messageContent);
    }
  };

  const triggerManualSmsFallback = (reason: string, phone: string, message: string) => {
        const confirmFallback = window.confirm(
            `${reason}\n\nDo you want to open your messaging app to send this reminder?`
        );
        if (confirmFallback) {
            openNativeSms(phone, message);
        }
  }

  // Simulates checking for reminders (GLOBAL CHECK for ALL medicines)
  const checkReminders = useCallback(() => {
    if (activeReminder) return; 

    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
    const currentTime = now.toTimeString().substring(0, 5); // HH:MM

    // We check ALL medicines in the system, not just the logged in user's
    // This allows reminders to trigger even if logged out (if browser is open)
    // OR if we wanted to support multiple users on same browser.
    
    // However, to avoid chaos, let's limit "Popups" to the CURRENT logged in user's context
    // or if no user is logged in, do nothing (security). 
    // BUT the requirement implies the app is "running". 
    // Let's check medicines belonging to CURRENT user if logged in.
    
    const medsToCheck = currentUser ? userMedicines : [];

    for (const med of medsToCheck) {
      if (med.schedule.day.includes(currentDay) && med.schedule.time === currentTime) {
        // Check logs from ALL logs to see if this specific med was taken
        const lastLog = allLogs.find(log => 
          log.medicineId === med.id && 
          (now.getTime() - log.timestamp.getTime() < 60000)
        );

        if (!lastLog) {
           setActiveReminder(med);
           sendReminderSMS(med, false); 
        }
      }
    }
  }, [allMedicines, allLogs, activeReminder, currentUser, lastSmsTime, userMedicines]); // Updated deps

  useEffect(() => {
    if (allMedicines.length > 0) {
        const interval = setInterval(checkReminders, 1000);
        return () => clearInterval(interval);
    }
  }, [checkReminders, allMedicines]);


  const renderActiveReminder = () => {
    if (activeReminder) {
        // When taking via modal, we must pass the ownerId
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
                        />;
                    default:
                        return <LandingScreen onRegisterClick={() => setCurrentView(View.Register)} onLoginClick={() => setCurrentView(View.LoginChoice)} />;
                }
            })()}
        </>
      );
  }

  // Main App Views (After Login)
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
