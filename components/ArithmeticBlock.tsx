import { useEffect, useState } from "react"
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

interface ArithmeticBlockProps {
  left: string
  operation: string
  right: string
  onLeftChange: (value: string) => void
  onOperationChange: (operation: string) => void
  onRightChange: (value: string) => void
  variables: string[]
}

export function ArithmeticBlock({
  left,
  operation,
  right,
  onLeftChange,
  onOperationChange,
  onRightChange,
  variables,
}: ArithmeticBlockProps) {
  const [leftValue, setLeftValue] = useState(left)
  const [selectedOperation, setSelectedOperation] = useState(operation)
  const [rightValue, setRightValue] = useState(right)
  const [showOperations, setShowOperations] = useState(false)
  const [showLeftVariables, setShowLeftVariables] = useState(false)
  const [showRightVariables, setShowRightVariables] = useState(false)

  useEffect(() => {
    if (left !== leftValue) {
      setLeftValue(left)
    }
    if (operation !== selectedOperation) {
      setSelectedOperation(operation)
    }
    if (right !== rightValue) {
      setRightValue(right)
    }
  }, [left, operation, right])

  const operations = ["+", "-", "*", "/", "%", "**"]

  const handleLeftChange = (text: string) => {
    setLeftValue(text)
    onLeftChange(text)
  }

  const handleOperationChange = (op: string) => {
    setSelectedOperation(op)
    onOperationChange(op)
    setShowOperations(false)
  }

  const handleRightChange = (text: string) => {
    setRightValue(text)
    onRightChange(text)
  }

  const selectVariable = (side: "left" | "right", name: string) => {
    if (side === "left") {
      setLeftValue(name)
      onLeftChange(name)
      setShowLeftVariables(false)
    } else {
      setRightValue(name)
      onRightChange(name)
      setShowRightVariables(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Арифметика</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.inputContainer} onPress={() => setShowLeftVariables(!showLeftVariables)}>
            <TextInput
              style={styles.input}
              value={leftValue}
              onChangeText={handleLeftChange}
              placeholder="Значение 1"
            />
            {showLeftVariables && variables.length > 0 && (
              <View style={styles.variablesDropdown}>
                <ScrollView style={{ maxHeight: 150 }}>
                  {variables.map((name) => (
                    <TouchableOpacity
                      key={name}
                      style={styles.variableOption}
                      onPress={() => selectVariable("left", name)}
                    >
                      <Text>{name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.operationSelector} onPress={() => setShowOperations(!showOperations)}>
            <Text style={styles.operationText}>{selectedOperation}</Text>
            {showOperations && (
              <View style={styles.operationsDropdown}>
                <ScrollView style={{ maxHeight: 150 }}>
                  {operations.map((op) => (
                    <TouchableOpacity key={op} style={styles.operationOption} onPress={() => handleOperationChange(op)}>
                      <Text>{op}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.inputContainer} onPress={() => setShowRightVariables(!showRightVariables)}>
            <TextInput
              style={styles.input}
              value={rightValue}
              onChangeText={handleRightChange}
              placeholder="Значение 2"
            />
            {showRightVariables && variables.length > 0 && (
              <View style={styles.variablesDropdown}>
                <ScrollView style={{ maxHeight: 150 }}>
                  {variables.map((name) => (
                    <TouchableOpacity
                      key={name}
                      style={styles.variableOption}
                      onPress={() => selectVariable("right", name)}
                    >
                      <Text>{name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FF9800",
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
  inputContainer: {
    flex: 1,
    position: "relative",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 4,
    padding: 8,
    marginHorizontal: 4,
  },
  operationSelector: {
    backgroundColor: "white",
    borderRadius: 4,
    padding: 8,
    marginHorizontal: 4,
    width: 40,
    alignItems: "center",
    position: "relative",
  },
  operationText: {
    fontWeight: "bold",
  },
  operationsDropdown: {
    position: "absolute",
    top: 40,
    left: 0,
    width: 40,
    backgroundColor: "white",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    zIndex: 100,
  },
  operationOption: {
    padding: 8,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  variablesDropdown: {
    position: "absolute",
    top: 40,
    left: 4,
    right: 4,
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
