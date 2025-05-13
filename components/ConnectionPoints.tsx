import { StyleSheet, TouchableOpacity, View } from "react-native"
import type { ConnectionPoint } from "../app/features/visual-programming/types"

interface ConnectionPointsProps {
  blockType: string
  blockId: string
  onConnectionPointPress: (point: ConnectionPoint) => void
  isConnecting: boolean
  activeConnectionPoint?: ConnectionPoint | null
  hasTopConnection?: boolean
  hasBottomConnection?: boolean
  hasTrueConnection?: boolean
  hasFalseConnection?: boolean
  hasOutputConnection?: boolean
  hasValueInputConnection?: boolean
  hasLeftInputConnection?: boolean
  hasRightInputConnection?: boolean
  valueInputConnected?: boolean
  leftInputConnected?: boolean
  rightInputConnected?: boolean
}

export function ConnectionPoints({
  blockType,
  blockId,
  onConnectionPointPress,
  isConnecting,
  activeConnectionPoint,
  hasTopConnection = false,
  hasBottomConnection = false,
  hasTrueConnection = false,
  hasFalseConnection = false,
  hasOutputConnection = false,
  hasValueInputConnection = false,
  hasLeftInputConnection = false,
  hasRightInputConnection = false,
  valueInputConnected = false,
  leftInputConnected = false,
  rightInputConnected = false,
}: ConnectionPointsProps) {
  const handlePress = (
    type: "top" | "bottom" | "true" | "false" | "output" | "valueInput" | "leftInput" | "rightInput",
    inputField?: "value" | "left" | "right",
  ) => {
    onConnectionPointPress({
      type,
      x: 0,
      y: 0,
      width: 20,
      height: 10,
      blockId,
      inputField,
    })
  }

  const isIfBlock = blockType === "if"
  const isWhileBlock = blockType === "while"
  const isStartBlock = blockType === "start"
  const isEndBlock = blockType === "end"
  const isArithmeticBlock = blockType === "arithmetic"
  const isAssignmentBlock = blockType === "assignment"

  const isActivePoint = (
    type: "top" | "bottom" | "true" | "false" | "output" | "valueInput" | "leftInput" | "rightInput",
  ) => {
    return (
      isConnecting &&
      activeConnectionPoint &&
      activeConnectionPoint.blockId === blockId &&
      activeConnectionPoint.type === type
    )
  }

  return (
    <View style={styles.container} pointerEvents="box-none">
      {!isStartBlock && !isArithmeticBlock && (
        <TouchableOpacity
          style={[
            styles.topPoint,
            isActivePoint("top") && styles.activePoint,
            hasTopConnection && styles.connectedPoint,
          ]}
          onPress={() => handlePress("top")}
        />
      )}

      {!isEndBlock && !isIfBlock && !isWhileBlock && !isArithmeticBlock && (
        <TouchableOpacity
          style={[
            styles.bottomPoint,
            isActivePoint("bottom") && styles.activePoint,
            hasBottomConnection && styles.connectedPoint,
          ]}
          onPress={() => handlePress("bottom")}
        />
      )}

      {(isIfBlock || isWhileBlock) && (
        <>
          <TouchableOpacity
            style={[
              styles.truePoint,
              isActivePoint("true") && styles.activePoint,
              hasTrueConnection && styles.connectedTruePoint,
            ]}
            onPress={() => handlePress("true")}
          />
          <TouchableOpacity
            style={[
              styles.falsePoint,
              isActivePoint("false") && styles.activePoint,
              hasFalseConnection && styles.connectedFalsePoint,
            ]}
            onPress={() => handlePress("false")}
          />

          <TouchableOpacity
            style={[
              styles.leftInputPoint,
              isActivePoint("leftInput") && styles.activePoint,
              leftInputConnected && styles.connectedInputPoint,
            ]}
            onPress={() => handlePress("leftInput", "left")}
          />
          <TouchableOpacity
            style={[
              styles.rightInputPoint,
              isActivePoint("rightInput") && styles.activePoint,
              rightInputConnected && styles.connectedInputPoint,
            ]}
            onPress={() => handlePress("rightInput", "right")}
          />
        </>
      )}

      {isArithmeticBlock && (
        <TouchableOpacity
          style={[styles.outputPoint, isActivePoint("output") && styles.activePoint]}
          onPress={() => handlePress("output")}
        />
      )}

      {isAssignmentBlock && (
        <TouchableOpacity
          style={[
            styles.valueInputPoint,
            isActivePoint("valueInput") && styles.activePoint,
            valueInputConnected && styles.connectedInputPoint,
          ]}
          onPress={() => handlePress("valueInput", "value")}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
  topPoint: {
    position: "absolute",
    top: -5,
    left: "50%",
    marginLeft: -10,
    width: 20,
    height: 10,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 5,
  },
  bottomPoint: {
    position: "absolute",
    bottom: -5,
    left: "50%",
    marginLeft: -10,
    width: 20,
    height: 10,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 5,
  },
  truePoint: {
    position: "absolute",
    bottom: -5,
    left: "25%",
    marginLeft: -10,
    width: 20,
    height: 10,
    backgroundColor: "rgba(0, 255, 0, 0.3)",
    borderRadius: 5,
  },
  falsePoint: {
    position: "absolute",
    bottom: -5,
    right: "25%",
    marginRight: -10,
    width: 20,
    height: 10,
    backgroundColor: "rgba(255, 0, 0, 0.3)",
    borderRadius: 5,
  },
  outputPoint: {
    position: "absolute",
    right: -10,
    top: "50%",
    marginTop: -10,
    width: 10,
    height: 20,
    backgroundColor: "rgba(255, 165, 0, 0.6)",
    borderRadius: 5,
  },
  valueInputPoint: {
    position: "absolute",
    right: -10,
    top: "60%",
    marginTop: -10,
    width: 10,
    height: 20,
    backgroundColor: "rgba(0, 0, 255, 0.3)",
    borderRadius: 5,
  },
  leftInputPoint: {
    position: "absolute",
    left: -10,
    top: "40%",
    marginTop: -10,
    width: 10,
    height: 20,
    backgroundColor: "rgba(0, 0, 255, 0.3)",
    borderRadius: 5,
  },
  rightInputPoint: {
    position: "absolute",
    right: -10,
    top: "40%",
    marginTop: -10,
    width: 10,
    height: 20,
    backgroundColor: "rgba(0, 0, 255, 0.3)",
    borderRadius: 5,
  },
  activePoint: {
    backgroundColor: "rgba(0, 0, 255, 0.5)",
    transform: [{ scale: 1.2 }],
  },
  connectedPoint: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderWidth: 1,
    borderColor: "#FFF",
  },
  connectedTruePoint: {
    backgroundColor: "rgba(0, 255, 0, 0.6)",
    borderWidth: 1,
    borderColor: "#FFF",
  },
  connectedFalsePoint: {
    backgroundColor: "rgba(255, 0, 0, 0.6)",
    borderWidth: 1,
    borderColor: "#FFF",
  },
  connectedInputPoint: {
    backgroundColor: "rgba(0, 0, 255, 0.6)",
    borderWidth: 1,
    borderColor: "#FFF",
  },
})
