import { useEffect, useState } from "react"
import { StyleSheet, Text, TextInput, View } from "react-native"

interface FunctionStartBlockProps {
  functionName: string
  onFunctionNameChange: (name: string) => void
  blockId: string
}

export function FunctionStartBlock({ functionName, onFunctionNameChange, blockId }: FunctionStartBlockProps) {
  const [name, setName] = useState(functionName)

  useEffect(() => {
    if (functionName !== name) {
      setName(functionName)
    }
  }, [functionName])

  const handleNameChange = (text: string) => {
    setName(text)
    onFunctionNameChange(text)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Начало функции</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.label}>Имя функции:</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={handleNameChange}
            placeholder="Введите имя функции"
            autoCapitalize="none"
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#673AB7",
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
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    color: "white",
    width: 100,
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 4,
    padding: 8,
  },
})
