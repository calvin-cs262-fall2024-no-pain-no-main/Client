import React from 'react';
import { Slot } from 'expo-router';

export default function TimerLayout() {
    return (
        <Slot screenOptions={{ headerShown: false }} ></Slot>
    );
}