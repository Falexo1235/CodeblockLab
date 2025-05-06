"use client"

import { ThemedText } from "@/components/ThemedText"
import { useState } from "react"
import { StyleSheet, TextInput, View } from "react-native"

interface AssignmentBlockProps {
  variable: string
  value: string
}

export function AssignmentBlock({ variable, value }: AssignmentBlockProps) {
  const [variableName, setVariableName] = useState(variable)
  const [assignValue, setAssignValue] = useState(value)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Присваивание</ThemedText>
      </View>
      <View style={styles.content}>
        <View style={styles.row}>
          <ThemedText style={styles.label}>Переменная:</ThemedText>
          <TextInput
            style={styles.input}
            value={variableName}
            onChangeText={setVariableName}
            placeholder="Имя переменной"
          />
        </View>   
        <View style={styles.row}>
          <ThemedText style={styles.label}>Значение:</ThemedText>
          <TextInput
            style={styles.input}
            value={assignValue}
            onChangeText={setAssignValue}
            placeholder="Введите значение"
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
    zIndex: 1
  },
  header: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    padding: 8
  },
  title: {
    color: "white",
    fontWeight: "bold"
  },
  content: {
    padding: 12
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    position: "relative"
  },
  label: {
    color: "white",
    width: 100
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 4,
    padding: 8,
    marginLeft: 8
  },
  operationSelector: {
    backgroundColor: "white",
    borderRadius: 4,
    padding: 8,
    marginLeft: 8,
    width: 50,
    alignItems: "center"
  },
  operationText: {
    fontWeight: "bold"
  },
  dropdownContainer: {
    backgroundColor: "white",
    borderRadius: 4,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    zIndex: 9999,
    width: 70,
    position: "fixed"
  },
  operationsScrollView: {
    maxHeight: 150
  },
  operationsScrollViewContent: {
    flexGrow: 1
  },
  operationOption: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    width: "100%",
    alignItems: "center"
  }
})
