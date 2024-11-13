// workouts/legs-workout.tsx
import React from 'react';
import GenericWorkout from './generic-workout';
import { workoutConfigs } from './workout-config';

const LegsWorkout = () => <GenericWorkout exercises={workoutConfigs.legs} />;

export default LegsWorkout;
