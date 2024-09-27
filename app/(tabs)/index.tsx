import { Image, StyleSheet, Platform, View, Text, Button } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.titleText}>Welcome to no pain no main</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.timerContainer}>
        <Text style={styles.timerText}>00:05:00</Text>
      </ThemedView>

      <ThemedView style={styles.gameContainer}>
        <Button title="Start Quiz" onPress={() => { /* Start Quiz Functionality */ }} />
        <Button title="Play Game" onPress={() => { /* Start Game Functionality */ }} />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  titleText: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  reactLogo: {
    height: 150,
    width: 150,
    marginTop: 50,
  },
  timerContainer: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  gameContainer: {
    marginTop: 60,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    gap: 20,
  },
});
