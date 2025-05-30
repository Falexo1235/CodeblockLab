import { useEffect, useState } from "react"
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

const isPhone = Platform.OS === "android" || Platform.OS === "ios"

interface FunctionCallBlockProps {
  functionName: string
  onFunctionNameChange: (name: string) => void
  availableFunctions: string[]
  blockId: string
}

export function FunctionCallBlock({
  functionName,
  onFunctionNameChange,
  availableFunctions,
  blockId,
}: FunctionCallBlockProps) {
  const [name, setName] = useState(functionName)
  const [showFunctions, setShowFunctions] = useState(false)

  useEffect(() => {
    if (functionName !== name) {
      setName(functionName)
    }
  }, [functionName])

  const handleNameChange = (text: string) => {
    setName(text)
    onFunctionNameChange(text)
  }

  const selectFunction = (funcName: string) => {
    setName(funcName)
    onFunctionNameChange(funcName)
    setShowFunctions(false)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Вызов функции</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.label}>Функция:</Text>
          <TouchableOpacity style={styles.functionSelector} onPress={() => setShowFunctions(!showFunctions)}>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={handleNameChange}
              placeholder="Имя функции"
              autoCapitalize="none"
            />
          </TouchableOpacity>
          {showFunctions && availableFunctions.length > 0 && (
            <View style={styles.functionsDropdown}>
              <ScrollView style={{ maxHeight: isPhone ? undefined : 150 }}>
                {availableFunctions.map((funcName) => (
                  <TouchableOpacity
                    key={funcName}
                    style={styles.functionOption}
                    onPress={() => selectFunction(funcName)}
                  >
                    <Text>{funcName}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#9C27B0",
    borderRadius: 8,
    marginBottom: 12,
    overflow: "visible",
    position: "relative",
    zIndex: 1,
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
    position: "relative",
  },
  label: {
    color: "white",
    width: 80,
    marginRight: 8,
  },
  functionSelector: {
    flex: 1,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 4,
    padding: 8,
  },
  functionsDropdown: {
    position: "absolute",
    top: 40,
    left: 88,
    right: 0,
    backgroundColor: "white",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    zIndex: 100,
  },
  functionOption: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
})
