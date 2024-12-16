import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // For icons
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { globalStyles } from "../assets/styles/globalStyles";
import { theme } from "@/assets/styles/theme";
import PageWrapper from "../components/pageWrapper";
import VigilLogo from '../assets/images/VigilFullLogo.png';

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();

	const handleLogin = async () => {
		try {
			const response = await fetch("https://no-pain-no-main.azurewebsites.net/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username, password }),
			});

			if (!response.ok) {
				const errorMessage = await response.json();
				throw new Error(errorMessage.error || "Login failed :(");
			}

			// Save the user ID to AsyncStorage
			const data = await response.json();
			const userId = data.user.id;
			await AsyncStorage.setItem("userId", userId.toString());
			console.log("User ID saved to AsyncStorage:", userId);

			// Check if this is the user's first login
			const hasLoggedInResponse = await fetch(`https://no-pain-no-main.azurewebsites.net/hasuserloggedin${userId}`);
			const hasLoggedIn = await hasLoggedInResponse.text();

			if (hasLoggedIn === "false") {
				console.log("First time login detected, updating status...");
				// Update has_logged_in to true
				await fetch(`https://no-pain-no-main.azurewebsites.net/loginfirsttime${userId}`, {
					method: "PUT",
				});

				// Add default workouts for the first-time user
				console.log("Adding default workouts...");
				const defaultWorkoutIds = [1, 2, 3, 4]; // Example default workout IDs
				for (const workoutId of defaultWorkoutIds) {
					try {
						// Fetch workout details (name, description)
						const templateResponse = await fetch(`https://no-pain-no-main.azurewebsites.net/templateworkout${workoutId}`);
						const templateData = await templateResponse.json();

						// Fetch default workout exercises
						const workoutResponse = await fetch(`https://no-pain-no-main.azurewebsites.net/workout${workoutId}/exerciseData`);
						const exercises = await workoutResponse.json();

						// Map exercises to match the saveWorkout endpoint format
						const formattedExercises = exercises.map((exercise) => ({
							exercise_id: exercise.exercise_id,
							performanceData: {
								sets: [
									{ set: 1, reps: 8, weight: 0, time: 60 },
									{ set: 2, reps: 8, weight: 0, time: 70 },
									{ set: 3, reps: 8, weight: 0, time: 80 },
								],
							},
						}));

						// Save workout for the user
						const saveResponse = await fetch("https://no-pain-no-main.azurewebsites.net/saveworkout", {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								name: templateData.name,
								description: templateData.description,
								isPublic: true,
								exercises: formattedExercises,
								userId,
							}),
						});

						if (!saveResponse.ok) {
							console.error(`Failed to save workout ${workoutId}:`, await saveResponse.json());
						} else {
							console.log(`Workout ${workoutId} saved successfully for user ${userId}`);
						}
					} catch (error) {
						console.error(`Error fetching or saving workout ${workoutId}:`, error);
					}
				}
				router.push("./wizard");
				return;
			} else {
				console.log("User has logged in before, skipping default workouts.");
				router.push(`/workouts`);
			}

			// Navigate to the workouts page
		} catch (error) {
			console.error("Error logging in:", error);
			Alert.alert("Login Failed :(", error.message);
		}
	};

	const handleSignUp = () => {
		router.push("./signup"); // Adjust to your desired route
	};

	return (
		<PageWrapper>
			<View style={styles.container}>
				<Image source={VigilLogo} style={styles.titleImage} resizeMode="contain" />

				{/* Username Input */}
				<View style={styles.inputContainer}>
					<Ionicons name="person" size={24} color="white" style={styles.icon} />
					<TextInput
						style={styles.input}
						placeholder="Username"
						placeholderTextColor="#888"
						value={username}
						onChangeText={setUsername}
						keyboardType="email-address"
						autoCapitalize="none"
					/>
				</View>

				{/* Password Input */}
				<View style={styles.inputContainer}>
					<Ionicons name="lock-closed" size={24} color="white" style={styles.icon} />
					<TextInput style={styles.input} placeholder="Password" placeholderTextColor="#888" value={password} onChangeText={setPassword} secureTextEntry />
				</View>

				<TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
					<Text style={styles.signInText}>Log in</Text>
				</TouchableOpacity>

				{/* Sign-up Link */}
				<View style={styles.signUpContainer}>
					<Text style={styles.signUpText}>Don't have an account? </Text>
					<TouchableOpacity onPress={handleSignUp}>
						<Text style={styles.signUpLink}>Sign up</Text>
					</TouchableOpacity>
				</View>
			</View>
		</PageWrapper>
	);
};

const styles = StyleSheet.create({
	container: {
		...globalStyles.container,
	},
	titleImage: {
		...globalStyles.headerImage,
		width: "95%",
		height: "20%",
		marginBottom: theme.spacing.xxLarge,
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		borderBottomWidth: 1,
		marginBottom: theme.spacing.small,
		marginHorizontal: theme.spacing.large,
	},
	icon: {
		marginRight: theme.spacing.small,
	},
	input: {
		...globalStyles.input,
		flex: 1,
		paddingHorizontal: theme.spacing.small,
		color: theme.colors.textPrimary,
	},
	signInButton: {
		...globalStyles.button,
		backgroundColor: theme.colors.buttonBackground,
		borderColor: theme.colors.border,
		borderWidth: 1.5,
		shadowColor: "black",
	},
	signInText: {
		...globalStyles.buttonText,
		color: theme.colors.textSecondary,
	},
	signUpContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	signUpText: {
		color: theme.colors.textPrimary,
		fontSize: theme.fonts.regular,
	},
	signUpLink: {
		color: theme.colors.primary,
		fontSize: theme.fonts.regular,
		textDecorationLine: "underline",
	},
});

export default Login;
