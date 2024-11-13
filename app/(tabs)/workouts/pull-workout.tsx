// workouts/pull-workout.tsx
import React from 'react';
import GenericWorkout from './generic-workout';
import { workoutConfigs } from './workout-config';

const PullWorkout = () => <GenericWorkout exercises={workoutConfigs.pull} />;

export default PullWorkout;
