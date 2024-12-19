import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import axios from "axios";
import { globalStyles } from "../../../assets/styles/globalStyles";
import { theme } from "../../../assets/styles/theme";
import PageWrapper from "@/components/pageWrapper";

const TimerPage: React.FC = () => {
	const router = useRouter();
	const [timer, setTimer] = useState<number | null>(null); // Start with `null` to delay countdown
	const [exerciseName, setExerciseName] = useState("");
	const [setNumber, setSetNumber] = useState(0);
	const [quizData, setQuizData] = useState([]);
	const [currentQuestion, setCurrentQuestion] = useState(null);
	const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
	const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
	const [correctAnswerShown, setCorrectAnswerShown] = useState(false);

	useEffect(() => {
		const fetchTimerData = async () => {
			try {
				const timerData = await AsyncStorage.getItem("timerData");
				if (!timerData) {
					Alert.alert("Error", "No timer data found. Returning to workouts.");
					router.back();
					return;
				}
				const { exerciseName, setNumber, restTime } = JSON.parse(timerData);
				setExerciseName(exerciseName);
				setSetNumber(setNumber);
				setTimer(restTime); // Set the timer dynamically from restTime
			} catch (error) {
				console.error("Error fetching timer data:", error);
				Alert.alert("Error", "Failed to load timer data. Returning to workouts.");
				router.back();
			}
		};

		fetchTimerData();
	}, [router]);

	useEffect(() => {
		const fetchQuizData = async () => {
			try {
				const response = await axios.get("https://no-pain-no-main.azurewebsites.net/quizzes");
				const fetchedQuizData = response.data;

				// Randomize options for each question in fetchedQuizData
				const randomizedQuizData = fetchedQuizData.map((quiz) => {
					const allOptions = [quiz.correct_answer, ...quiz.incorrect_answers.split(", ")];
					const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);

					return { ...quiz, options: shuffledOptions }; // Add shuffled options to each question
				});

				setQuizData(randomizedQuizData); // Store all quiz data
				setCurrentQuestion(randomizedQuizData[0]); // Set the first question
			} catch (error) {
				Alert.alert("Error", "Failed to fetch quiz data. Please try again.");
			}
		};

		fetchQuizData();
	}, []);

	useEffect(() => {
		if (timer === null) return; // Prevent countdown until timer is initialized

		let interval: NodeJS.Timeout | undefined;
		if (timer > 0) {
			interval = setInterval(() => {
				setTimer((prevTimer) => (prevTimer !== null ? Math.max(prevTimer - 1, 0) : 0));
			}, 1000);
		} else if (timer === 0) {
			Alert.alert("Time's Up!", "Rest time is over. Let's get back to the workout!");
			router.back();
		}

		return () => clearInterval(interval);
	}, [timer, router]);

	const handleAnswerSelect = (answer: string) => {
		if (!currentQuestion) return;
		setSelectedAnswer(answer);
		const correct = answer === currentQuestion.correct_answer;
		setIsCorrect(correct);
		if (!correct) {
			setCorrectAnswerShown(true);
		}
	};

	const loadNextQuestion = () => {
		if (quizData.length === 0) {
			Alert.alert("No more questions", "Please reload the quiz.");
			return;
		}

		// Find the current index of the question
		const currentIndex = quizData.findIndex((q) => q.question === currentQuestion?.question);

		// Move to the next question, or wrap back to the first one
		const nextIndex = (currentIndex + 1) % quizData.length;
		setCurrentQuestion(quizData[nextIndex]); // Set the next question

		// Reset states for the new question
		setCorrectAnswerShown(false);
		setSelectedAnswer(null);
		setIsCorrect(null);
	};

	if (timer === null) {
		return (
			<View style={styles.container}>
				<Text style={styles.loadingText}>Loading...</Text>
			</View>
		);
	}

	return (
		<PageWrapper>
			<ScrollView contentContainerStyle={styles.scrollViewContainer}>
				{/* Exercise Name and Set Number */}
				<Text style={styles.exerciseTitle}>{exerciseName}</Text>
				<Text style={styles.setInfo}>Set {setNumber}</Text>

				{/* Timer */}
				<Text style={styles.timer}>
					{Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
				</Text>

				{/* Custom Progress Bar */}
				<View style={styles.progressBarContainer}>
					<View style={[styles.progressBar, { width: `${(timer / 60) * 100}%` }]} />
				</View>

				{/* Quiz */}
				{currentQuestion && (
					<>
						<Text style={styles.question}>{`Q: ${currentQuestion.question}`}</Text>
						{currentQuestion.options.map((option, index) => (
							<TouchableOpacity
								key={index}
								style={[
									styles.optionButton,
									selectedAnswer === option && isCorrect === true && styles.correctOption,
									selectedAnswer === option && isCorrect === false && styles.incorrectOption,
									correctAnswerShown && option === currentQuestion.correct_answer && styles.correctOption,
								]}
								onPress={() => handleAnswerSelect(option)}
								disabled={selectedAnswer !== null}>
								<Text style={styles.optionText}>{option}</Text>
							</TouchableOpacity>
						))}

						{selectedAnswer && (
							<Text style={styles.feedbackText}>{isCorrect ? `Correct! ${currentQuestion.description}` : `Incorrect! ${currentQuestion.description}`}</Text>
						)}

						{selectedAnswer && (
							<TouchableOpacity style={styles.nextButton} onPress={loadNextQuestion}>
								<Text style={styles.nextButtonText}>Next Question</Text>
							</TouchableOpacity>
						)}
					</>
				)}
			</ScrollView>
		</PageWrapper>
	);
};

const styles = StyleSheet.create({
	scrollViewContainer: {
		flexGrow: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: theme.spacing.medium,
		paddingBottom: theme.spacing.large,
	},
	loadingText: {
		fontSize: 18,
		color: theme.colors.textSecondary,
	},
	exerciseTitle: {
		fontSize: theme.fonts.title + 5,
		fontWeight: "bold",
		color: theme.colors.textPrimary,
		marginBottom: theme.spacing.small,
		marginTop: theme.spacing.large, // Increased margin from top
		textAlign: "center",
	},

	setInfo: {
		fontSize: theme.fonts.large,
		color: theme.colors.textSecondary,
		marginBottom: theme.spacing.medium,
	},
	timer: {
		fontSize: theme.fonts.title + 10,
		fontWeight: "bold",
		color: theme.colors.primary,
		marginBottom: theme.spacing.medium,
	},
	progressBarContainer: {
		width: "80%",
		height: 10,
		backgroundColor: "black",
		borderRadius: 5,
		overflow: "hidden",
		marginBottom: theme.spacing.large,
	},
	progressBar: {
		height: "100%",
		backgroundColor: theme.colors.primary,
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
		flexWrap: "wrap", // Allow wrapping of long text
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
	finishButton: {
		backgroundColor: theme.colors.buttonBackground,
		padding: theme.spacing.small,
		borderRadius: theme.borderRadius.medium,
		alignItems: "center",
	},
	finishButtonText: {
		fontSize: theme.fonts.regular,
		color: theme.colors.textPrimary,
		fontWeight: "bold",
	},
});

export default TimerPage;
