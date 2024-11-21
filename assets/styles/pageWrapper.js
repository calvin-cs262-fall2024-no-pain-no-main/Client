import React from "react";
import { Image, View } from "react-native";
import { globalStyles } from "../styles/globalStyles"; // Adjust path as needed
import { theme } from "../styles/theme";

const PageWrapper = ({ children }) => {
	return (
		<View style={globalStyles.containerWithBackground}>
			<Image source={theme.images.background} style={globalStyles.backgroundImage} />
			<View style={globalStyles.contentContainer}>{children}</View>
		</View>
	);
};

export default PageWrapper;
