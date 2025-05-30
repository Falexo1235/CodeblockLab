import { useEffect, useState } from "react"
import { StyleSheet, Text, TextInput, View } from "react-native"

interface VariableBlockProps {
  name: string
  onNameChange: (name: string) => void
}

export function VariableBlock({ name, onNameChange }: VariableBlockProps) {
  const [variableName, setVariableName] = useState(name)

  useEffect(() => {
    if (name !== variableName) {
      setVariableName(name)
    }
  }, [name])

  const handleNameChange = (text: string) => {
    setVariableName(text)
    onNameChange(text)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Создать переменную</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.label}>Имя:</Text>
          <TextInput
            style={styles.input}
            value={variableName}
            onChangeText={handleNameChange}
            placeholder="Введите имена переменных"
            autoCapitalize="none"
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#4CAF50",
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
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    color: "white",
    width: 80,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 4,
    padding: 8,
    marginLeft: 8,
  },
  hint: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    fontStyle: "italic",
    marginLeft: 80,
  },
})
