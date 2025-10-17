export interface Exercise {
  id: string;
  name: string;
  description: string;
  duration: string;
  color: string;
  icon: string;
  inhale: number;      // sekundy
  hold?: number;       // opcjonalne zatrzymanie
  exhale: number;      // sekundy
  cycles: number;      // liczba powtórzeń
}

export interface Session {
  id: string;
  exerciseId: string;
  date: string;        // ISO string
  duration: number;    // minuty
  cycles: number;      // ukończone cykle
}

export interface Stats {
  sessionsToday: number;
  totalMinutes: number;
  currentStreak: number;
  averagePerDay: number;
  lastSessionDate: string | null;
}

export type RootStackParamList = {
  Home: undefined;
  Exercise: { exercise: Exercise };
  Settings: undefined;
};