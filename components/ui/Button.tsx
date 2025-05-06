import { useThemeColor } from "@/hooks/useThemeColor"
import { StyleSheet, TouchableOpacity, type TouchableOpacityProps } from "react-native"

export type ButtonProps = TouchableOpacityProps & {
  lightColor?: string
  darkColor?: string
}

export function Button({ style, lightColor, darkColor, ...otherProps }: ButtonProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "tint")

  return <TouchableOpacity style={[styles.button, { backgroundColor }, style]} {...otherProps} />
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
})
