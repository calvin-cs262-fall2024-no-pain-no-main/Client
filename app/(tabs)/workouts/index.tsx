import React from "react";
import { Text, StyleSheet, TouchableOpacity, ScrollView, View, SafeAreaView, Image } from "react-native";
import { RouteParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { globalStyles } from "../../../assets/styles/globalStyles";
import { theme } from "../../../assets/styles/theme";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';


const headerImage = require("../../../assets/images/VigilWeight.png");

const Workouts = () => {
	async function startPredefinedWorkout(workoutId: number) {
		try {
			const response = await axios.get(`https://no-pain-no-main.azurewebsites.net/workout${workoutId}/exerciseData`);

			const exercises = response.data.map((exercise: any) => ({
				id: exercise.exerciseid,  // Ensure you're using the correct field
				name: exercise.name,
				description: exercise.description,
				musclegroup: exercise.musclegroup,

				// Ensure that sets are generated correctly and properly handled
				sets: Array.from({ length: exercise.sets }).map((_, index) => ({
					set: index + 1,
					lbs: 0,
					reps: exercise.reps,
					completed: false,
					restTime: exercise.resttime,  // Make sure the `resttime` is a number (no need for .toString())
				})),
			}));

			// Log the exercises to verify the result
			console.log(JSON.stringify(exercises, null, 2)); // This will give you a more readable output

			// Navigate to the empty-workout page with the predefined exercises
			await AsyncStorage.setItem('exercises', JSON.stringify(exercises));
			router.push({
				pathname: "../workouts/empty-workout",
				// params: { initialExercises: exercises },
			});

		} catch (error) {
			console.error("Error fetching predefined workout exercises:", error);
			alert("Failed to load exercises. Please try again.");
		}
	}



	const router = useRouter();

	const [workouts, setWorkouts] = React.useState([
		{ id: 1, name: "Nov 14 leg" },
		{ id: 2, name: "demon back day" },
	]);

	async function startEmptyWorkout() {
		await AsyncStorage.removeItem('exercises');
		router.push("../workouts/empty-workout");
	}

	async function deleteWorkout(workoutId) {
		const updatedWorkouts = workouts.filter((workout) => workout.id !== workoutId);
		setWorkouts(updatedWorkouts);
		console.log(`Deleted workout: ${workoutId}`);
	}

	return (
		<SafeAreaView style={styles.safeArea}>
			<ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
				<Image source={headerImage} style={styles.headerImage} />

				<Text style={styles.sectionTitle} numberOfLines={1} ellipsizeMode="tail">
					Recent Workouts
				</Text>
				<View style={styles.gridContainer}>
					{workouts.map((workout) => (
						<TouchableOpacity key={workout.id} style={styles.card}>
							<Text style={styles.cardText}>{workout.name}</Text>
							<TouchableOpacity style={styles.trashButton} onPress={() => deleteWorkout(workout.id)}>
								<MaterialIcons name="delete" size={24} color="#fff" />
							</TouchableOpacity>
						</TouchableOpacity>
					))}
				</View>

				<Text style={styles.sectionTitle} numberOfLines={1} ellipsizeMode="tail">
					Workout Templates
				</Text>
				<View style={styles.gridContainer}>
					<TouchableOpacity style={styles.card} onPress={() => startPredefinedWorkout(2)}>
						<Text style={styles.cardTitle}>Push</Text>
						<Text style={styles.cardDescription}>A workout focused on pushing movements, targeting chest, shoulders, and triceps.</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.card} onPress={() => startPredefinedWorkout(1)}>
						<Text style={styles.cardTitle}>Pull</Text>
						<Text style={styles.cardDescription}>A workout that emphasizes pulling movements, focusing on back and biceps.</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.card} onPress={() => startPredefinedWorkout(3)}>
						<Text style={styles.cardTitle}>Legs</Text>
						<Text style={styles.cardDescription}>Leg-focused exercises targeting quads, hamstrings, and calves.</Text>
					</TouchableOpacity>
				</View>

				<TouchableOpacity style={[styles.button, styles.emptyButton]} onPress={startEmptyWorkout}>
					<Text style={styles.emptyButtonText}>Create Empty Workout</Text>
				</TouchableOpacity>
			</ScrollView>
		</SafeAreaView>
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
		textAlign: "left",
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
	cardText: {
		color: theme.colors.textPrimary,
		fontSize: theme.fonts.regular,
		textAlign: "left",
	},
	cardTitle: {
		color: theme.colors.textPrimary,
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
	trashButton: {
		position: "absolute",
		top: theme.spacing.small,
		right: theme.spacing.small,
		backgroundColor: theme.colors.background,
		borderRadius: theme.borderRadius.small,
		padding: theme.spacing.small / 2,
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
