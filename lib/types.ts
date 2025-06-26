export interface UserHabit {
  id: number;
  title: string;
  description: string;
  streak: number;
  totalLogs: number;
  lastLogTime: string | null;
  canLogToday: boolean;
  pictureUri?: string;
}

export interface UserLog {
  id: number;
  habitId: number;
  habitTitle: string;
  message: string;
  date: string;
  imageUri?: string;
}

interface HabitLog {
  id: number;
  date: string;
  log_info: string;
}

export const mockHabits: UserHabit[] = [
  {
    id: 1,
    title: "Morning Workout",
    description: "30 minutes of exercise to start the day",
    streak: 15,
    totalLogs: 23,
    lastLogTime: "2024-01-15",
    canLogToday: true,
  },
  {
    id: 2,
    title: "Daily Reading",
    description: "Read for at least 20 minutes",
    streak: 8,
    totalLogs: 12,
    lastLogTime: "2024-01-14",
    canLogToday: true,
  },
  {
    id: 3,
    title: "Meditation",
    description: "10 minutes of mindfulness",
    streak: 42,
    totalLogs: 67,
    lastLogTime: "2024-01-15",
    canLogToday: false,
  },
];

// Mock recent logs
export const mockLogs: UserLog[] = [
  {
    id: 1,
    habitId: 1,
    habitTitle: "Morning Workout",
    message: "Great HIIT session today! Feeling energized 💪",
    date: "2024-01-15",
    imageUri: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 2,
    habitId: 3,
    habitTitle: "Meditation",
    message: "10 minutes of mindfulness to start the day 🧘‍♀️",
    date: "2024-01-15",
  },
  {
    id: 3,
    habitId: 2,
    habitTitle: "Daily Reading",
    message: "Finished another chapter of 'Atomic Habits'",
    date: "2024-01-14",
  },
];
