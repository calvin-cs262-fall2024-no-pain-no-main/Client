import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';



export default function profileLayout() {

    return (
        <Stack>
            <Stack.Screen name="profile" options={{ title: 'Profile' }} />
            <Stack.Screen name="userinfo" options={{ title: 'User' }} />
            <Stack.Screen name="terms" options={{ title: 'Terms and Condition' }} />
            <Stack.Screen name="privacy" options={{ title: 'Privacy and Security' }} />
            <Stack.Screen name="goals" options={{ title: 'Goals' }} />
            <Stack.Screen name="notifications" options={{ title: 'Notifications' }} />
        </Stack>

    );
}
