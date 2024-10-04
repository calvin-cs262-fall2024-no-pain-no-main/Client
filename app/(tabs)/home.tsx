import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const [timer, setTimer] = useState(0); // Timer starts at 0
  const [isRunning, setIsRunning] = useState(false); // Timer state (running or not)
  const [showRestInfo, setShowRestInfo] = useState(false); // Controls the visibility of rest information
  const [selectedRestTime, setSelectedRestTime] = useState(null); // Store selected rest time
  const [showIntensityButtons, setShowIntensityButtons] = useState(true); // Controls visibility of intensity buttons
  const [scale, setScale] = useState(new Animated.Value(1)); // Scale for zooming effect

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
    if (timer > 0) { // Only start if timer is set
      setIsRunning((prev) => !prev);
      setShowRestInfo((prev) => !prev);
      setShowIntensityButtons(!isRunning); // Hide buttons when running

      // Animate the timer scaling
      Animated.timing(scale, {
        toValue: isRunning ? 1 : 1.5, // Zoom in when starting, zoom out when stopping
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  };

  // Function to reset the timer
  const handleReset = () => {
    setTimer(0);
    setIsRunning(false);
    setShowRestInfo(false); // Hide rest info on reset
    setSelectedRestTime(null); // Reset selected rest time
    setShowIntensityButtons(true); // Show intensity buttons on reset
    setScale(new Animated.Value(1)); // Reset scale to original size
  };

  // Function to set rest time based on selected intensity
  const handleIntensitySelect = (intensity) => {
    let restTime;
    switch (intensity) {
      case 'normal':
        restTime = 90; // 1:30 min
        break;
      case 'intermediate':
        restTime = 120; // 2 min
        break;
      case 'intense':
        restTime = 180; // 3 min
        break;
      default:
        restTime = null;
    }
    setSelectedRestTime(restTime);
    setTimer(restTime); // Set the timer to the selected rest time
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Animated Timer */}
      <Animated.View style={[styles.circle, { transform: [{ scale }] }]}>
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
          {selectedRestTime && (
            <Text style={styles.restInfoText}>
              Selected Rest Time: {Math.floor(selectedRestTime / 60)}:{(selectedRestTime % 60).toString().padStart(2, '0')}
            </Text>
          )}
        </View>
      )}

      {/* Intensity Buttons */}
      {showIntensityButtons && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.intensityButton} onPress={() => handleIntensitySelect('normal')}>
            <Text style={styles.buttonText}>Normal (1:30 min)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.intensityButton} onPress={() => handleIntensitySelect('intermediate')}>
            <Text style={styles.buttonText}>Intermediate (2:00 min)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.intensityButton} onPress={() => handleIntensitySelect('intense')}>
            <Text style={styles.buttonText}>Intense (3:00 min)</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Stylish Reset Button */}
      <TouchableOpacity style={styles.resetButton} onPress={handleReset} disabled={isRunning}>
        <Text style={styles.resetButtonText}>Reset Timer</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20, // Optional padding to prevent elements from touching edges
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  intensityButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginHorizontal: 5,
    width: '30%', // Adjust width as necessary
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
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
