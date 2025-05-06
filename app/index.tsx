import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { Button } from "@/components/ui/Button"
import { Link } from "expo-router"
import { StyleSheet } from "react-native"

export default function WelcomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Добро пожаловать в CodeBlock
      </ThemedText>
      <ThemedText style={styles.description}>Создание алгоритмов с помощью визуальных блоков кода</ThemedText>
      <Link href="/codeblocks" asChild>
        <Button style={styles.button}>
          <ThemedText style={styles.buttonText}>Начать</ThemedText>
        </Button>
      </Link>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 40,
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#0a7ea4",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
})
