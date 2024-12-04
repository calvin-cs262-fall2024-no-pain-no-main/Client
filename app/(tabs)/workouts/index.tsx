import React, { useState, useEffect } from "react";
import { Text, StyleSheet, TouchableOpacity, ScrollView, View, SafeAreaView, Image } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { globalStyles } from "../../../assets/styles/globalStyles";
import { theme } from "../../../assets/styles/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PageWrapper from "../../../components/pageWrapper";
// Fixed
const headerImage = require("../../../assets/images/VigilWeight.png");

const Workouts = () => {
	const router = useRouter();
	const [workouts, setWorkouts] = useState([]);
	const [savedWorkouts, setSavedWorkouts] = useState([]);

	// Fetch default workout templates
	useEffect(() => {
		const fetchWorkouts = async () => {
			try {
				const workoutIds = [1, 2, 3, 4];
				const workoutPromises = workoutIds.map((id) => axios.get(`https://no-pain-no-main.azurewebsites.net/workout${id}`));

				const workoutResponses = await Promise.all(workoutPromises);
				const workoutData = workoutResponses.map((res) => res.data);
				setWorkouts(workoutData);
			} catch (error) {
				console.error("Error fetching default workouts:", error);
			}
		};

		fetchWorkouts();
	}, []);

	// Fetch saved workouts
	useEffect(() => {
		const fetchSavedWorkouts = async () => {
			const savedWorkoutData = [];
			let workoutId = 10;

			while (true) {
				try {
					const response = await axios.get(`https://no-pain-no-main.azurewebsites.net/workout${workoutId}`);
					savedWorkoutData.push(response.data);
					workoutId++; // Increment ID to fetch the next workout
				} catch (error) {
					if (error.response?.status === 403 || error.response?.status === 404) {
						// Stop fetching when access is denied or the resource is not found
						break;
					} else {
						console.error("Error fetching saved workouts:", error);
					}
				}
			}

			setSavedWorkouts(savedWorkoutData);
		};

		fetchSavedWorkouts();
	}, []);

	async function startPredefinedWorkout(workoutId: number) {
		try {
			// Fetch workout data
			const response = await axios.get(`https://no-pain-no-main.azurewebsites.net/workout${workoutId}/exerciseData`);

			// Log the response to ensure correct data is fetched
			console.log("Fetched workout exercises:", response.data);

			// Map exercises to the expected structure
			const exercises = response.data.map((exercise: any) => ({
				id: exercise.exerciseid,
				name: exercise.name,
				description: exercise.description,
				musclegroup: exercise.musclegroup,
				sets: Array.from({ length: exercise.sets }).map((_, index) => ({
					set: index + 1,
					lbs: 0,
					reps: exercise.reps,
					completed: false,
					restTime: exercise.resttime,
				})),
			}));

			// Log the mapped exercises for verification
			console.log("Mapped exercises:", exercises);

			// Store exercises in AsyncStorage
			await AsyncStorage.setItem("exercises", JSON.stringify(exercises));

			// Navigate to the empty-workout page
			router.push({
				pathname: "../workouts/empty-workout",
			});
		} catch (error) {
			console.error("Error fetching predefined workout exercises:", error);
			alert("Failed to load exercises. Please try again.");
		}
	}

	async function startEmptyWorkout() {
		await AsyncStorage.removeItem("exercises");
		router.push("../workouts/empty-workout");
	}

	return (
		<PageWrapper>
			<SafeAreaView style={styles.safeArea}>
				<ScrollView
					style={styles.scrollView}
					contentContainerStyle={styles.contentContainer}
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}>
					<Image source={headerImage} style={styles.headerImage} />

					<Text style={styles.sectionTitle} numberOfLines={1} ellipsizeMode="tail">
						Workout Templates
					</Text>
					<View style={styles.gridContainer}>
						{workouts.map((workout) => (
							<TouchableOpacity key={workout.id} style={styles.card} onPress={() => startPredefinedWorkout(workout.id)}>
								<Text style={styles.cardTitle}>{workout.name}</Text>
								<Text style={styles.cardDescription}>{workout.description}</Text>
							</TouchableOpacity>
						))}
					</View>

					<Text style={styles.sectionTitle} numberOfLines={1} ellipsizeMode="tail">
						Saved Workouts
					</Text>
					<View style={styles.gridContainer}>
						{savedWorkouts.map((workout) => (
							<TouchableOpacity key={workout.id} style={styles.card} onPress={() => startPredefinedWorkout(workout.id)}>
								<Text style={styles.cardTitle}>{workout.name}</Text>
								<Text style={styles.cardDescription}>{workout.description}</Text>
							</TouchableOpacity>
						))}
					</View>

					<TouchableOpacity style={[styles.button, styles.emptyButton]} onPress={startEmptyWorkout}>
						<Text style={styles.emptyButtonText}>Create Empty Workout</Text>
					</TouchableOpacity>
				</ScrollView>
			</SafeAreaView>
		</PageWrapper>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		...globalStyles.safeAreaContainer,
		padding: theme.spacing.medium,
	},
	scrollView: {
		flex: 1,
	},
	contentContainer: {
		paddingBottom: theme.spacing.large,
		justifyContent: "flex-start",
		alignItems: "center",
	},
	headerImage: {
		...globalStyles.headerImage,
		marginBottom: theme.spacing.large,
		marginTop: theme.spacing.medium,
	},
	sectionTitle: {
		fontSize: theme.fonts.title,
		fontWeight: "bold",
		color: theme.colors.textPrimary,
		marginBottom: theme.spacing.medium,
		textAlign: "center",
		width: "100%",
	},
	gridContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		width: "100%",
		marginBottom: theme.spacing.large,
	},
	card: {
		width: "48%",
		backgroundColor: theme.colors.cardBackground,
		padding: theme.spacing.medium,
		marginBottom: theme.spacing.medium,
		borderRadius: theme.borderRadius.medium,
		alignItems: "flex-start",
		justifyContent: "center",
		position: "relative",
	},
	cardTitle: {
		color: theme.colors.textSecondary,
		fontSize: theme.fonts.large,
		fontWeight: "bold",
		textAlign: "left",
		marginBottom: theme.spacing.small,
	},
	cardDescription: {
		color: theme.colors.textPrimary,
		fontSize: theme.fonts.regular - 4,
		textAlign: "left",
	},
	button: {
		...globalStyles.button,
	},
	emptyButton: {
		backgroundColor: theme.colors.primary,
	},
	emptyButtonText: {
		fontSize: theme.fonts.regular,
		color: theme.colors.textPrimary,
		fontWeight: "bold",
	},
});

export default Workouts;
