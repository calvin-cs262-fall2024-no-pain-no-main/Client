import React, { useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "react-native";

export default function MainScreen() {
  // const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function startApp() {
    // setLoading(true);
    router.push("/(tabs)/timer"); // move to tabs
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/gym-buddy.png")}
        style={{ width: 400, height: 400, marginBottom: 0 }}
      />
      <TouchableOpacity
        style={styles.startButton}
        // disabled={loading}
        onPress={startApp}
      >
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  startButton: {
    backgroundColor: "#3498db",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
