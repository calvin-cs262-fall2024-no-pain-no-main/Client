// workouts/push-workout.tsx
import React from 'react';
import GenericWorkout from './generic-workout';
import { workoutConfigs } from './workout-config';

const PushWorkout = () => <GenericWorkout exercises={workoutConfigs.push} />;

export default PushWorkout;
