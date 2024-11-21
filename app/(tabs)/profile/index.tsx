import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import { globalStyles } from "@/assets/styles/globalStyles";
import { theme } from "@/assets/styles/theme";
import PageWrapper from "@/assets/styles/pageWrapper";

export default function Profile() {
	const router = useRouter();

	async function gotoTerms() {
		router.push("../profile/terms");
	}
	async function gotoUserinfo() {
		router.push("../profile/userinfo");
	}
	async function gotoGoals() {
		router.push("../profile/goals");
	}
	async function gotoPrivacy() {
		router.push("../profile/privacy");
	}
	async function gotoNotifications() {
		router.push("../profile/notifications");
	}

	return (
		<PageWrapper>
			<SafeAreaView style={styles.safeArea}>
				<ThemedView style={styles.container}>
					<ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator = {false} showsHorizontalScrollIndicator = {false}>
						{/* Profile Section */}
						<View style={styles.profileContainer}>
							<Ionicons name="person-circle-outline" size={80} color="#5A5A5A" />
							<View style={styles.profileInfo}>
								<ThemedText style={styles.profileName}>Test Name</ThemedText>
								<Text style={styles.profileEmail}>test@gmail.com</Text>
							</View>
						</View>

						{/* Settings Section */}
						<View style={styles.settingsContainer}>
							<ThemedText type="title" style={styles.sectionTitle}>
								Settings
							</ThemedText>

							{/* Workout Goals */}
							<TouchableOpacity style={styles.settingOption} onPress={gotoGoals}>
								<Ionicons name="fitness-outline" size={24} color="gray" />
								<Text style={styles.settingText}>Workout Goals</Text>
							</TouchableOpacity>

							{/* Privacy & Security */}
							<TouchableOpacity style={styles.settingOption} onPress={gotoPrivacy}>
								<Ionicons name="lock-closed-outline" size={24} color="gray" />
								<Text style={styles.settingText}>Privacy & Security</Text>
							</TouchableOpacity>

							{/* Terms & Conditions */}
							<TouchableOpacity style={styles.settingOption} onPress={gotoTerms}>
								<Ionicons name="document-text-outline" size={24} color="gray" />
								<Text style={styles.settingText}>Terms & Conditions</Text>
							</TouchableOpacity>

							{/* User Info */}
							<TouchableOpacity style={styles.settingOption} onPress={gotoUserinfo}>
								<Ionicons name="person-outline" size={24} color="gray" />
								<Text style={styles.settingText}>Login Info</Text>
							</TouchableOpacity>
						</View>
					</ScrollView>
				</ThemedView>
			</SafeAreaView>
		</PageWrapper>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		...globalStyles.safeAreaContainer,
	},
	container: {
		flex: 1,
		paddingTop: 40, // Added top padding to avoid the iPhone notch area
		paddingHorizontal: 20,
	},
	scrollContainer: {
		paddingBottom: 20,
	},
	profileContainer: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 20,
		borderRadius: 12,
		marginBottom: 20,
		shadowOpacity: 0.1,
		shadowRadius: 5,
		elevation: 5,
	},
	profileInfo: {
		marginLeft: 15,
	},
	profileName: {
		fontSize: 22,
		fontWeight: "bold",
		color: "#fff",
	},
	profileEmail: {
		fontSize: 16,
		color: "#bbb",
	},
	settingsContainer: {
		padding: 20,
		borderRadius: 12,
		elevation: 5,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
	},
	sectionTitle: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
		color: "#fff",
	},
	settingOption: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 15,
		borderBottomWidth: 1,
		borderBottomColor: "#3C4C60", // Subtle border color between settings
	},
	settingText: {
		fontSize: 18,
		marginLeft: 15,
		color: "#fff",
	},
});
