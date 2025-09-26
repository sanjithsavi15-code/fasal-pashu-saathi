import { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const translations = {
  english: {
    // Common
    loading: 'Loading...',
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    back: 'Back',
    next: 'Next',
    
    // Auth
    login: 'Login',
    logout: 'Logout',
    phoneNumber: 'Phone Number',
    otp: 'OTP',
    enterPhone: 'Enter your phone number',
    enterOtp: 'Enter the OTP sent to your phone',
    verifyOtp: 'Verify OTP',
    
    // Navigation
    home: 'Home',
    reportDisease: 'Report Disease',
    myReports: 'My Reports',
    queries: 'Queries',
    information: 'Information',
    dashboard: 'Dashboard',
    
    // Disease Report
    selectType: 'Select Type',
    animal: 'Animal',
    crop: 'Crop',
    symptoms: 'Symptoms',
    earTagNumber: 'Ear Tag Number',
    cropAge: 'Crop Age (days)',
    location: 'Location',
    submitReport: 'Submit Report',
    
    // Status
    pending: 'Pending',
    reviewed: 'Reviewed',
    resolved: 'Resolved',
    
    // Queries
    subject: 'Subject',
    message: 'Message',
    submitQuery: 'Submit Query',
    myQueries: 'My Queries',
    
    // Information
    appInstructions: 'App Instructions',
    certificationInfo: 'Certification & MRL Compliance',
    amuGuidelines: 'AMU Guidelines',
    
    // Offline
    offlineMode: 'Offline Mode',
    dataWillSync: 'Data will sync when connection is restored',
  },
  hindi: {
    // Common
    loading: 'लोड हो रहा है...',
    submit: 'जमा करें',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    back: 'वापस',
    next: 'अगला',
    
    // Auth
    login: 'लॉगिन',
    logout: 'लॉगआउट',
    phoneNumber: 'फोन नंबर',
    otp: 'ओटीपी',
    enterPhone: 'अपना फोन नंबर दर्ज करें',
    enterOtp: 'अपने फोन पर भेजा गया ओटीपी दर्ज करें',
    verifyOtp: 'ओटीपी सत्यापित करें',
    
    // Navigation
    home: 'मुख्य',
    reportDisease: 'रोग की रिपोर्ट करें',
    myReports: 'मेरी रिपोर्ट',
    queries: 'प्रश्न',
    information: 'जानकारी',
    dashboard: 'डैशबोर्ड',
    
    // Disease Report
    selectType: 'प्रकार चुनें',
    animal: 'पशु',
    crop: 'फसल',
    symptoms: 'लक्षण',
    earTagNumber: 'कान टैग नंबर',
    cropAge: 'फसल की आयु (दिन)',
    location: 'स्थान',
    submitReport: 'रिपोर्ट जमा करें',
    
    // Status
    pending: 'लंबित',
    reviewed: 'समीक्षित',
    resolved: 'हल',
    
    // Queries
    subject: 'विषय',
    message: 'संदेश',
    submitQuery: 'प्रश्न जमा करें',
    myQueries: 'मेरे प्रश्न',
    
    // Information
    appInstructions: 'ऐप निर्देश',
    certificationInfo: 'प्रमाणन और एमआरएल अनुपालन',
    amuGuidelines: 'एएमयू दिशानिर्देश',
    
    // Offline
    offlineMode: 'ऑफलाइन मोड',
    dataWillSync: 'कनेक्शन बहाल होने पर डेटा सिंक होगा',
  },
  kannada: {
    // Common
    loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
    submit: 'ಸಲ್ಲಿಸಿ',
    cancel: 'ರದ್ದುಗೊಳಿಸಿ',
    save: 'ಉಳಿಸಿ',
    edit: 'ಸಂಪಾದಿಸಿ',
    delete: 'ಅಳಿಸಿ',
    back: 'ಹಿಂದೆ',
    next: 'ಮುಂದೆ',
    
    // Auth
    login: 'ಲಾಗಿನ್',
    logout: 'ಲಾಗ್‌ಔಟ್',
    phoneNumber: 'ಫೋನ್ ಸಂಖ್ಯೆ',
    otp: 'ಒಟಿಪಿ',
    enterPhone: 'ನಿಮ್ಮ ಫೋನ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ',
    enterOtp: 'ನಿಮ್ಮ ಫೋನ್‌ಗೆ ಕಳುಹಿಸಲಾದ ಒಟಿಪಿ ನಮೂದಿಸಿ',
    verifyOtp: 'ಒಟಿಪಿ ಪರಿಶೀಲಿಸಿ',
    
    // Navigation
    home: 'ಮುಖ್ಯ',
    reportDisease: 'ರೋಗದ ವರದಿ ಮಾಡಿ',
    myReports: 'ನನ್ನ ವರದಿಗಳು',
    queries: 'ಪ್ರಶ್ನೆಗಳು',
    information: 'ಮಾಹಿತಿ',
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    
    // Disease Report
    selectType: 'ಪ್ರಕಾರ ಆಯ್ಕೆಮಾಡಿ',
    animal: 'ಪ್ರಾಣಿ',
    crop: 'ಬೆಳೆ',
    symptoms: 'ಲಕ್ಷಣಗಳು',
    earTagNumber: 'ಕಿವಿ ಟ್ಯಾಗ್ ಸಂಖ್ಯೆ',
    cropAge: 'ಬೆಳೆಯ ವಯಸ್ಸು (ದಿನಗಳು)',
    location: 'ಸ್ಥಳ',
    submitReport: 'ವರದಿ ಸಲ್ಲಿಸಿ',
    
    // Status
    pending: 'ಬಾಕಿ',
    reviewed: 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
    resolved: 'ಪರಿಹರಿಸಲಾಗಿದೆ',
    
    // Queries
    subject: 'ವಿಷಯ',
    message: 'ಸಂದೇಶ',
    submitQuery: 'ಪ್ರಶ್ನೆ ಸಲ್ಲಿಸಿ',
    myQueries: 'ನನ್ನ ಪ್ರಶ್ನೆಗಳು',
    
    // Information
    appInstructions: 'ಅಪ್ಲಿಕೇಶನ್ ಸೂಚನೆಗಳು',
    certificationInfo: 'ಪ್ರಮಾಣೀಕರಣ ಮತ್ತು ಎಂಆರ್‌ಎಲ್ ಅನುಸರಣೆ',
    amuGuidelines: 'ಎಎಂಯು ಮಾರ್ಗದರ್ಶನಗಳು',
    
    // Offline
    offlineMode: 'ಆಫ್‌ಲೈನ್ ಮೋಡ್',
    dataWillSync: 'ಸಂಪರ್ಕ ಮರುಸ್ಥಾಪನೆಯಾದಾಗ ಡೇಟಾ ಸಿಂಕ್ ಆಗುತ್ತದೆ',
  }
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState('english');

  useEffect(() => {
    const saved = localStorage.getItem('preferred_language');
    if (saved && translations[saved as keyof typeof translations]) {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('preferred_language', lang);
  };

  const t = (key: string): string => {
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations.english] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};