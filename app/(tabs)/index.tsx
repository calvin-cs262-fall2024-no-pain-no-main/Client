import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const [timer, setTimer] = useState(300); // Timer starts at 5 minutes (300 seconds)
  const [isRunning, setIsRunning] = useState(false); // Timer state (running or not)
  const [showRestInfo, setShowRestInfo] = useState(false); // Controls the visibility of rest information
  const timerPosition = new Animated.Value(0); // Controls the timer position for animation

  // Function to format the timer in MM:SS format
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // useEffect to handle the timer countdown
  useEffect(() => {
    let interval;
    if (isRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (!isRunning && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  // Function to start/stop the timer
  const handleStartStop = () => {
    setIsRunning((prev) => !prev);
    setShowRestInfo((prev) => !prev);

    // Animate the timer position to the top if the timer starts, back to center if it stops
    Animated.timing(timerPosition, {
      toValue: isRunning ? 0 : -150, // Move up or back to center
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  // Function to reset the timer to 5 minutes
  const handleReset = () => {
    setTimer(300);
    setIsRunning(false);
    setShowRestInfo(false); // Hide rest info on reset

    // Reset timer position
    Animated.timing(timerPosition, {
      toValue: 0, // Back to center
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  return (
    <ThemedView style={styles.container}>
      {/* Animated Timer */}
      <Animated.View style={[styles.circle, { transform: [{ translateY: timerPosition }] }]}>
        <TouchableOpacity onPress={handleStartStop}>
          <Text style={styles.timerText}>{formatTime(timer)}</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Rest Info Box (Appears when timer starts) */}
      {showRestInfo && (
        <View style={styles.restInfoContainer}>
          <Text style={styles.restInfoText}>
            Remember, resting between sets helps muscles recover and grow stronger. Aim for 60-90
            seconds of rest for most exercises!
          </Text>
          <Text style={styles.restInfoText}>
            During rest, deep breathing and hydration can help you optimize your workout performance.
          </Text>
        </View>
      )}

      {/* Stylish Reset Button */}
      <TouchableOpacity style={styles.resetButton} onPress={handleReset} disabled={isRunning}>
        <Text style={styles.resetButtonText}>Reset Timer</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 10,
    borderColor: '#A1CEDC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  timerText: {
    fontSize: 64,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  restInfoContainer: {
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  restInfoText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  resetButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 50,
  },
  resetButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});
