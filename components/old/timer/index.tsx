import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { Picker } from '@react-native-picker/picker';

export default function Timer() {
  const [isRunning, setIsRunning] = useState(false); // Timer state (running or not)
  const [remainingTime, setRemainingTime] = useState(150); // Default rest time (2:30)
  const [initialTime, setInitialTime] = useState(150); // Initial time for reset (2:30)
  const [isEditing, setIsEditing] = useState(false); // Editing state
  const [minutes, setMinutes] = useState(2); // Minutes for picker
  const [seconds, setSeconds] = useState(30); // Seconds for picker
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null); // Ref for the interval

  useEffect(() => {
    if (isRunning && remainingTime > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (remainingTime === 0) {
      handleReset();
    } else if (!isRunning && remainingTime !== 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
        }
        return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
        };
  }, [isRunning, remainingTime]);

  // Function to start the timer
  const handleStart = () => {
    setIsRunning(true);
  };

  // Function to reset the timer
  const handleReset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current as NodeJS.Timeout);
    }
    setIsRunning(false);
    setRemainingTime(initialTime);
  };

  // Function to handle time input change
  const handleTimeChange = () => {
    const newTime = parseInt(minutes * 60) + parseInt(seconds);
    setRemainingTime(newTime);
    setInitialTime(newTime);
    setIsEditing(false);
    setIsRunning(true); // Auto-start the timer
  };

  // Function to handle editing state
  const handleEdit = () => {
    setMinutes(Math.floor(initialTime / 60));
    setSeconds(initialTime % 60);
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <View style={styles.container}>
        <View style={styles.timePickerContainer}>
          <View style={styles.pickerColumn}>
            <Text style={styles.pickerTitle}>Minutes</Text>
            <Picker
              selectedValue={minutes}
              style={styles.picker}
              onValueChange={(itemValue) => setMinutes(itemValue)}
            >
              {[...Array(6).keys()].map((i) => (
                <Picker.Item key={`min-${i}`} label={`${i.toString().padStart(2, '0')}`} value={i} />
              ))}
            </Picker>
          </View>
          <Text style={styles.colon}>:</Text>
          <View style={styles.pickerColumn}>
            <Text style={styles.pickerTitle}>Seconds</Text>
            <Picker
              selectedValue={seconds}
              style={styles.picker}
              onValueChange={(itemValue) => setSeconds(itemValue)}
            >
              {[0, 15, 30, 45].map((i) => (
                <Picker.Item key={`sec-${i}`} label={`${i.toString().padStart(2, '0')}`} value={i} />
              ))}
            </Picker>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleTimeChange} style={styles.button}>
            <Text style={styles.buttonText}>Set Time</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.button}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CountdownCircleTimer
        key={remainingTime} // Add key to force re-render
        isPlaying={isRunning}
        duration={initialTime}
        initialRemainingTime={remainingTime}
        colors={['#3498db', '#4dd100', '#F7B801', '#A30000']}
        colorsTime={[initialTime, initialTime * 0.75, initialTime * 0.33, 0]}
        strokeLinecap="round"
        onComplete={() => {
          handleReset(); // Reset the timer
          return { shouldRepeat: false }; // Pause the timer
        }}
      >
        {({ remainingTime }) => (
          <View style={styles.timerContainer}>
            <TouchableOpacity onPress={handleEdit}>
              <Text style={styles.timerText}>{formatTime(remainingTime)}</Text>
              <Text style={styles.editText}>tap to edit</Text>
            </TouchableOpacity>
          </View>
        )}
      </CountdownCircleTimer>

      <View style={styles.buttonContainer}>
        {!isRunning && (
          <TouchableOpacity onPress={handleStart} style={styles.startButton}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
  },
  timerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  timerText: {
    fontSize: 48,
    textAlign: 'center',
  },
  editText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 5,
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  pickerColumn: {
    alignItems: 'center',
  },
  pickerTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  picker: {
    width: 100,
    height: 50,
  },
  colon: {
    fontSize: 48,
    marginHorizontal: 10,
    marginTop: 190,
  },
  button: {
    marginTop: 50,
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  startButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 50,
  },
});