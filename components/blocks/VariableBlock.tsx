"use client"

import { ThemedText } from "@/components/ThemedText"
import { useState } from "react"
import { StyleSheet, TextInput, View } from "react-native"

interface VariableBlockProps {
  name: string
}

export function VariableBlock({ name }: VariableBlockProps) {
  const [variableName, setVariableName] = useState(name)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Создать переменную</ThemedText>
      </View>
      <View style={styles.content}>
        <View style={styles.row}>
          <ThemedText style={styles.label}>Имя:</ThemedText>
          <TextInput
            style={styles.input}
            value={variableName}
            onChangeText={setVariableName}
            placeholder="Введите имя"
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
    overflow: "hidden"
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
    marginBottom: 8
  },
  label: {
    color: "white",
    width: 80
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 4,
    padding: 8,
    marginLeft: 8
  }
})
