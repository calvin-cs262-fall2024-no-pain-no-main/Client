import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'

const Goals = () => {
    // State to hold user inputs for personal record goals and weight goals
    const [deadlift, setDeadlift] = useState('')
    const [squat, setSquat] = useState('')
    const [benchPress, setBenchPress] = useState('')
    const [currentWeight, setCurrentWeight] = useState('')
    const [goalWeight, setGoalWeight] = useState('')

    return (
        <View style={styles.container}>
            {/* Section for Personal Record Goals */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Personal Record Goals (in lbs)</Text>
                
                {/* Deadlift Input */}
                <View style={styles.goalItem}>
                    <Text style={styles.goalLabel}>Deadlift</Text>
                    <TextInput 
                        style={styles.goalInput}
                        placeholder="Enter Deadlift Goal"
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
                        keyboardType="numeric"
                        value={goalWeight}
                        onChangeText={setGoalWeight}
                    />
                </View>
            </View>
        </View>
    )
}

export default Goals

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f4f4f4',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    goalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    goalLabel: {
        fontSize: 16,
    },
    goalInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        width: 100,
        textAlign: 'center',
        borderRadius: 5,
    },
})
