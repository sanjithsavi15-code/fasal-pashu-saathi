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
    success: 'Success',
    error: 'Error',
    
    // Auth
    login: 'Login',
    logout: 'Logout',
    phoneNumber: 'Phone Number',
    otp: 'OTP',
    enterPhone: 'Enter your phone number',
    enterOtp: 'Enter the OTP sent to your phone',
    verifyOtp: 'Verify OTP',
    appTitle: 'Fasal-Pashu Saathi',
    otpSent: 'OTP Sent',
    otpSentDescription: 'Please check your phone for the verification code',
    successLogin: 'Successfully logged in!',
    phonePlaceholder: '+91 9876543210',
    otpPlaceholder: '123456',
    
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
    earTagPlaceholder: 'e.g., A001, B123',
    customSymptom: 'Symptoms (optional)',
    customSymptomPlaceholder: 'Describe any symptoms',
    cropAgePlaceholder: 'Enter age in days',
    
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
    certificationInfo: 'MRL Compliance',
    amuGuidelines: 'AMU Guidelines',
    
    // Edit Dialog
    editReportTitle: 'Edit Report',
    selectLocation: 'Select location',
    earTag: 'Ear Tag',
    selectCrop: 'Select crop',
    cropAgeDays: 'Crop Age (days)',
    saveChanges: 'Save Changes',
    
    // My Reports
    noReportsYet: 'No reports submitted yet',
    submitFirstReport: 'Submit your first disease report to see it here!',
    animalReport: 'Animal Report',
    cropReport: 'Crop Report',
    earTagLabel: 'Ear Tag',
    symptomIds: 'Symptom IDs',
    disease: 'Disease',
    solution: 'Solution',
    cropName: 'Crop',
    age: 'Age',
    days: 'days',
    pesticide: 'Pesticide',
    dosage: 'Dosage',
    submitted: 'Submitted',
    deleteReport: 'Are you sure you want to delete this report?',
    reportDeleted: 'Report deleted successfully',
    reportUpdated: 'Report updated successfully',
    contactExpert: 'Contact Expert',
    contactExpertSoon: "Feature coming soon! You'll be able to contact nearest experts for advice.",
    
    // Information page instructions
    reportDiseaseInstruction: '1. Report Disease: Select animal or crop, describe symptoms, and add relevant details.',
    viewReportsInstruction: '2. View Reports: Check status of your submitted reports and any responses from experts.',
    askQuestionsInstruction: '3. Ask Questions: Submit queries about farming practices, disease management, or certification.',
    offlineModeInstruction: '4. Offline Mode: App works offline - data syncs when connection returns.',
    languageInstruction: '5. Language: Switch between English, Hindi, and Kannada using the language selector.',
    
    // MRL Info
    mrlDescription: 'Maximum Residue Limits (MRL): Legal limits for pesticide/medicine residues in food products.',
    complianceDescription: 'Compliance: Essential for food safety and export eligibility.',
    withdrawalDescription: 'Withdrawal Period: Time between last treatment and harvest/consumption.',
    documentationDescription: 'Documentation: Keep records of all treatments for certification purposes.',
    
    // AMU Guidelines
    responsibleUse: 'Responsible Use: Use antimicrobials only when necessary and as prescribed.',
    completeCourse: 'Complete Course: Always complete the full treatment course even if symptoms improve.',
    preventResistance: 'Prevent Resistance: Proper use prevents development of resistant bacteria.',
    veterinaryGuidance: 'Veterinary Guidance: Consult qualified veterinarians for treatment decisions.',
    
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
    success: 'सफलता',
    error: 'त्रुटि',
    
    // Auth
    login: 'लॉगिन',
    logout: 'लॉगआउट',
    phoneNumber: 'फोन नंबर',
    otp: 'ओटीपी',
    enterPhone: 'अपना फोन नंबर दर्ज करें',
    enterOtp: 'अपने फोन पर भेजा गया ओटीपी दर्ज करें',
    verifyOtp: 'ओटीपी सत्यापित करें',
    appTitle: 'फसल-पशु साथी',
    otpSent: 'ओटीपी भेजा गया',
    otpSentDescription: 'कृपया सत्यापन कोड के लिए अपना फोन चेक करें',
    successLogin: 'सफलतापूर्वक लॉग इन हो गए!',
    phonePlaceholder: '+91 9876543210',
    otpPlaceholder: '123456',
    
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
    earTagPlaceholder: 'जैसे, A001, B123',
    customSymptom: 'लक्षण (वैकल्पिक)',
    customSymptomPlaceholder: 'किसी भी लक्षण का वर्णन करें',
    cropAgePlaceholder: 'दिनों में आयु दर्ज करें',
    
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
    certificationInfo: 'एमआरएल अनुपालन',
    amuGuidelines: 'एएमयू दिशानिर्देश',
    
    // Edit Dialog
    editReportTitle: 'रिपोर्ट संपादित करें',
    selectLocation: 'स्थान चुनें',
    earTag: 'कान टैग',
    selectCrop: 'फसल चुनें',
    cropAgeDays: 'फसल की आयु (दिन)',
    saveChanges: 'परिवर्तन सहेजें',
    
    // My Reports
    noReportsYet: 'अभी तक कोई रिपोर्ट जमा नहीं की गई',
    submitFirstReport: 'यहाँ देखने के लिए अपनी पहली बीमारी रिपोर्ट जमा करें!',
    animalReport: 'पशु रिपोर्ट',
    cropReport: 'फसल रिपोर्ट',
    earTagLabel: 'कान टैग',
    symptomIds: 'लक्षण आईडी',
    disease: 'बीमारी',
    solution: 'समाधान',
    cropName: 'फसल',
    age: 'आयु',
    days: 'दिन',
    pesticide: 'कीटनाशक',
    dosage: 'खुराक',
    submitted: 'जमा किया गया',
    deleteReport: 'क्या आप वाकई इस रिपोर्ट को हटाना चाहते हैं?',
    reportDeleted: 'रिपोर्ट सफलतापूर्वक हटा दी गई',
    reportUpdated: 'रिपोर्ट सफलतापूर्वक अपडेट की गई',
    contactExpert: 'विशेषज्ञ से संपर्क करें',
    contactExpertSoon: 'सुविधा जल्द आ रही है! आप सलाह के लिए निकटतम विशेषज्ञों से संपर्क कर सकेंगे।',
    
    // Information page instructions
    reportDiseaseInstruction: '1. बीमारी की रिपोर्ट: पशु या फसल चुनें, लक्षणों का वर्णन करें, और प्रासंगिक विवरण जोड़ें।',
    viewReportsInstruction: '2. रिपोर्ट देखें: अपनी जमा की गई रिपोर्ट की स्थिति और विशेषज्ञों की कोई प्रतिक्रिया देखें।',
    askQuestionsInstruction: '3. प्रश्न पूछें: खेती प्रथाओं, बीमारी प्रबंधन, या प्रमाणन के बारे में प्रश्न जमा करें।',
    offlineModeInstruction: '4. ऑफलाइन मोड: ऐप ऑफलाइन काम करता है - कनेक्शन वापस आने पर डेटा सिंक होता है।',
    languageInstruction: '5. भाषा: भाषा चयनकर्ता का उपयोग करके अंग्रेजी, हिंदी और कन्नड़ के बीच स्विच करें।',
    
    // MRL Info
    mrlDescription: 'अधिकतम अवशेष सीमा (एमआरएल): खाद्य उत्पादों में कीटनाशक/दवा अवशेषों की कानूनी सीमा।',
    complianceDescription: 'अनुपालन: खाद्य सुरक्षा और निर्यात पात्रता के लिए आवश्यक।',
    withdrawalDescription: 'निकासी अवधि: अंतिम उपचार और फसल/उपभोग के बीच का समय।',
    documentationDescription: 'प्रलेखन: प्रमाणन उद्देश्यों के लिए सभी उपचारों का रिकॉर्ड रखें।',
    
    // AMU Guidelines
    responsibleUse: 'जिम्मेदार उपयोग: केवल आवश्यक होने पर और निर्धारित अनुसार रोगाणुरोधी का उपयोग करें।',
    completeCourse: 'पूर्ण कोर्स: लक्षणों में सुधार होने पर भी हमेशा पूरा उपचार कोर्स पूरा करें।',
    preventResistance: 'प्रतिरोध रोकें: उचित उपयोग प्रतिरोधी बैक्टीरिया के विकास को रोकता है।',
    veterinaryGuidance: 'पशु चिकित्सा मार्गदर्शन: उपचार निर्णयों के लिए योग्य पशु चिकित्सकों से सलाह लें।',
    
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
    success: 'ಯಶಸ್ಸು',
    error: 'ದೋಷ',
    
    // Auth
    login: 'ಲಾಗಿನ್',
    logout: 'ಲಾಗ್‌ಔಟ್',
    phoneNumber: 'ಫೋನ್ ಸಂಖ್ಯೆ',
    otp: 'ಒಟಿಪಿ',
    enterPhone: 'ನಿಮ್ಮ ಫೋನ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ',
    enterOtp: 'ನಿಮ್ಮ ಫೋನ್‌ಗೆ ಕಳುಹಿಸಲಾದ ಒಟಿಪಿ ನಮೂದಿಸಿ',
    verifyOtp: 'ಒಟಿಪಿ ಪರಿಶೀಲಿಸಿ',
    appTitle: 'ಫಸಲ್-ಪಶು ಸಾಥಿ',
    otpSent: 'ಒಟಿಪಿ ಕಳುಹಿಸಲಾಗಿದೆ',
    otpSentDescription: 'ದಯವಿಟ್ಟು ಪರಿಶೀಲನಾ ಕೋಡ್‌ಗಾಗಿ ನಿಮ್ಮ ಫೋನ್ ಪರಿಶೀಲಿಸಿ',
    successLogin: 'ಯಶಸ್ವಿಯಾಗಿ ಲಾಗ್ ಇನ್ ಮಾಡಲಾಗಿದೆ!',
    phonePlaceholder: '+91 9876543210',
    otpPlaceholder: '123456',
    
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
    earTagPlaceholder: 'ಉದಾ., A001, B123',
    customSymptom: 'ಲಕ್ಷಣಗಳು (ಐಚ್ಛಿಕ)',
    customSymptomPlaceholder: 'ಯಾವುದೇ ಲಕ್ಷಣಗಳನ್ನು ವಿವರಿಸಿ',
    cropAgePlaceholder: 'ದಿನಗಳಲ್ಲಿ ವಯಸ್ಸನ್ನು ನಮೂದಿಸಿ',
    
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
    certificationInfo: 'ಎಂಆರ್‌ಎಲ್ ಅನುಸರಣೆ',
    amuGuidelines: 'ಎಎಂಯು ಮಾರ್ಗದರ್ಶನಗಳು',
    
    // Edit Dialog
    editReportTitle: 'ವರದಿ ಸಂಪಾದಿಸಿ',
    selectLocation: 'ಸ್ಥಳ ಆಯ್ಕೆಮಾಡಿ',
    earTag: 'ಕಿವಿ ಟ್ಯಾಗ್',
    selectCrop: 'ಬೆಳೆ ಆಯ್ಕೆಮಾಡಿ',
    cropAgeDays: 'ಬೆಳೆಯ ವಯಸ್ಸು (ದಿನಗಳು)',
    saveChanges: 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ',
    
    // My Reports
    noReportsYet: 'ಇನ್ನೂ ಯಾವುದೇ ವರದಿಗಳು ಸಲ್ಲಿಸಲಾಗಿಲ್ಲ',
    submitFirstReport: 'ಇಲ್ಲಿ ನೋಡಲು ನಿಮ್ಮ ಮೊದಲ ರೋಗ ವರದಿಯನ್ನು ಸಲ್ಲಿಸಿ!',
    animalReport: 'ಪ್ರಾಣಿ ವರದಿ',
    cropReport: 'ಬೆಳೆ ವರದಿ',
    earTagLabel: 'ಕಿವಿ ಟ್ಯಾಗ್',
    symptomIds: 'ಲಕ್ಷಣ ಐಡಿಗಳು',
    disease: 'ರೋಗ',
    solution: 'ಪರಿಹಾರ',
    cropName: 'ಬೆಳೆ',
    age: 'ವಯಸ್ಸು',
    days: 'ದಿನಗಳು',
    pesticide: 'ಕೀಟನಾಶಕ',
    dosage: 'ಡೋಸೇಜ್',
    submitted: 'ಸಲ್ಲಿಸಲಾಗಿದೆ',
    deleteReport: 'ನೀವು ಖಚಿತವಾಗಿ ಈ ವರದಿಯನ್ನು ಅಳಿಸಲು ಬಯಸುವಿರಾ?',
    reportDeleted: 'ವರದಿ ಯಶಸ್ವಿಯಾಗಿ ಅಳಿಸಲಾಗಿದೆ',
    reportUpdated: 'ವರದಿ ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ',
    contactExpert: 'ತಜ್ಞರನ್ನು ಸಂಪರ್ಕಿಸಿ',
    contactExpertSoon: 'ವೈಶಿಷ್ಟ್ಯ ಶೀಘ್ರದಲ್ಲಿ ಬರುತ್ತದೆ! ಸಲಹೆಗಾಗಿ ನೀವು ಹತ್ತಿರದ ತಜ್ಞರನ್ನು ಸಂಪರ್ಕಿಸಲು ಸಾಧ್ಯವಾಗುತ್ತದೆ.',
    
    // Information page instructions
    reportDiseaseInstruction: '1. ರೋಗ ವರದಿ: ಪ್ರಾಣಿ ಅಥವಾ ಬೆಳೆ ಆಯ್ಕೆಮಾಡಿ, ಲಕ್ಷಣಗಳನ್ನು ವಿವರಿಸಿ, ಮತ್ತು ಸಂಬಂಧಿತ ವಿವರಗಳನ್ನು ಸೇರಿಸಿ.',
    viewReportsInstruction: '2. ವರದಿಗಳನ್ನು ನೋಡಿ: ನಿಮ್ಮ ಸಲ್ಲಿಸಿದ ವರದಿಗಳ ಸ್ಥಿತಿ ಮತ್ತು ತಜ್ಞರಿಂದ ಯಾವುದೇ ಪ್ರತಿಕ್ರಿಯೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.',
    askQuestionsInstruction: '3. ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ: ಕೃಷಿ ಅಭ್ಯಾಸಗಳು, ರೋಗ ನಿರ್ವಹಣೆ, ಅಥವಾ ಪ್ರಮಾಣೀಕರಣದ ಬಗ್ಗೆ ಪ್ರಶ್ನೆಗಳನ್ನು ಸಲ್ಲಿಸಿ.',
    offlineModeInstruction: '4. ಆಫ್‌ಲೈನ್ ಮೋಡ್: ಅಪ್ಲಿಕೇಶನ್ ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿ ಕೆಲಸ ಮಾಡುತ್ತದೆ - ಸಂಪರ್ಕ ಹಿಂತಿರುಗಿದಾಗ ಡೇಟಾ ಸಿಂಕ್ ಆಗುತ್ತದೆ.',
    languageInstruction: '5. ಭಾಷೆ: ಭಾಷೆ ಆಯ್ಕೆಗಾರನ್ನು ಬಳಸಿಕೊಂಡು ಇಂಗ್ಲಿಷ್, ಹಿಂದಿ ಮತ್ತು ಕನ್ನಡ ನಡುವೆ ಬದಲಾಯಿಸಿ.',
    
    // MRL Info
    mrlDescription: 'ಗರಿಷ್ಠ ಅವಶೇಷ ಮಿತಿಗಳು (ಎಂಆರ್‌ಎಲ್): ಆಹಾರ ಉತ್ಪನ್ನಗಳಲ್ಲಿ ಕೀಟನಾಶಕ/ಔಷಧ ಅವಶೇಷಗಳ ಕಾನೂನು ಮಿತಿಗಳು.',
    complianceDescription: 'ಅನುಸರಣೆ: ಆಹಾರ ಸುರಕ್ಷತೆ ಮತ್ತು ರಫ್ತು ಅರ್ಹತೆಗೆ ಅಗತ್ಯ.',
    withdrawalDescription: 'ಹಿಂತೆಗೆದುಕೊಳ್ಳುವ ಅವಧಿ: ಕೊನೆಯ ಚಿಕಿತ್ಸೆ ಮತ್ತು ಕೊಯ್ಲು/ಸೇವನೆಯ ನಡುವಿನ ಸಮಯ.',
    documentationDescription: 'ದಾಖಲೀಕರಣ: ಪ್ರಮಾಣೀಕರಣ ಉದ್ದೇಶಗಳಿಗಾಗಿ ಎಲ್ಲಾ ಚಿಕಿತ್ಸೆಗಳ ದಾಖಲೆಗಳನ್ನು ಇಟ್ಟುಕೊಳ್ಳಿ.',
    
    // AMU Guidelines
    responsibleUse: 'ಜವಾಬ್ದಾರಿಯುತ ಬಳಕೆ: ಅಗತ್ಯವಿದ್ದಾಗ ಮಾತ್ರ ಮತ್ತು ನಿರ್ದೇಶಿಸಿದಂತೆ ಆಂಟಿಮೈಕ್ರೋಬಿಯಲ್‌ಗಳನ್ನು ಬಳಸಿ.',
    completeCourse: 'ಪೂರ್ಣ ಕೋರ್ಸ್: ಲಕ್ಷಣಗಳು ಸುಧಾರಿಸಿದರೂ ಯಾವಾಗಲೂ ಪೂರ್ಣ ಚಿಕಿತ್ಸಾ ಕೋರ್ಸ್ ಪೂರ್ಣಗೊಳಿಸಿ.',
    preventResistance: 'ಪ್ರತಿರೋಧವನ್ನು ತಡೆಯಿರಿ: ಸರಿಯಾದ ಬಳಕೆ ಪ್ರತಿರೋಧಿ ಬ್ಯಾಕ್ಟೀರಿಯಾದ ಬೆಳವಣಿಗೆಯನ್ನು ತಡೆಯುತ್ತದೆ.',
    veterinaryGuidance: 'ಪಶುವೈದ್ಯಕೀಯ ಮಾರ್ಗದರ್ಶನ: ಚಿಕಿತ್ಸಾ ನಿರ್ಧಾರಗಳಿಗಾಗಿ ಅರ್ಹ ಪಶುವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.',
    
    // Offline
    offlineMode: 'ಆಫ್‌ಲೈನ್ ಮೋಡ್',
    dataWillSync: 'ಸಂಪರ್ಕ ಮರುಸ್ಥಾಪನೆಯಾದಾಗ ಡೇಟಾ ಸಿಂಕ್ ಆಗುತ್ತದೆ',
  }
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState('english');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
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