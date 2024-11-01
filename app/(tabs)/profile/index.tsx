import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from "expo-router";

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
    <ImageBackground
      source={require('../../../assets/images/gym-buddy.png')} // Replace with your image path
      style={styles.background}
      imageStyle={{ opacity: 0.3 }} // Adjust opacity for background image
    >
      <ThemedView style={styles.container}>
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
          <ThemedText type="title" style={styles.sectionTitle}>Settings</ThemedText>

          {/* Workout Goals */}
          <TouchableOpacity style={styles.settingOption} onPress={gotoGoals}>
            <Ionicons name="fitness-outline" size={24} color="gray" />
            <Text style={styles.settingText}>Workout Goals</Text>
          </TouchableOpacity>

          {/* Notifications */}
          <TouchableOpacity style={styles.settingOption} onPress={gotoNotifications}>
            <Ionicons name="notifications-outline" size={24} color="gray" />
            <Text style={styles.settingText}>Notifications</Text>
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
            <Text style={styles.settingText}>User Info</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // Ensures the image covers the background
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',  // Slightly transparent white for readability
    borderRadius: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileInfo: {
    marginLeft: 15,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
  },
  profileEmail: {
    fontSize: 16,
    color: 'gray',
  },
  settingsContainer: {
    marginTop: 30,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  settingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingText: {
    fontSize: 18,
    marginLeft: 15,
    color: '#333',
  },
});
