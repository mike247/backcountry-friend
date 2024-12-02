import { View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Button, MD3Theme, Text, useTheme } from "react-native-paper";

const getStyles = (theme: MD3Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: "center",
      alignItems: "center",
    },
  });
};

export default function About() {
  const theme = useTheme();
  return (
    <View style={getStyles(theme).container}>
      <Text>About screen</Text>
      <Button mode="contained">
        <Link href="/">Go to Home screen</Link>
      </Button>
    </View>
  );
}
