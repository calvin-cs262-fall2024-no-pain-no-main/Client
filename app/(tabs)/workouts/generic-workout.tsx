// workouts/generic-workout.tsx
import React from 'react';
import ExerciseApp from './empty-workout';
import { Exercise } from './workout-config';

interface GenericWorkoutProps {
    exercises: Exercise[];
}

const GenericWorkout: React.FC<GenericWorkoutProps> = ({ exercises }) => {
    return <ExerciseApp initialExercises={exercises} />;
};

export default GenericWorkout;
