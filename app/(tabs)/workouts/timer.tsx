import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { globalStyles } from "../../../assets/styles/globalStyles";
import { theme } from "../../../assets/styles/theme";

const TimerPage: React.FC = () => {
	const router = useRouter();
	const [timer, setTimer] = useState(90); // 90 seconds countdown
	const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
	const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
	const [correctAnswerShown, setCorrectAnswerShown] = useState(false);

	// Hard-coded question and answers
	const question = "What is the largest muscle in the human body?";
	const options = ["Gluteus Maximus", "Biceps", "Quadriceps", "Pectorals"];
	const correctAnswer = "Gluteus Maximus";

	// Timer countdown logic with smooth ticking
	useEffect(() => {
		let startTime: number;
		let animationFrameId: number;

		const updateTimer = (timestamp: number) => {
			if (!startTime) startTime = timestamp;
			const elapsedTime = (timestamp - startTime) / 1000;
			const remainingTime = Math.max(90 - elapsedTime, 0);
			setTimer(remainingTime);

			if (remainingTime > 0) {
				animationFrameId = requestAnimationFrame(updateTimer);
			} else {
				Alert.alert("Time's up!", "You ran out of time.");
				router.back();
			}
		};

		// Start the timer
		animationFrameId = requestAnimationFrame(updateTimer);

		// Cleanup function to cancel the animation frame
		return () => {
			cancelAnimationFrame(animationFrameId);
		};
	}, [router]);

	// Handle answer selection
	const handleAnswerSelect = (answer: string) => {
		setSelectedAnswer(answer);
		const correct = answer === correctAnswer;
		setIsCorrect(correct);
		if (!correct) {
			setCorrectAnswerShown(true);
		}
	};

	// Calculate progress for the custom progress bar (0 to 1)
	const progress = timer / 90;

	return (
		<View style={styles.container}>
			<Text style={styles.timer}>{`${Math.floor(timer / 60)}:${String(Math.floor(timer % 60)).padStart(2, "0")}`}</Text>

			{/* Custom Progress Bar */}
			<View style={styles.progressBarContainer}>
				<View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
			</View>

			<Text style={styles.question}>{`Q: ${question}`}</Text>

			{/* Render answer options */}
			{options.map((option) => (
				<TouchableOpacity
					key={option}
					style={[
						styles.optionButton,
						selectedAnswer === option && isCorrect === true && styles.correctOption,
						selectedAnswer === option && isCorrect === false && styles.incorrectOption,
						correctAnswerShown && option === correctAnswer && styles.correctOption,
					]}
					onPress={() => handleAnswerSelect(option)}
					disabled={selectedAnswer !== null}>
					<Text style={styles.optionText}>{option}</Text>
				</TouchableOpacity>
			))}

			{/* Feedback after selecting an answer */}
			{selectedAnswer && (
				<Text style={styles.feedbackText}>
					{isCorrect ? "Correct! The largest muscle in the human body is the gluteus maximus." : "Incorrect. The correct answer is Gluteus Maximus."}
				</Text>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		...globalStyles.container,
	},
	timer: {
		fontSize: theme.fonts.title + 5,
		fontWeight: "bold",
		color: theme.colors.textSecondary,
		marginBottom: theme.spacing.small,
	},
	progressBarContainer: {
		...globalStyles.progressBarContainer
	},
	progressBar: {
		...globalStyles.progressBar
	},
	question: {
		fontSize: theme.fonts.large,
		fontWeight: "bold",
		color: theme.colors.textSecondary,
		marginBottom: theme.spacing.medium,
		textAlign: "center",
	},
	optionButton: {
		...globalStyles.optionButton
	},
	optionText: {
		fontSize: theme.fonts.regular, // Adjusted font size to fit within the button
		color: theme.colors.textPrimary,
		textAlign: "center",
	},
	correctOption: {
		...globalStyles.correctOption
	},
	incorrectOption: {
		...globalStyles.incorrectOption
	},
	feedbackText: {
		...globalStyles.feedbackText
	},
});

export default TimerPage;
