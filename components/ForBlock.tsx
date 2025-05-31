import { useEffect, useState } from "react"
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

const isPhone = Platform.OS === "android" || Platform.OS === "ios"

interface ForBlockProps {
  initialization: string
  condition: string
  operator: string
  iteration: string
  onInitializationChange: (init: string) => void
  onConditionChange: (condition: string) => void
  onOperatorChange: (operator: string) => void
  onIterationChange: (iteration: string) => void
  variables: string[]
  blockId: string
  leftInputConnected?: boolean
  rightInputConnected?: boolean
}

export function ForBlock({
  initialization,
  condition,
  operator,
  iteration,
  onInitializationChange,
  onConditionChange,
  onOperatorChange,
  onIterationChange,
  variables,
  blockId,
  leftInputConnected = false,
  rightInputConnected = false,
}: ForBlockProps) {
  const [initValue, setInitValue] = useState(initialization)
  const [leftValue, setLeftValue] = useState(condition.split(" ")[0] || "")
  const [selectedOperator, setSelectedOperator] = useState(operator)
  const [rightValue, setRightValue] = useState(condition.split(" ")[2] || "")
  const [iterValue, setIterValue] = useState(iteration)

  const [showOperators, setShowOperators] = useState(false)
  const [showLeftVariables, setShowLeftVariables] = useState(false)
  const [showRightVariables, setShowRightVariables] = useState(false)

  useEffect(() => {
    if (initialization !== initValue) setInitValue(initialization)
    if (iteration !== iterValue) setIterValue(iteration)

    const parts = condition.split(" ")
    if (parts.length >= 3) {
      if (parts[0] !== leftValue) setLeftValue(parts[0])
      if (parts[2] !== rightValue) setRightValue(parts[2])
    } else { 
        if (leftValue !== "") setLeftValue("");
        if (rightValue !== "") setRightValue("");
    }
    if (operator !== selectedOperator) setSelectedOperator(operator)

  }, [initialization, condition, operator, iteration])

  const operators = ["<", ">", "==", "!=", "<=", ">="]

  const updateFullCondition = (left: string, op: string, right: string) => {
    const newCondition = `${left} ${op} ${right}`
    onConditionChange(newCondition)
  }

  const handleInitChange = (text: string) => {
    setInitValue(text)
    onInitializationChange(text)
  }

  const handleLeftChange = (text: string) => {
    setLeftValue(text)
    updateFullCondition(text, selectedOperator, rightValue)
  }

  const handleOperatorChange = (op: string) => {
    setSelectedOperator(op)
    onOperatorChange(op)
    updateFullCondition(leftValue, op, rightValue)
    setShowOperators(false)
  }

  const handleRightChange = (text: string) => {
    setRightValue(text)
    updateFullCondition(leftValue, selectedOperator, text)
  }

  const handleIterChange = (text: string) => {
    setIterValue(text)
    onIterationChange(text)
  }

  const selectVariable = (side: "left" | "right", name: string) => {
    if (side === "left") {
      setLeftValue(name)
      updateFullCondition(name, selectedOperator, rightValue)
      setShowLeftVariables(false)
    } else {
      setRightValue(name)
      updateFullCondition(leftValue, selectedOperator, name)
      setShowRightVariables(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Цикл (FOR)</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.label}>Инит.:</Text>
          <TextInput
            style={styles.inputWide}
            value={initValue}
            onChangeText={handleInitChange}
            placeholder="напр. i = 0"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Условие:</Text>
          <TouchableOpacity style={styles.inputContainer} onPress={() => setShowLeftVariables(!showLeftVariables)}>
            <TextInput
              style={[styles.input, leftInputConnected && styles.disabledInput]}
              value={leftValue}
              onChangeText={handleLeftChange}
              placeholder="Перем/число"
              autoCapitalize="none"
            />
            {showLeftVariables && variables.length > 0 && !leftInputConnected && (
              <View style={styles.variablesDropdown}>
                <ScrollView style={{ maxHeight: isPhone ? undefined : 150 }}>
                  {variables.map((name) => (
                    <TouchableOpacity key={name} style={styles.variableOption} onPress={() => selectVariable("left", name)}>
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
                <ScrollView style={{ maxHeight: isPhone ? undefined : 150 }}>
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
              style={[styles.input, rightInputConnected && styles.disabledInput]}
              value={rightValue}
              onChangeText={handleRightChange}
              placeholder="Перем/число"
              autoCapitalize="none"
            />
            {showRightVariables && variables.length > 0 && !rightInputConnected && (
              <View style={styles.variablesDropdown}>
                <ScrollView style={{ maxHeight: isPhone ? undefined : 150 }}>
                  {variables.map((name) => (
                    <TouchableOpacity key={name} style={styles.variableOption} onPress={() => selectVariable("right", name)}>
                      <Text>{name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Шаг:</Text>
          <TextInput
            style={styles.inputWide}
            value={iterValue}
            onChangeText={handleIterChange}
            placeholder="напр. i = i + 1"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.pathsContainer}>
          <View style={styles.pathIndicator}>
            <Text style={styles.pathText}>Тело цикла</Text>
          </View>
          <View style={styles.pathIndicator}>
            <Text style={styles.pathText}>Выход</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#00BCD4", 
    borderRadius: 8,
    marginBottom: 0,
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
    zIndex: 2, 
  },
  label: {
    color: "white",
    width: 60, 
    marginRight: 4,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 6,
    flex: 1, 
  },
  inputWide: { 
    flex: 1,
    backgroundColor: "white",
    borderRadius: 4,
    padding: 8,
  },
  disabledInput: {
    backgroundColor: "#E0E0E0",
    color: "#666",
  },
  inputContainer: { 
    flex: 1,
    position: "relative",
    marginHorizontal: 2,
  },
  operatorContainer: {
    position: "relative",
    zIndex: 3, 
    marginHorizontal: 2,
  },
  operatorSelector: {
    backgroundColor: "white",
    borderRadius: 4,
    padding: 8,
    width: 45, 
    alignItems: "center",
  },
  operatorText: {
    fontWeight: "bold",
  },
  operatorsDropdown: {
    position: "absolute",
    top: 40, 
    left: 0,
    width: 60,
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
    left: 0,
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
  pathsContainer: {
    flexDirection: "row",
    justifyContent: "space-around", 
    marginTop: 10,
  },
  pathIndicator: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: "center",
    minWidth: 100, 
  },
  pathText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
}) 