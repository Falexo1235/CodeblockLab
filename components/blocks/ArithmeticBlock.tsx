"use client"

import { ThemedText } from "@/components/ThemedText"
import { useState } from "react"
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native"

interface ArithmeticBlockProps {
  left: string
  operation: string
  right: string
}

export function ArithmeticBlock({ left, operation, right }: ArithmeticBlockProps) {
  const [leftValue, setLeftValue] = useState(left)
  const [selectedOperation, setSelectedOperation] = useState(operation)
  const [rightValue, setRightValue] = useState(right)
  const [showOperations, setShowOperations] = useState(false)
  const [operationLayout, setOperationLayout] = useState({ x: 0, y: 0, width: 0, height: 0 })

  const operations = ["+", "-", "*", "/", "%", "**"]

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Арифметика</ThemedText>
      </View>
      <View style={styles.content}>
        <View style={styles.row}>
          <TextInput style={styles.input} value={leftValue} onChangeText={setLeftValue} placeholder="Значение 1" />
          <TouchableOpacity
            style={styles.operationSelector}
            onPress={() => setShowOperations(!showOperations)}
            onLayout={(event) => {
              const { x, y, width, height } = event.nativeEvent.layout
              setOperationLayout({ x, y, width, height })
            }}
          >
            <ThemedText style={styles.operationText}>{selectedOperation}</ThemedText>
          </TouchableOpacity>
          <TextInput style={styles.input} value={rightValue} onChangeText={setRightValue} placeholder="Значение 2" />
        </View>
      </View>

      {showOperations && (
        <View
          style={[
            styles.dropdownContainer,
            {
              position: "absolute",
              top: operationLayout.y + operationLayout.height,
              left: operationLayout.x,
            },
          ]}
        >
          <ScrollView
            style={styles.operationsScrollView}
            contentContainerStyle={styles.operationsScrollViewContent}
            nestedScrollEnabled={true}
          >
            {operations.map((op) => (
              <TouchableOpacity
                key={op}
                style={styles.operationOption}
                onPress={() => {
                  setSelectedOperation(op)
                  setShowOperations(false)
                }}
              >
                <ThemedText>{op}</ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
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
    position: "relative"
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 4,
    padding: 8,
    marginHorizontal: 4
  },
  operationSelector: {
    backgroundColor: "white",
    borderRadius: 4,
    padding: 8,
    marginHorizontal: 4,
    width: 40,
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
    width: 50,
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
