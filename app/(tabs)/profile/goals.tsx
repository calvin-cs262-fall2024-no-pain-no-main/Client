import { StyleSheet, Text, TextInput, View, ScrollView, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons'; // Import icons from Expo
import { theme } from "../../../assets/styles/theme";
import PageWrapper from "../../../components/pageWrapper";

const Goals = () => {
  // State to hold user inputs for personal record goals and weight goals
  const [deadlift, setDeadlift] = useState('');
  const [squat, setSquat] = useState('');
  const [benchPress, setBenchPress] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [goalWeight, setGoalWeight] = useState('');

  // Input validation function to allow only integers up to 999
  const validateInput = (value, setState) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, '');

    // Ensure the value does not exceed 999
    if (numericValue === '' || parseInt(numericValue, 10) <= 999) {
      setState(numericValue);
    }
  };

  return (
    <PageWrapper>
      <SafeAreaView style={styles.safeContainer}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Section for Personal Record Goals */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Weight Lifting Goals (in lbs)</Text>

            {/* Deadlift Input */}
            <View style={styles.goalItem}>
              <Ionicons name="barbell-outline" size={24} color="white" />
              <Text style={styles.goalLabel}>Deadlift</Text>
              <TextInput
                style={styles.goalInput}
                placeholder="Enter"
                placeholderTextColor="white"
                keyboardType="numeric"
                value={deadlift}
                onChangeText={(value) => validateInput(value, setDeadlift)}
              />
            </View>

            {/* Squat Input */}
            <View style={styles.goalItem}>
              <Ionicons name="barbell-outline" size={24} color="white" />
              <Text style={styles.goalLabel}>Squat</Text>
              <TextInput
                style={styles.goalInput}
                placeholder="Enter"
                placeholderTextColor="white"
                keyboardType="numeric"
                value={squat}
                onChangeText={(value) => validateInput(value, setSquat)}
              />
            </View>

            {/* Bench Press Input */}
            <View style={styles.goalItem}>
              <Ionicons name="barbell-outline" size={24} color="white" />
              <Text style={styles.goalLabel}>Bench Press</Text>
              <TextInput
                style={styles.goalInput}
                placeholder="Enter"
                placeholderTextColor="white"
                keyboardType="numeric"
                value={benchPress}
                onChangeText={(value) => validateInput(value, setBenchPress)}
              />
            </View>
          </View>

          {/* Section for Weight Goals */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Record (in lbs)</Text>

            {/* Current Weight Input */}
            <View style={styles.goalItem}>
              <Ionicons name="trophy-outline" size={24} color="white" />
              <Text style={styles.goalLabel}>Deadlift</Text>
              <TextInput
                style={styles.goalInput}
                placeholder="Enter"
                placeholderTextColor="white"
                keyboardType="numeric"
                value={currentWeight}
                onChangeText={(value) => validateInput(value, setCurrentWeight)}
              />
            </View>

            {/* Goal Weight Input */}
            <View style={styles.goalItem}>
              <Ionicons name="trophy-outline" size={24} color="white" />
              <Text style={styles.goalLabel}>Squat</Text>
              <TextInput
                style={styles.goalInput}
                placeholder="Enter"
                placeholderTextColor="white"
                keyboardType="numeric"
                value={goalWeight}
                onChangeText={(value) => validateInput(value, setGoalWeight)}
              />
            </View>
            <View style={styles.goalItem}>
              <Ionicons name="trophy-outline" size={24} color="white" />
              <Text style={styles.goalLabel}>Bench Press</Text>
              <TextInput
                style={styles.goalInput}
                placeholder="Enter"
                placeholderTextColor="white"
                keyboardType="numeric"
                value={goalWeight}
                onChangeText={(value) => validateInput(value, setGoalWeight)}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </PageWrapper>
  );
};

export default Goals;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
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
    flex: 1, // Ensures proper spacing with icons
    marginLeft: 10, // Adds space between icon and text
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
