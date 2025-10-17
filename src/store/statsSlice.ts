import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Stats, Session } from '../types';

interface StatsState {
  stats: Stats;
  sessions: Session[];
}

const initialState: StatsState = {
  stats: {
    sessionsToday: 0,
    totalMinutes: 0,
    currentStreak: 0,
    averagePerDay: 0,
    lastSessionDate: null,
  },
  sessions: [],
};

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    addSession: (state, action: PayloadAction<Session>) => {
      state.sessions.push(action.payload);
      
      const today = new Date().toDateString();
      const sessionDate = new Date(action.payload.date).toDateString();
      
      // Zwiększ sesje dzisiaj
      if (today === sessionDate) {
        state.stats.sessionsToday += 1;
      }
      
      // Dodaj minuty
      state.stats.totalMinutes += action.payload.duration;
      
      // Aktualizuj streak
      state.stats = calculateStreak(state.sessions);
      
      // Zaktualizuj ostatnią sesję
      state.stats.lastSessionDate = action.payload.date;
      
      // Oblicz średnią
      state.stats.averagePerDay = calculateAverage(state.sessions);
    },
    
    resetDailyStats: (state) => {
      state.stats.sessionsToday = 0;
    },
    
    loadStats: (state, action: PayloadAction<StatsState>) => {
      return action.payload;
    },
  },
});

// Helper: Oblicz streak (dni z rzędu)
function calculateStreak(sessions: Session[]): Stats {
  if (sessions.length === 0) {
    return {
      sessionsToday: 0,
      totalMinutes: 0,
      currentStreak: 0,
      averagePerDay: 0,
      lastSessionDate: null,
    };
  }

  // Sortuj sesje od najnowszych
  const sorted = [...sessions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  // Grupuj sesje po dniach
  const sessionsByDay = new Map<string, boolean>();
  sorted.forEach(session => {
    const day = new Date(session.date).toDateString();
    sessionsByDay.set(day, true);
  });

  // Sprawdź czy dzisiaj była sesja
  const today = currentDate.toDateString();
  if (!sessionsByDay.has(today)) {
    // Jeśli dzisiaj nie było sesji, sprawdź wczoraj
    currentDate.setDate(currentDate.getDate() - 1);
  }

  // Licz streak wstecz
  while (sessionsByDay.has(currentDate.toDateString())) {
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
  const today2 = new Date().toDateString();
  const sessionsToday = sessions.filter(s => 
    new Date(s.date).toDateString() === today2
  ).length;

  return {
    sessionsToday,
    totalMinutes,
    currentStreak: streak,
    averagePerDay: calculateAverage(sessions),
    lastSessionDate: sorted[0]?.date || null,
  };
}

// Helper: Oblicz średnią minut na dzień
function calculateAverage(sessions: Session[]): number {
  if (sessions.length === 0) return 0;

  const uniqueDays = new Set(
    sessions.map(s => new Date(s.date).toDateString())
  );
  
  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
  return Math.round(totalMinutes / uniqueDays.size);
}

export const { addSession, resetDailyStats, loadStats } = statsSlice.actions;
export default statsSlice.reducer;