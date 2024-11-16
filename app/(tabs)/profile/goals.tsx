import { StyleSheet, Text, TextInput, View, ScrollView, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { theme } from "../../../assets/styles/theme";

const Goals = () => {
  // State to hold user inputs for personal record goals and weight goals
  const [deadlift, setDeadlift] = useState('');
  const [squat, setSquat] = useState('');
  const [benchPress, setBenchPress] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [goalWeight, setGoalWeight] = useState('');

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Section for Personal Record Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Record Goals (in lbs)</Text>

          {/* Deadlift Input */}
          <View style={styles.goalItem}>
            <Text style={styles.goalLabel}>Deadlift</Text>
            <TextInput
              style={styles.goalInput}
              placeholder="Enter Deadlift Goal"
              placeholderTextColor="white"  // Added placeholder color
              keyboardType="numeric"
              value={deadlift}
              onChangeText={setDeadlift}
            />
          </View>

          {/* Squat Input */}
          <View style={styles.goalItem}>
            <Text style={styles.goalLabel}>Squat</Text>
            <TextInput
              style={styles.goalInput}
              placeholder="Enter Squat Goal"
              placeholderTextColor="white"  // Added placeholder color
              keyboardType="numeric"
              value={squat}
              onChangeText={setSquat}
            />
          </View>

          {/* Bench Press Input */}
          <View style={styles.goalItem}>
            <Text style={styles.goalLabel}>Bench Press</Text>
            <TextInput
              style={styles.goalInput}
              placeholder="Enter Bench Press Goal"
              placeholderTextColor="white"  // Added placeholder color
              keyboardType="numeric"
              value={benchPress}
              onChangeText={setBenchPress}
            />
          </View>
        </View>

        {/* Section for Weight Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weight Goals (in lbs)</Text>

          {/* Current Weight Input */}
          <View style={styles.goalItem}>
            <Text style={styles.goalLabel}>Current Weight</Text>
            <TextInput
              style={styles.goalInput}
              placeholder="Enter Current Weight"
              placeholderTextColor="white"  // Added placeholder color
              keyboardType="numeric"
              value={currentWeight}
              onChangeText={setCurrentWeight}
            />
          </View>

          {/* Goal Weight Input */}
          <View style={styles.goalItem}>
            <Text style={styles.goalLabel}>Goal Weight</Text>
            <TextInput
              style={styles.goalInput}
              placeholder="Enter Goal Weight"
              placeholderTextColor="white"  // Added placeholder color
              keyboardType="numeric"
              value={goalWeight}
              onChangeText={setGoalWeight}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Goals;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: theme.colors.cardBackground,
  },
  container: {
    padding: 20,
    paddingBottom: 50, // Ensure padding at the bottom for scroll view
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  goalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  goalLabel: {
    fontSize: 16,
    color: 'white',
  },
  goalInput: {
    borderWidth: 1,
    borderColor: 'white',
    padding: 10,
    width: 100,
    textAlign: 'center',
    borderRadius: 5,
    color: 'white', // White text for user input
  },
});
