import { StyleSheet, Text, View, Button, Alert } from 'react-native'
import React from 'react'
import { globalStyles } from '@/assets/styles/globalStyles';

import { useRouter } from 'expo-router';

const UserInfo = () => {
    const router = useRouter();

    const handlelogout = () => {
        router.push('/'); // Adjust to your desired route
    };


    // Handle Terminate Account action
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
                        // Redirect to login screen or home screen after account deletion
                        navigation.navigate('Login');  // Modify navigation as needed
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login Information</Text>

            {/* Log Out Button */}
            <Button title="Log Out" onPress={handlelogout} color="red" />

            {/* Terminate Account Button */}
            <Button title="Terminate Account" onPress={handleTerminateAccount} color="red" />

        </View>
    )
}

export default UserInfo;

const styles = StyleSheet.create({
    container: {
        ...globalStyles.container,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
    },
});
