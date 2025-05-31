import { StyleSheet, Text, View } from "react-native"

export function StartBlock() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Старт</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.description}>Начало программы</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#4CAF50",
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
