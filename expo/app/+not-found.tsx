import { View, StyleSheet } from "react-native";
import { Link, Stack } from "expo-router";
import { Button, MD3Theme, useTheme } from "react-native-paper";

// TODO match the theme

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

export default function NotFoundScreen() {
  const theme = useTheme();
  return (
    <>
      <Stack.Screen options={{ title: "Oops! Not Found" }} />
      <View style={getStyles(theme).container}>
        <Button>
          <Link href="/">Go back to Home screen!</Link>
        </Button>
      </View>
    </>
  );
}
