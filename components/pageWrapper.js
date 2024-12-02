// src/components/PageWrapper.js
import React, { useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { theme } from "../assets/styles/theme";

const PageWrapper = ({ children }) => {
	const [opacity] = useState(new Animated.Value(0));

	const handleImageLoad = () => {
		Animated.timing(opacity, {
			toValue: 1,
			duration: 200,
			useNativeDriver: true,
		}).start();
	};

	return (
		<View style={styles.container}>
			<Animated.Image
				source={theme.images.background}
				style={[styles.backgroundImage, { opacity }]}
				onLoad={handleImageLoad}
			/>
			<View style={styles.content}>{children}</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "black",
	},
	backgroundImage: {
		position: "absolute",
		width: "100%",
		height: "100%",
		resizeMode: "cover",
	},
	content: {
		flex: 1,
		backgroundColor: "transparent", // Ensure transparency over the background
	},
});

export default PageWrapper;
