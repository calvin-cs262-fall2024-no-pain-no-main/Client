import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // For icons
import { globalStyles } from "../assets/styles/globalStyles";
import { theme } from "@/assets/styles/theme";
import PageWrapper from "../components/pageWrapper";
import VigilFullLogo from "../assets/images/VigilFullLogo.png";

const SignUp = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const router = useRouter();

	const handleSignUp = async () => {
		if (!username || !password || !confirmPassword) {
			Alert.alert("Error", "Please fill in all fields.");
			return;
		}

		if (password !== confirmPassword) {
			Alert.alert("Error", "Passwords do not match.");
			return;
		}

		try {
			const response = await fetch("https://no-pain-no-main.azurewebsites.net/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username,
					password,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				Alert.alert("Success", "Account created successfully!");
				router.push("/"); // Navigate back to login or another screen after successful signup
			} else {
				Alert.alert("Error", data.message || "An error occurred during sign-up.");
			}
		} catch (error) {
			console.error("Sign-up error:", error);
			Alert.alert("Error", "An error occurred while creating your account.");
		}
	};

	const handleBackToLogin = () => {
		router.push("/"); // Navigate back to the login page
	};

	return (
			<View style={styles.container}>
				<Image source={VigilFullLogo} style={styles.titleImage} resizeMode="contain" />


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

				{/* Confirm Password Input */}
				<View style={styles.inputContainer}>
					<Ionicons name="lock-closed" size={24} color="white" style={styles.icon} />
					<TextInput
						style={styles.input}
						placeholder="Confirm Password"
						placeholderTextColor="#888"
						value={confirmPassword}
						onChangeText={setConfirmPassword}
						secureTextEntry
					/>
				</View>

				<TouchableOpacity style={styles.signInButton} onPress={handleSignUp}>
					<Text style={styles.signInText}>Sign Up</Text>
				</TouchableOpacity>

				{/* Back to Login Link */}
				<View style={styles.signUpContainer}>
					<Text style={styles.signUpText}>Already have an account? </Text>
					<TouchableOpacity onPress={handleBackToLogin}>
						<Text style={styles.signUpLink}>Log in</Text>
					</TouchableOpacity>
				</View>
			</View>
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
	adminButton: {
		position: "absolute",
		bottom: theme.spacing.medium,
		left: theme.spacing.medium,
		backgroundColor: theme.colors.modalBackground,
		padding: theme.spacing.small,
		borderRadius: theme.borderRadius.small,
	},
	adminText: {
		color: theme.colors.textSecondary,
		fontSize: theme.fonts.regular,
	},
});

export default SignUp;
