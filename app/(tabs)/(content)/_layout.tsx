import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';





export default function contentLayout() {

    return (

        <Stack>
            <Stack.Screen name="activities" options={{ title: 'Activities' }} />
            <Stack.Screen name="game" options={{ title: 'Games' }} />
            <Stack.Screen name="quiz" options={{ title: 'Quiz' }} />
        </Stack>

    );
}
