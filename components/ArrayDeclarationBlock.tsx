import { useEffect, useState } from "react"
import { StyleSheet, Text, TextInput, View } from "react-native"

interface ArrayDeclarationBlockProps {
  arrayName: string
  arraySize: string
  onArrayNameChange: (name: string) => void
  onArraySizeChange: (size: string) => void
  blockId: string
}

export function ArrayDeclarationBlock({ 
  arrayName, 
  arraySize, 
  onArrayNameChange, 
  onArraySizeChange, 
  blockId 
}: ArrayDeclarationBlockProps) {
  const [name, setName] = useState(arrayName)
  const [size, setSize] = useState(arraySize)

  useEffect(() => {
    if (arrayName !== name) {
      setName(arrayName)
    }
    if (arraySize !== size) {
      setSize(arraySize)
    }
  }, [arrayName, arraySize])

  const handleNameChange = (text: string) => {
    setName(text)
    onArrayNameChange(text)
  }

  const handleSizeChange = (text: string) => {
    setSize(text)
    onArraySizeChange(text)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Создать массив</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.label}>Имя:</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={handleNameChange}
            placeholder="Имя массива"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Размер:</Text>
          <TextInput
            style={styles.input}
            value={size}
            onChangeText={handleSizeChange}
            placeholder="Количество элементов"
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#3F51B5",
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
    width: 80,
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 4,
    padding: 8,
  },
})
