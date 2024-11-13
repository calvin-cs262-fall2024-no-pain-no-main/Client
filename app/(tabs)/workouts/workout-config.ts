export interface Exercise {
  id: string;
  name: string;
  muscle: string;
  sets: Set[];
}

export interface Set {
  set: number;
  lbs: number;
  reps: number;
  completed: boolean;
  restTime: number;
  timer: number;
  timerActive: boolean;
}

// Helper function to create default sets
const defaultSets = () => [
  { set: 1, lbs: 0, reps: 0, completed: false, restTime: 120, timer: 120, timerActive: false },
  { set: 2, lbs: 0, reps: 0, completed: false, restTime: 120, timer: 120, timerActive: false },
  { set: 3, lbs: 0, reps: 0, completed: false, restTime: 120, timer: 120, timerActive: false },
];

// Workout configurations
export const workoutConfigs = {
  push: [
      { id: '1', name: 'Chest Press', muscle: 'Chest', sets: defaultSets() },
      { id: '4', name: 'Incline Bench Press', muscle: 'Chest', sets: defaultSets() },
      { id: '15', name: 'Overhead Press', muscle: 'Shoulders', sets: defaultSets() },
  ],
  pull: [
      { id: '10', name: 'Pull-Up', muscle: 'Back', sets: defaultSets() },
      { id: '11', name: 'Lat Pulldown', muscle: 'Back', sets: defaultSets() },
      { id: '13', name: 'Barbell Row', muscle: 'Back', sets: defaultSets() },
  ],
  legs: [
      { id: '2', name: 'Squats', muscle: 'Legs', sets: defaultSets() },
      { id: '6', name: 'Leg Press', muscle: 'Legs', sets: defaultSets() },
      { id: '7', name: 'Lunges', muscle: 'Legs', sets: defaultSets() },
  ],
};
