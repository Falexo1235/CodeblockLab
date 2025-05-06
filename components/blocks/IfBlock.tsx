"use client"

import { ThemedText } from "@/components/ThemedText"
import { useState } from "react"
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native"

interface IfBlockProps {
  condition: string
  operator: string
}

export function IfBlock({ condition, operator }: IfBlockProps) {
  const [leftValue, setLeftValue] = useState(condition.split(" ")[0])
  const [selectedOperator, setSelectedOperator] = useState(operator)
  const [rightValue, setRightValue] = useState(condition.split(" ")[2])
  const [showOperators, setShowOperators] = useState(false)
  const [operatorLayout, setOperatorLayout] = useState({ x: 0, y: 0, width: 0, height: 0 })

  const operators = ["<", ">", "==", "!=", "<=", ">=", "===", "!=="]

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Условие (if)</ThemedText>
      </View>
      <View style={styles.content}>
        <View style={styles.row}>
          <TextInput style={styles.input} value={leftValue} onChangeText={setLeftValue} placeholder="Значение 1" />
          <TouchableOpacity
            style={styles.operatorSelector}
            onPress={() => setShowOperators(!showOperators)}
            onLayout={(event) => {
              const { x, y, width, height } = event.nativeEvent.layout
              setOperatorLayout({ x, y, width, height })
            }}
          >
            <ThemedText style={styles.operatorText}>{selectedOperator}</ThemedText>
          </TouchableOpacity>
          <TextInput style={styles.input} value={rightValue} onChangeText={setRightValue} placeholder="Значение 2" />
        </View>
        <View style={styles.thenBlock}>
          <ThemedText style={styles.thenText}>Тогда:</ThemedText>
          <View style={styles.placeholder}>
            <ThemedText style={styles.placeholderText}>Placeholder</ThemedText>
          </View>
        </View>
      </View>

      {showOperators && (
        <View
          style={[
            styles.dropdownContainer,
            {
              position: "absolute",
              top: operatorLayout.y + operatorLayout.height,
              left: operatorLayout.x,
            },
          ]}
        >
          <ScrollView
            style={styles.operatorsScrollView}
            contentContainerStyle={styles.operatorsScrollViewContent}
            nestedScrollEnabled={true}
          >
            {operators.map((op) => (
              <TouchableOpacity
                key={op}
                style={styles.operatorOption}
                onPress={() => {
                  setSelectedOperator(op)
                  setShowOperators(false)
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
    backgroundColor: "#9C27B0",
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
    marginBottom: 12,
    position: "relative"
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 4,
    padding: 8,
    marginHorizontal: 4
  },
  operatorSelector: {
    backgroundColor: "white",
    borderRadius: 4,
    padding: 8,
    marginHorizontal: 4,
    width: 40,
    alignItems: "center"
  },
  operatorText: {
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
  operatorsScrollView: {
    maxHeight: 150,
  },
  operatorsScrollViewContent: {
    flexGrow: 1,
  },
  operatorOption: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    width: "100%",
    alignItems: "center"
  },
  thenBlock: {
    marginTop: 8
  },
  thenText: {
    color: "white",
    fontWeight: "bold",
    marginBottom: 8
  },
  placeholder: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 4,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "white"
  },
  placeholderText: {
    color: "white",
    fontStyle: "italic"
  }
})
