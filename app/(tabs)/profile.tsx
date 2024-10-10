import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from "expo-router";

export default function TabTwoScreen() {
  const [timer, setTimer] = useState<number | null>(null);

  const handleSetTimer = (seconds: number) => {
    setTimer(seconds);
  };
  const router = useRouter();

  async function gotoabout() {
    router.push("/(about)/aboutpage");
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="person-circle-outline" style={styles.headerImage} />}
    >
      {/* Profile Section */}
      <ThemedView style={styles.profileContainer}>
        <Image
          source={{ uri: 'https://example.com/profile-picture.jpg' }} // Replace with actual profile image URL
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          <ThemedText style={styles.profileName}>John Doe</ThemedText>
          <Text style={styles.profileEmail}>johndoe@example.com</Text>
        </View>
      </ThemedView>

      {/* Settings Section */}
      <ThemedView style={styles.settingsContainer}>
        <ThemedText type="title" style={styles.sectionTitle}>Settings</ThemedText>

        <TouchableOpacity style={styles.settingOption}>
          <Ionicons name="notifications-outline" size={24} color="gray" />
          <Text style={styles.settingText}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingOption}>
          <Ionicons name="lock-closed-outline" size={24} color="gray" />
          <Text style={styles.settingText}>Privacy & Security</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingOption}
          onPress={gotoabout}
        >
          <Ionicons name="information-circle-outline" size={24} color="gray" />
          <Text style={styles.settingText}>About</Text>
        </TouchableOpacity>
      </ThemedView>


    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    marginLeft: 15,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 16,
    color: 'gray',
  },
  settingsContainer: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  settingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingText: {
    fontSize: 18,
    marginLeft: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  timerButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});
