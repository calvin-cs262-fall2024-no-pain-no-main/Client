import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from "expo-router";

export default function TabTwoScreen() {
  const router = useRouter();

  async function gotoabout() {
    router.push("/(about)/aboutpage");
  }
  async function gotoTerms() {
    router.push("/terms");
  }
  async function gotoUserinfo() {
    router.push("/userinfo");
  }
  async function gotoGoals() {
    router.push("/goals");
  }
  async function gotoPrivacy() {
    router.push("/privacy");
  }
  async function gotoNotifications() {
    router.push("/notifications");
  }

  return (
    <ThemedView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <Ionicons name="person-circle-outline" size={80} color="#5A5A5A" />
        <View style={styles.profileInfo}>
          <ThemedText style={styles.profileName}>No pain no main</ThemedText>
          <Text style={styles.profileEmail}>cs262_d@example.com</Text>
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

        {/* About */}
        <TouchableOpacity style={styles.settingOption} onPress={gotoabout}>
          <Ionicons name="information-circle-outline" size={24} color="gray" />
          <Text style={styles.settingText}>About</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',  // Light background color for fitness theme
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
