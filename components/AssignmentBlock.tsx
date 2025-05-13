import { useEffect, useState } from "react"
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

interface AssignmentBlockProps {
  variable: string
  value: string
  onVariableChange: (variable: string) => void
  onValueChange: (value: string) => void
  variables: string[]
  blockId: string
  valueInputConnected?: boolean
}

export function AssignmentBlock({
  variable,
  value,
  onVariableChange,
  onValueChange,
  variables,
  blockId,
  valueInputConnected = false,
}: AssignmentBlockProps) {
  const [variableName, setVariableName] = useState(variable)
  const [assignValue, setAssignValue] = useState(value)
  const [showVariables, setShowVariables] = useState(false)

  useEffect(() => {
    if (variable !== variableName) {
      setVariableName(variable)
    }
    if (value !== assignValue) {
      setAssignValue(value)
    }
  }, [variable, value])

  const handleVariableChange = (text: string) => {
    setVariableName(text)
    onVariableChange(text)
  }

  const handleValueChange = (text: string) => {
    setAssignValue(text)
    onValueChange(text)
  }

  const selectVariable = (name: string) => {
    setVariableName(name)
    onVariableChange(name)
    setShowVariables(false)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Присваивание</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.label}>Переменная:</Text>
          <TouchableOpacity style={styles.variableSelector} onPress={() => setShowVariables(!showVariables)}>
            <TextInput
              style={styles.input}
              value={variableName}
              onChangeText={handleVariableChange}
              placeholder="Имя переменной"
            />
          </TouchableOpacity>
          {showVariables && variables.length > 0 && (
            <View style={styles.variablesDropdown}>
              <ScrollView style={{ maxHeight: 150 }}>
                {variables.map((name) => (
                  <TouchableOpacity key={name} style={styles.variableOption} onPress={() => selectVariable(name)}>
                    <Text>{name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Значение:</Text>
          <TextInput
            style={[styles.input, valueInputConnected && styles.disabledInput]}
            value={assignValue}
            onChangeText={handleValueChange}
            placeholder="Введите значение"
            keyboardType="numeric"
            editable={!valueInputConnected}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2196F3",
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
    marginBottom: 8,
    position: "relative",
  },
  label: {
    color: "white",
    width: 100,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 4,
    padding: 8,
    marginLeft: 8,
  },
  disabledInput: {
    backgroundColor: "#E0E0E0",
    color: "#666",
  },
  variableSelector: {
    flex: 1,
  },
  variablesDropdown: {
    position: "absolute",
    top: 40,
    left: 100,
    right: 0,
    backgroundColor: "white",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    zIndex: 100,
  },
  variableOption: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
})
