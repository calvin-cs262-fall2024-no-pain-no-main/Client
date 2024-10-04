import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Stack } from 'expo-router';

export default function AboutAppScreen() {
    return (

        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={<Ionicons size={310} name="time-outline" style={styles.headerImage} />}
        >
            {/* App Info Section */}
            <ThemedView style={styles.infoContainer}>
                <ThemedText style={styles.title}>Timer / SNS Detox App</ThemedText>
                <Text style={styles.description}>
                    This app is designed to help you rest better during workouts by enforcing breaks and encouraging you to disconnect from social media.
                </Text>
                <Text style={styles.description}>
                    Set workout timers and break periods that allow your body to recover efficiently, while staying off distracting social media platforms.
                </Text>
                <Text style={styles.description}>
                    Whether you're doing high-intensity interval training or just regular workout routines, it's important to take breaks. Use this app to stay mindful of your rest periods and stay productive.
                </Text>
            </ThemedView>

            {/* Features Section */}
            <ThemedView style={styles.featuresContainer}>
                <ThemedText style={styles.sectionTitle}>Key Features</ThemedText>

                <View style={styles.featureItem}>
                    <Ionicons name="timer-outline" size={24} color="gray" />
                    <Text style={styles.featureText}>Workout Timer</Text>
                </View>

                <View style={styles.featureItem}>
                    <Ionicons name="notifications-off-outline" size={24} color="gray" />
                    <Text style={styles.featureText}>SNS Detox Mode</Text>
                </View>

                <View style={styles.featureItem}>
                    <Ionicons name="pulse-outline" size={24} color="gray" />
                    <Text style={styles.featureText}>Improved Rest & Recovery</Text>
                </View>
            </ThemedView>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    infoContainer: {
        padding: 20,
        backgroundColor: '#fff',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 15,
    },
    featuresContainer: {
        padding: 20,
        backgroundColor: '#fff',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    featureText: {
        fontSize: 18,
        marginLeft: 10,
    },
    buttonContainer: {
        padding: 20,
        alignItems: 'center',
    },
    getStartedButton: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    getStartedText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
});
