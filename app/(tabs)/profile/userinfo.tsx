import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import React from 'react';
import { globalStyles } from '@/assets/styles/globalStyles';
import { useRouter } from 'expo-router';
import PageWrapper from "../../../components/pageWrapper";
import { theme } from "../../../assets/styles/theme";
import { Ionicons } from '@expo/vector-icons'; // For icons

const UserInfo = () => {
    const router = useRouter();

    const handleLogout = () => {
        router.push('/'); // Adjust to your desired route
    };

    const handleTerminateAccount = () => {
        Alert.alert(
            "Terminate Account",
            "Are you sure you want to permanently delete your account? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    onPress: () => {
                        // Add logic to terminate the account here (e.g., API call)
                        Alert.alert("Account Deleted", "Your account has been permanently deleted.");
                        router.push('/'); // Redirect after deletion
                    }
                }
            ]
        );
    };

    return (
        <PageWrapper>
            <View style={styles.container}>
                <Text style={styles.title}>Login Information</Text>

                {/* Log Out Button */}
                <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color="white" />
                    <Text style={styles.actionText}>Log Out</Text>
                </TouchableOpacity>

                {/* Terminate Account Button */}
                <TouchableOpacity style={[styles.actionButton, styles.dangerButton]} onPress={handleTerminateAccount}>
                    <Ionicons name="close-circle-outline" size={24} color="white" />
                    <Text style={styles.actionText}>Terminate Account</Text>
                </TouchableOpacity>
            </View>
        </PageWrapper>
    );
};

export default UserInfo;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: theme.spacing.small,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.primaryText,
        marginBottom: 30,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.medium,
        borderRadius: theme.borderRadius.medium,
        width: '80%',
        marginBottom: theme.spacing.medium,
    },
    dangerButton: {
        backgroundColor: theme.colors.danger, // Styles for Terminate Account button (red)
    },
    actionText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: theme.spacing.small,
    },
});
