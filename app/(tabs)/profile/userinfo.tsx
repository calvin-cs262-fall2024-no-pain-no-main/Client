import { StyleSheet, Text, View, Button, Alert } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

const UserInfo = () => {

    const navigation = useNavigation();

    // Handle Log Out action
    const handleLogOut = () => {
        // Add logic for logging out the user, for example:
        // Clerk.logout(); or some other method from your authentication provider
        Alert.alert("Logged Out", "You have been logged out.");
        // Redirect to login screen (if needed)
        navigation.navigate('Login');  // You can modify this based on your navigation structure
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
            <Button title="Log Out" onPress={handleLogOut} color="red" />

            {/* Terminate Account Button */}
            <Button title="Terminate Account" onPress={handleTerminateAccount} color="red" />

        </View>
    )
}

export default UserInfo;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#0D1B2A',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
    },
});
