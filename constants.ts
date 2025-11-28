
import { Medicine, Log } from './types';

export const DAYS_OF_WEEK: string[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const initialMedicines: Medicine[] = [];

export const initialLogs: Log[] = [];

export const translations = {
  appTitle: 'MediRemind',
  caretakerView: 'Caretaker',
  patientView: 'Patient',
  english: 'English',
  hindi: 'Hindi',
  loginWelcome: 'Welcome to MediRemind',
  loginPrompt: 'Register your account to begin.',
  caretakerPhoneLabel: 'Caretaker Phone Number',
  patientPhoneLabel: 'Patient Phone Number',
  loginButton: 'Register & Login',
  patientTitle: "Today's Schedule",
  beforeFood: 'Before Food',
  afterFood: 'After Food',
  reminderTitle: "It's time for your medicine!",
  takenButton: 'I have taken medicine',
  missedDoseWarning: 'If not taken in 10 minutes, the caretaker will be notified.',
  dosesTaken: 'Doses Taken',
  dosesMissed: 'Doses Missed',
  addMedicineTitle: 'Add New Medicine',
  medicineNameLabel: 'Medicine Name',
  dosageLabel: 'Dosage (mg)',
  pillsLabel: 'Number of Pills',
  scheduleTimeLabel: 'Time',
  scheduleDaysLabel: 'Days',
  addImageLabel: 'Add Image',
  addAudioLabel: 'Add Audio',
  addMedicineButton: 'Add Medicine',
  medicineListTitle: 'All Medicines',
  weeklyReportTitle: 'Weekly Adherence Report',
  scheduledMedicinesView: 'Scheduled Medicines',
  addNewMedicineView: 'Add New Medicine',
  weeklyReportView: 'Weekly Report',
  am: 'AM',
  pm: 'PM',
  caretakerPasswordPrompt: 'Enter Caretaker Password',
  passwordLabel: 'Password',
  confirmPasswordLabel: 'Confirm Password',
  submitButton: 'Submit',
  cancelButton: 'Cancel',
  incorrectPasswordError: 'Incorrect password. Please try again.',
  passwordMismatchError: 'Passwords do not match.',
  logoutButton: 'Logout',
  
  // New Auth Strings
  landingTitle: 'Smart Medicine Reminder',
  landingSubtitle: 'Care for your loved ones remotely.',
  registerButton: 'Register New Account',
  loginButtonMain: 'Login to Existing Account',
  loginChoiceTitle: 'Who are you?',
  caretakerLoginTitle: 'Caretaker Login',
  patientLoginTitle: 'Patient Login',
  patientLoginPrompt: 'Scanning for registered face...',
  noAccountError: 'No account found. Please Register first.',
  incorrectPhoneError: 'Incorrect Patient Phone Number.',

  // Password Requirements
  passwordRequirementsTitle: 'Password must contain:',
  pwdReqLength: 'At least 6 characters',
  pwdReqLetter: 'At least one letter',
  pwdReqNumber: 'At least one number',
  pwdReqSpecial: 'At least one special character (!@#$...)',
  passwordInvalidError: 'Password does not meet requirements.',

  // Face ID
  cameraPermissionError: 'Camera permission denied. Please allow camera access or upload a photo.',
  captureFace: 'Capture Patient Face',
  retakePhoto: 'Retake Photo',
  uploadPhoto: 'Upload Photo Instead',
  scanningFace: 'Scanning...',
  faceVerified: 'Face Verified!',
  faceNotRecognized: 'Face not recognized. Please try again.',
};
