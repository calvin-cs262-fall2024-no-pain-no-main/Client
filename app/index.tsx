import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // For icons
import { globalStyles } from "../assets/styles/globalStyles";
import { theme } from "@/assets/styles/theme";
import PageWrapper from "../components/pageWrapper";
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
				throw new Error(errorMessage.message || "Login failed :(");
			}

			const data = await response.json();
			console.log("Login successful:", data);

			router.push(`/workouts`); // Adjust to your desired route
		} catch (error) {
			console.error("Error logging in:", error);
			Alert.alert("Login Failed :(", error.message);
		}
	};

	const handleSignUp = () => {
		router.push("./signup"); // Adjust to your desired route
	};

	const handleAdmin = () => {
		router.push("/(tabs)/workouts"); // Adjust to your desired route for admin
	};

	return (
		<PageWrapper>
			<View style={styles.container}>
				<Image source={require("../assets/images/VigilFullLogo.png")} style={styles.titleImage} resizeMode="contain" />

				<TouchableOpacity style={styles.adminButton} onPress={handleAdmin}>
					<Text style={styles.adminText}>Admin</Text>
				</TouchableOpacity>

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

export default Login;
