import { Stack } from "expo-router";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { useColorScheme } from "react-native";
import { PaperProvider } from "react-native-paper";

const SOURCE_COLOR = "#689f38";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme({ sourceColor: SOURCE_COLOR });

  const paperTheme =
    colorScheme === "dark" ? { colors: theme.dark } : { colors: theme.light };

  return (
    <PaperProvider theme={paperTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </PaperProvider>
  );
}
