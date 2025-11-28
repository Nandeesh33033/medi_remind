
export interface Medicine {
  id: string;
  caretakerId: string; // New field to link medicine to a specific caretaker
  name: string;
  dosage: number; // in mg
  pills: number; // Number of pills to take
  beforeFood: boolean;
  schedule: {
    day: string[]; // e.g., ["Monday", "Wednesday"]
    time: string; // e.g., "08:00"
  };
  image: string; // URL or base64 string
  audio: string; // URL or base64 string
}

export interface Log {
  id: string;
  caretakerId: string; // New field to link log to a specific user account
  medicineId: string;
  timestamp: Date;
  status: 'taken' | 'missed';
}

export enum View {
  Landing = 'LANDING',
  Register = 'REGISTER',
  LoginChoice = 'LOGIN_CHOICE',
  LoginCaretaker = 'LOGIN_CARETAKER',
  LoginPatient = 'LOGIN_PATIENT',
  Caretaker = 'CARETAKER',
  Patient = 'PATIENT',
}

export enum Language {
  EN = 'en',
  HI = 'hi',
}

export interface RegisteredUser {
  caretakerPhone: string; // Acts as the Unique ID (Primary Key)
  patientPhone: string;
  password: string;
  faceImage: string; // Base64 string of the patient's face
}
