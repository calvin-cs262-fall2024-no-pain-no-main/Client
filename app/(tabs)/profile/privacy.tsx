import { StyleSheet, Text, View, ScrollView, SafeAreaView } from 'react-native';
import React from 'react';

const Privacy = () => {
    return (
        <SafeAreaView style={styles.safeContainer}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Privacy Policy</Text>
                <Text style={styles.paragraph}>
                    At VIGIL, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal data.
                </Text>
                <Text style={styles.subtitle}>1. Information We Collect</Text>
                <Text style={styles.paragraph}>
                    We collect personal information including your name, height, weight, and other fitness-related data to provide personalized recommendations and enhance your experience.
                </Text>

                <Text style={styles.subtitle}>2. Use of Information</Text>
                <Text style={styles.paragraph}>
                    Your data is used solely for the purpose of improving your fitness journey within the app. We do not sell or share your data with third parties for commercial purposes.
                </Text>

                <Text style={styles.subtitle}>3. Data Security</Text>
                <Text style={styles.paragraph}>
                    We implement reasonable security measures to protect your data, including encryption and secure storage methods.
                </Text>

                <Text style={styles.subtitle}>4. Your Rights</Text>
                <Text style={styles.paragraph}>
                    You have the right to access, update, or delete your personal information at any time by contacting us through the app's settings or support channels.
                </Text>

                <Text style={styles.subtitle}>5. Changes to This Policy</Text>
                <Text style={styles.paragraph}>
                    We may update this privacy policy from time to time. You will be notified of any significant changes via the app.
                </Text>

                <Text style={styles.subtitle}>Contact Us</Text>
                <Text style={styles.paragraph}>
                    If you have any questions or concerns about your privacy, please contact us at [email/contact info].
                </Text>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1, // Ensure SafeAreaView takes up the full screen
    },
    container: {
        padding: 20,
        flexGrow: 1, // Ensure ScrollView content stretches fully
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 15,
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 24,
    },
});

export default Privacy;
