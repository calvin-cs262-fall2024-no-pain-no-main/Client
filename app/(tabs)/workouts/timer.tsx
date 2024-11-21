import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { globalStyles } from "../../../assets/styles/globalStyles";
import { theme } from "../../../assets/styles/theme";
import PageWrapper from "@/assets/styles/pageWrapper";

const TimerPage: React.FC = () => {
	const router = useRouter();
	const [timer, setTimer] = useState(45);
	const [quizData, setQuizData] = useState([]);
	const [currentQuestion, setCurrentQuestion] = useState(null);
	const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
	const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
	const [correctAnswerShown, setCorrectAnswerShown] = useState(false);

	// Fetch quiz data from the API
	useEffect(() => {
		const fetchQuizData = async () => {
			try {
				const response = await axios.get("https://no-pain-no-main.azurewebsites.net/quizzes");
				setQuizData(response.data);
				setCurrentQuestion(response.data[Math.floor(Math.random() * response.data.length)]);
			} catch (error) {
				Alert.alert("Error", "Failed to fetch quiz data. Please try again.");
			}
		};
		fetchQuizData();
	}, []);

	// Timer countdown logic
	useEffect(() => {
		let startTime: number;
		let animationFrameId: number;

		const updateTimer = (timestamp: number) => {
			if (!startTime) startTime = timestamp;
			const elapsedTime = (timestamp - startTime) / 1000;
			const remainingTime = Math.max(45 - elapsedTime, 0);
			setTimer(remainingTime);

			if (remainingTime > 0) {
				animationFrameId = requestAnimationFrame(updateTimer);
			} else {
				// Navigate back when the timer reaches 0
				router.back();
			}
		};

		animationFrameId = requestAnimationFrame(updateTimer);

		return () => {
			cancelAnimationFrame(animationFrameId);
		};
	}, [router]);

	// Handle answer selection
	const handleAnswerSelect = (answer: string) => {
		if (!currentQuestion) return;
		setSelectedAnswer(answer);
		const correct = answer === currentQuestion.correctanswer;
		setIsCorrect(correct);
		if (!correct) {
			setCorrectAnswerShown(true);
		}
	};

	// Load the next random question
	const loadNextQuestion = () => {
		if (quizData.length > 0) {
			setCorrectAnswerShown(false);
			setSelectedAnswer(null);
			setIsCorrect(null);
			setTimer(45); // Reset the timer
			const randomIndex = Math.floor(Math.random() * quizData.length);
			setCurrentQuestion(quizData[randomIndex]);
		} else {
			Alert.alert("No more questions", "Please reload the quiz.");
		}
	};

	if (!currentQuestion) {
		return (
			<View style={styles.container}>
				<Text style={styles.loadingText}>Loading quiz...</Text>
			</View>
		);
	}

	return (
		<PageWrapper>
			<View style={styles.container}>
				<Text style={styles.timer}>{`${Math.floor(timer / 60)}:${String(Math.floor(timer % 60)).padStart(2, "0")}`}</Text>

				{/* Custom Progress Bar */}
				<View style={styles.progressBarContainer}>
					<View style={[styles.progressBar, { width: `${(timer / 45) * 100}%` }]} />
				</View>

				<Text style={styles.question}>{`Q: ${currentQuestion.question}`}</Text>

				{/* Render answer options */}
				{[currentQuestion.correctanswer, ...currentQuestion.incorrectanswers.split(", ")].map((option, index) => (
					<TouchableOpacity
						key={index}
						style={[
							styles.optionButton,
							selectedAnswer === option && isCorrect === true && styles.correctOption,
							selectedAnswer === option && isCorrect === false && styles.incorrectOption,
							correctAnswerShown && option === currentQuestion.correctanswer && styles.correctOption,
						]}
						onPress={() => handleAnswerSelect(option)}
						disabled={selectedAnswer !== null}>
						<Text style={styles.optionText}>{option}</Text>
					</TouchableOpacity>
				))}

				{/* Feedback after selecting an answer */}
				{selectedAnswer && (
					<Text style={styles.feedbackText}>{isCorrect ? `Correct! ${currentQuestion.description}` : `Incorrect! ${currentQuestion.description}`}</Text>
				)}

				{/* Next Question Button */}
				{selectedAnswer && (
					<TouchableOpacity style={styles.nextButton} onPress={loadNextQuestion}>
						<Text style={styles.nextButtonText}>Next Question</Text>
					</TouchableOpacity>
				)}
			</View>
		</PageWrapper>
	);
};

const styles = StyleSheet.create({
	container: {
		...globalStyles.container,
	},
	loadingText: {
		fontSize: 18,
		color: theme.colors.textSecondary,
	},
	timer: {
		fontSize: theme.fonts.title + 5,
		fontWeight: "bold",
		color: theme.colors.textSecondary,
		marginBottom: theme.spacing.small,
	},
	progressBarContainer: {
		...globalStyles.progressBarContainer,
	},
	progressBar: {
		...globalStyles.progressBar,
	},
	question: {
		fontSize: theme.fonts.large,
		fontWeight: "bold",
		color: theme.colors.textSecondary,
		marginBottom: theme.spacing.medium,
		textAlign: "center",
	},
	optionButton: {
		...globalStyles.optionButton,
	},
	optionText: {
		fontSize: theme.fonts.regular,
		color: theme.colors.textPrimary,
		textAlign: "center",
	},
	correctOption: {
		...globalStyles.correctOption,
	},
	incorrectOption: {
		...globalStyles.incorrectOption,
	},
	feedbackText: {
		...globalStyles.feedbackText,
	},
	nextButton: {
		backgroundColor: theme.colors.primary,
		paddingVertical: theme.spacing.small,
		paddingHorizontal: theme.spacing.medium,
		borderRadius: theme.borderRadius.medium,
		marginTop: theme.spacing.medium,
	},
	nextButtonText: {
		color: theme.colors.textPrimary,
		fontSize: theme.fonts.regular,
		fontWeight: "bold",
		textAlign: "center",
	},
});

export default TimerPage;
