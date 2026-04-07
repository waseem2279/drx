import { themes } from "@/constants/theme";
import { useColorScheme } from "react-native";

export function useTheme() {
  const scheme = useColorScheme();
  const resolvedScheme: "light" | "dark" = scheme === "dark" ? "dark" : "light";
  const colors = themes["light"];

  return {
    theme: resolvedScheme,
    colors,
    isDark: resolvedScheme === "dark",
  };
}
