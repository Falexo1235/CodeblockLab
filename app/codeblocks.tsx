"use client"

import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { ArithmeticBlock } from "@/components/blocks/ArithmeticBlock"
import { AssignmentBlock } from "@/components/blocks/AssignmentBlock"
import { IfBlock } from "@/components/blocks/IfBlock"
import { VariableBlock } from "@/components/blocks/VariableBlock"
import { useState } from "react"
import { Modal, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"

export default function CodeBlocksScreen() {
  const [modalVisible, setModalVisible] = useState(false)

  // Sample blocks for demonstration
  const blocks = [
    { id: "1", type: "variable", name: "counter" },
    { id: "2", type: "assignment", variable: "counter", operation: "=", value: "0" },
    { id: "3", type: "arithmetic", left: "counter", operation: "+", right: "1" },
    { id: "4", type: "variable", name: "result" },
    { id: "5", type: "assignment", variable: "result", operation: "=", value: "counter" },
    { id: "6", type: "if", condition: "counter > 5", operator: ">" },
  ]

  const renderBlock = (block) => {
    switch (block.type) {
      case "variable":
        return <VariableBlock key={block.id} name={block.name} />
      case "assignment":
        return (
          <AssignmentBlock
            key={block.id}
            variable={block.variable}
            value={block.value}
          />
        )
      case "arithmetic":
        return (
          <ArithmeticBlock
            key={block.id}
            left={block.left}
            operation={block.operation}
            right={block.right}
          />
        )
      case "if":
        return (
          <IfBlock
            key={block.id}
            condition={block.condition}
            operator={block.operator}
          />
        )
      default:
        return null
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Блоки кода</ThemedText>
      </ThemedView>

      <ScrollView style={styles.blockList} contentContainerStyle={styles.blockListContent}>
        {blocks.map((block) => renderBlock(block))}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <ThemedText style={styles.addButtonText}>+</ThemedText>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText type="subtitle" style={styles.modalTitle}>
              Добавить блок
            </ThemedText>

            <TouchableOpacity style={[styles.blockOption, { backgroundColor: "#4CAF50" }]}>
              <ThemedText style={styles.blockOptionText}>Объявить переменную</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.blockOption, { backgroundColor: "#2196F3" }]}>
              <ThemedText style={styles.blockOptionText}>Присвоить значение</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.blockOption, { backgroundColor: "#FF9800" }]}>
              <ThemedText style={styles.blockOptionText}>Арифметическая операция</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.blockOption, { backgroundColor: "#9C27B0" }]}>
              <ThemedText style={styles.blockOptionText}>Условие (if)</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <ThemedText style={styles.closeButtonText}>Закрыть</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  blockList: {
    flex: 1,
  },
  blockListContent: {
    padding: 16,
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0a7ea4",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonText: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 20,
  },
  blockOption: {
    width: "100%",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  blockOptionText: {
    color: "white",
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
  },
  closeButtonText: {
    color: "#0a7ea4",
    fontWeight: "bold",
  },
  dropdownPortal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
    zIndex: 10000,
  },
})
