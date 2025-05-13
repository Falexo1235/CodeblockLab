import { useEffect, useState } from "react"
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

interface IfBlockProps {
  condition: string
  operator: string
  onConditionChange: (condition: string) => void
  onOperatorChange: (operator: string) => void
  variables: string[]
}

export function IfBlock({ condition, operator, onConditionChange, onOperatorChange, variables }: IfBlockProps) {
  const [leftValue, setLeftValue] = useState(condition.split(" ")[0] || "")
  const [selectedOperator, setSelectedOperator] = useState(operator)
  const [rightValue, setRightValue] = useState(condition.split(" ")[2] || "")
  const [showOperators, setShowOperators] = useState(false)
  const [showLeftVariables, setShowLeftVariables] = useState(false)
  const [showRightVariables, setShowRightVariables] = useState(false)

  useEffect(() => {
    const parts = condition.split(" ")
    if (parts.length >= 3) {
      if (parts[0] !== leftValue) {
        setLeftValue(parts[0])
      }
      if (parts[2] !== rightValue) {
        setRightValue(parts[2])
      }
    }
    if (operator !== selectedOperator) {
      setSelectedOperator(operator)
    }
  }, [condition, operator])

  const operators = ["<", ">", "==", "!=", "<=", ">="]

  const updateCondition = (left: string, op: string, right: string) => {
    const newCondition = `${left} ${op} ${right}`
    onConditionChange(newCondition)
  }

  const handleLeftChange = (text: string) => {
    setLeftValue(text)
    updateCondition(text, selectedOperator, rightValue)
  }

  const handleOperatorChange = (op: string) => {
    setSelectedOperator(op)
    onOperatorChange(op)
    updateCondition(leftValue, op, rightValue)
    setShowOperators(false)
  }

  const handleRightChange = (text: string) => {
    setRightValue(text)
    updateCondition(leftValue, selectedOperator, text)
  }

  const selectVariable = (side: "left" | "right", name: string) => {
    if (side === "left") {
      setLeftValue(name)
      updateCondition(name, selectedOperator, rightValue)
      setShowLeftVariables(false)
    } else {
      setRightValue(name)
      updateCondition(leftValue, selectedOperator, name)
      setShowRightVariables(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Условие (if)</Text>
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

          <View style={styles.operatorContainer}>
            <TouchableOpacity style={styles.operatorSelector} onPress={() => setShowOperators(!showOperators)}>
              <Text style={styles.operatorText}>{selectedOperator}</Text>
            </TouchableOpacity>
            {showOperators && (
              <View style={styles.operatorsDropdown}>
                <ScrollView style={{ maxHeight: 150 }}>
                  {operators.map((op) => (
                    <TouchableOpacity key={op} style={styles.operatorOption} onPress={() => handleOperatorChange(op)}>
                      <Text>{op}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

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

        <View style={styles.thenBlock} pointerEvents="none">
          <Text style={styles.thenText}>Тогда:</Text>
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Здесь будут выполняться блоки</Text>
          </View>
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
    marginBottom: 12,
    position: "relative",
    zIndex: 2,
  },
  inputContainer: {
    flex: 1,
    position: "relative",
    zIndex: 2,
  },
  operatorContainer: {
    position: "relative",
    zIndex: 3,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 4,
    padding: 8,
    marginHorizontal: 4,
  },
  operatorSelector: {
    backgroundColor: "white",
    borderRadius: 4,
    padding: 8,
    marginHorizontal: 4,
    width: 40,
    alignItems: "center",
  },
  operatorText: {
    fontWeight: "bold",
  },
  operatorsDropdown: {
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
  operatorOption: {
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
  thenBlock: {
    marginTop: 8,
    zIndex: 1,
  },
  thenText: {
    color: "white",
    fontWeight: "bold",
    marginBottom: 8,
  },
  placeholder: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 4,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "white",
  },
  placeholderText: {
    color: "white",
    fontStyle: "italic",
  },
})
