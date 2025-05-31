import { StyleSheet, Text, View } from "react-native"

interface FunctionEndBlockProps {
  blockId: string
}

export function FunctionEndBlock({ blockId }: FunctionEndBlockProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Конец функции</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.description}>Завершение функции</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#512DA8",
    borderRadius: 8,
    marginBottom: 0,
    overflow: "hidden",
    width: 300,
  },
  header: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    padding: 8,
  },
  title: {
    color: "white",
    fontWeight: "bold",
  },
  content: {
    padding: 12,
    alignItems: "center",
  },
  description: {
    color: "white",
    fontWeight: "bold",
  },
})
