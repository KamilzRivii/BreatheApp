import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

const locales = getLocales();
const deviceLanguage = locales[0]?.languageCode ?? 'en';

// Tłumaczenia
const resources = {
  pl: {
    translation: {
      // Header
      appName: 'Oddychaj',
      
      // Stats
      today: 'Dzisiaj',
      total: 'Razem',
      streak: 'Seria',
      average: 'Średnio',
      sessions: 'sesji',
      minutes: 'minut',
      daysInRow: 'dni z rzędu',
      minPerDay: 'min/dzień',
      
      // Exercises
      exercises: 'Ćwicz z nami każdego dnia!',
      
      // Exercise names
      exercise_478_name: '4-7-8',
      exercise_478_desc: 'Uspokojenie i sen',
      exercise_box_name: 'Równe odstępy',
      exercise_box_desc: 'Koncentracja i focus',
      exercise_deep_name: 'Głębokie Oddechy',
      exercise_deep_desc: 'Relaks i odprężenie',
      exercise_energy_name: 'Energia',
      exercise_energy_desc: 'Pobudzenie organizmu',
      
      // Exercise Screen
      back: 'Wróć',
      cycle: 'Cykl',
      inhale: 'Wdech',
      hold: 'Zatrzymaj',
      exhale: 'Wydech',
      rest: 'Odpoczynek',
      start: 'Rozpocznij',
      stop: 'Zatrzymaj',
      totalTime: 'Całkowity czas',
    },
  },
  en: {
    translation: {
      // Header
      appName: 'Breathe',
      
      // Stats
      today: 'Today',
      total: 'Total',
      streak: 'Streak',
      average: 'Average',
      sessions: 'sessions',
      minutes: 'minutes',
      daysInRow: 'days in row',
      minPerDay: 'min/day',
      
      // Exercises
      exercises: 'Exercise with us every day!',
      
      // Exercise names
      exercise_478_name: '4-7-8',
      exercise_478_desc: 'Calm and sleep',
      exercise_box_name: 'Box Breathing',
      exercise_box_desc: 'Focus and concentration',
      exercise_deep_name: 'Deep Breaths',
      exercise_deep_desc: 'Relax and unwind',
      exercise_energy_name: 'Energy',
      exercise_energy_desc: 'Boost your energy',
      
      // Exercise Screen
      back: 'Back',
      cycle: 'Cycle',
      inhale: 'Inhale',
      hold: 'Hold',
      exhale: 'Exhale',
      rest: 'Rest',
      start: 'Start',
      stop: 'Stop',
      totalTime: 'Total time',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: deviceLanguage === 'pl' ? 'pl' : 'en',
    fallbackLng: 'pl',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;