/**
 * Internationalization configuration using i18next
 */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Resources for different languages
const resources = {
  en: {
    translation: {
      // Navigation
      "nav.home": "Home",
      "nav.about": "About",
      "nav.sponsors": "Sponsors",
      "nav.join": "Join",
      "nav.competition": "Competition",
      "nav.contact": "Contact",

      // Join page
      "join.why": "Why Join?",
      "join.teams": "The Teams",
      "join.ready": "Ready to Apply?",
      "join.apply": "Apply Now",
      "join.readyDescription":
        "Submit your application through our online form to join one of our teams. We're looking for motivated students with a passion for autonomous technology.",

      // Team descriptions
      "team.red.title": "Red Team",
      "team.red.description":
        "The Red Team focuses on hardware and vehicle systems. Members work on mechanical design, electrical systems, sensor integration, and physical vehicle development. This team is ideal for those interested in robotics, hardware design, electrical engineering, and systems integration.",

      "team.black.title": "Black Team",
      "team.black.description":
        "The Black Team leads software architecture and algorithms development. Members work on path planning, decision making, control systems, and simulation. This team is perfect for those passionate about software engineering, algorithms, machine learning, and system architecture.",

      "team.cv.title": "CV Team",
      "team.cv.description":
        "The Computer Vision (CV) Team develops perception systems for autonomous navigation. Members work on object detection, lane identification, environmental mapping, and sensor fusion. This team is ideal for those interested in computer vision, deep learning, and AI applications.",

      // Application form
      "application.title": "Join WE Autopilot",
      "application.personal": "Personal Information",
      "application.teamSelection": "Team Selection",
      "application.resume": "Resume Upload",
      "application.name": "Full Name",
      "application.email": "Personal Email",
      "application.schoolEmail": "School Email",
      "application.studentId": "Student ID",
      "application.program": "Program",
      "application.teamDesc":
        "Select which team you'd like to join. Each team focuses on different aspects of autonomous vehicle development.",
      "application.resumeUpload": "Upload Resume (PDF or Word)",
      "application.submit": "Submit Application",
      "application.maxSize": "Maximum file size: 5MB",
      "application.chooseFile": "Choose File",
      "application.submitting": "Submitting...",

      // Success messages
      "success.title": "Application Submitted!",
      "success.message":
        "Thank you for applying to WE Autopilot. We'll review your application and contact you soon.",

      // Error messages
      "error.title": "Submission Failed",
      "error.message":
        "There was a problem submitting your application. Please try again or contact us directly.",
      "error.required": "This field is required",
      "error.email": "Please enter a valid email address",
      "error.schoolEmail": "Please enter a valid UWO email address",
      "error.studentId": "Please enter a valid student ID (8-10 digits)",
      "error.resumeRequired": "Please upload your resume",
    },
  },
  fr: {
    translation: {
      // Navigation
      "nav.home": "Accueil",
      "nav.about": "À Propos",
      "nav.sponsors": "Commanditaires",
      "nav.join": "Rejoindre",
      "nav.competition": "Compétition",
      "nav.contact": "Contact",

      // Join page
      "join.why": "Pourquoi Nous Rejoindre?",
      "join.teams": "Les Équipes",
      "join.ready": "Prêt à Postuler?",
      "join.apply": "Postuler Maintenant",
      "join.readyDescription":
        "Soumettez votre candidature via notre formulaire en ligne pour rejoindre l'une de nos équipes. Nous recherchons des étudiants motivés et passionnés par la technologie autonome.",

      // Team descriptions
      "team.red.title": "Équipe Rouge",
      "team.red.description":
        "L'équipe Rouge se concentre sur le matériel et les systèmes de véhicules. Les membres travaillent sur la conception mécanique, les systèmes électriques, l'intégration des capteurs et le développement physique des véhicules.",

      "team.black.title": "Équipe Noire",
      "team.black.description":
        "L'équipe Noire dirige le développement de l'architecture logicielle et des algorithmes. Les membres travaillent sur la planification de trajectoires, la prise de décision, les systèmes de contrôle et la simulation.",

      "team.cv.title": "Équipe CV",
      "team.cv.description":
        "L'équipe de Vision par Ordinateur (CV) développe des systèmes de perception pour la navigation autonome. Les membres travaillent sur la détection d'objets, l'identification des voies, la cartographie environnementale et la fusion de capteurs.",

      // Application form
      "application.title": "Rejoindre WE Autopilot",
      "application.personal": "Informations Personnelles",
      "application.teamSelection": "Sélection d'Équipe",
      "application.resume": "Téléchargement de CV",
      "application.name": "Nom Complet",
      "application.email": "Courriel Personnel",
      "application.schoolEmail": "Courriel Universitaire",
      "application.studentId": "Numéro Étudiant",
      "application.program": "Programme",
      "application.teamDesc":
        "Sélectionnez l'équipe que vous souhaitez rejoindre. Chaque équipe se concentre sur différents aspects du développement de véhicules autonomes.",
      "application.resumeUpload": "Télécharger CV (PDF ou Word)",
      "application.submit": "Soumettre la Candidature",
      "application.maxSize": "Taille maximale: 5Mo",
      "application.chooseFile": "Choisir un Fichier",
      "application.submitting": "Soumission en cours...",

      // Success messages
      "success.title": "Candidature Soumise!",
      "success.message":
        "Merci d'avoir postulé à WE Autopilot. Nous examinerons votre candidature et vous contacterons bientôt.",

      // Error messages
      "error.title": "Échec de Soumission",
      "error.message":
        "Un problème est survenu lors de la soumission de votre candidature. Veuillez réessayer ou nous contacter directement.",
      "error.required": "Ce champ est obligatoire",
      "error.email": "Veuillez entrer une adresse courriel valide",
      "error.schoolEmail": "Veuillez entrer une adresse courriel UWO valide",
      "error.studentId":
        "Veuillez entrer un numéro étudiant valide (8-10 chiffres)",
      "error.resumeRequired": "Veuillez télécharger votre CV",
    },
  },
};

// Language detection
const getUserLanguage = () => {
  // Try to get from localStorage first (user preference)
  const savedLanguage = localStorage.getItem("language");
  if (savedLanguage) return savedLanguage;

  // Use browser language as fallback
  const browserLang = navigator.language || navigator.userLanguage;
  const shortLang = browserLang.split("-")[0];

  // Check if we support this language
  return resources[shortLang] ? shortLang : "en";
};

// Initialize i18next
i18n.use(initReactI18next).init({
  resources,
  lng: getUserLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  detection: {
    order: ["localStorage", "navigator"],
    caches: ["localStorage"],
  },
});

// Function to change language
export const changeLanguage = (language) => {
  i18n.changeLanguage(language);
  localStorage.setItem("language", language);
};

export default i18n;
