import { StyleSheet, Text, View } from "react-native"

export function EndBlock() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Конец</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.description}>Конец программы</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F44336",
    borderRadius: 8,
    marginBottom: 12,
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
