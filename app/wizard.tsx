import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { globalStyles } from "../assets/styles/globalStyles";
import { theme } from "../assets/styles/theme";
import PageWrapper from "../components/pageWrapper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Wizard = () => {
    const [userHeight, setUserHeight] = useState("");
    const [userWeight, setUserWeight] = useState("");
    const [experienceLevel, setExperienceLevel] = useState("beginner");
    const router = useRouter();

    const handleSaveMetrics = async () => {
        try {
            const userId = await AsyncStorage.getItem("userId");
            if (!userId) {
                throw new Error("User ID not found");
            }

            const payload = {
                id: parseInt(userId, 10),
                height: userHeight ? parseInt(userHeight, 10) : undefined,
                weight: userWeight ? parseInt(userWeight, 10) : undefined,
                experience_type: experienceLevel,
            };

            const response = await fetch("https://no-pain-no-main.azurewebsites.net/setmetrics", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to save metrics");
            }

            console.log("Metrics saved successfully!");
            Alert.alert("Success", "Your metrics have been saved!");
            router.push("/workouts");
        } catch (error) {
            console.error("Error saving metrics:", error);
            Alert.alert("Error", error.message || "Failed to save metrics. Please try again.");
        }
    };

    return (
        <PageWrapper>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <Text style={styles.title}>Set Your Metrics</Text>

                    {/* Height Input */}
                    <TextInput
                        style={styles.input}
                        placeholder="Height (in cm)"
                        placeholderTextColor="#888"
                        value={userHeight}
                        onChangeText={setUserHeight}
                        keyboardType="numeric"
                        returnKeyType="done"
                    />

                    {/* Weight Input */}
                    <TextInput
                        style={styles.input}
                        placeholder="Weight (in lbs)"
                        placeholderTextColor="#888"
                        value={userWeight}
                        onChangeText={setUserWeight}
                        keyboardType="numeric"
                        returnKeyType="done"
                    />

                    {/* Experience Level Picker */}
                    <View style={styles.pickerContainer}>
                        <Text style={styles.label}>Experience Level:</Text>
                        <Picker
                            selectedValue={experienceLevel}
                            onValueChange={(itemValue) => setExperienceLevel(itemValue)}
                            style={styles.picker}
                            dropdownIconColor={theme.colors.textPrimary}
                            itemStyle={{ color: theme.colors.textPrimary }}
                        >
                            <Picker.Item label="Beginner" value="beginner" />
                            <Picker.Item label="Intermediate" value="intermediate" />
                            <Picker.Item label="Experienced" value="experienced" />
                        </Picker>
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity style={styles.button} onPress={handleSaveMetrics}>
                        <Text style={styles.buttonText}>Save and Continue</Text>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </PageWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        ...globalStyles.container,
    },
    title: {
        fontSize: theme.fonts.title,
        color: theme.colors.textPrimary,
        fontWeight: "bold",
        marginBottom: theme.spacing.large,
        textAlign: "center",
    },
    input: {
        ...globalStyles.input,
        width: "80%",
        marginBottom: theme.spacing.medium,
    },
    pickerContainer: {
        width: "80%",
        marginBottom: theme.spacing.large,
    },
    label: {
        color: theme.colors.textPrimary,
        fontSize: theme.fonts.large,
        marginBottom: theme.spacing.small,
    },
    picker: {
        backgroundColor: theme.colors.inputBackground,
        color: theme.colors.textPrimary,
        borderRadius: theme.borderRadius.medium,
    },
    button: {
        ...globalStyles.button,
    },
    buttonText: {
        ...globalStyles.buttonText,
        color: theme.colors.textPrimary,

    },
});

export default Wizard;
