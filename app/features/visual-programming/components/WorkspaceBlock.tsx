import { ArithmeticBlock } from "@/components/ArithmeticBlock"
import { AssignmentBlock } from "@/components/AssignmentBlock"
import { IfBlock } from "@/components/IfBlock"
import { VariableBlock } from "@/components/VariableBlock"
import { PanGestureHandler, State } from "react-native-gesture-handler"
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated"
import { styles } from "../styles"
import type { PlacedBlockType } from "../types"

interface WorkspaceBlockProps {
  block: PlacedBlockType
  onUpdatePosition: (instanceId: string, x: number, y: number) => void
  onUpdateBlockData: (instanceId: string, data: any) => void
  variables: string[]
}

export const WorkspaceBlock = ({ block, onUpdatePosition, onUpdateBlockData, variables }: WorkspaceBlockProps) => {
  const offsetX = useSharedValue(block.x)
  const offsetY = useSharedValue(block.y)

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      onUpdatePosition(block.instanceId, offsetX.value, offsetY.value)
    }
  }
  const onGestureEvent = (event: any) => {
    offsetX.value = block.x + event.nativeEvent.translationX
    offsetY.value = block.y + event.nativeEvent.translationY
  }
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offsetX.value }, { translateY: offsetY.value }],
      position: "absolute",
      left: 0,
      top: 0,
      zIndex: 10,
    }
  })
  const renderBlockContent = () => {
    switch (block.type) {
      case "variable":
        return (
          <VariableBlock
            name={block.data?.variableName || ""}
            onNameChange={(name) => onUpdateBlockData(block.instanceId, { variableName: name })}
          />
        )
      case "assignment":
        return (
          <AssignmentBlock
            variable={block.data?.variableName || ""}
            value={block.data?.value || ""}
            onVariableChange={(name) => onUpdateBlockData(block.instanceId, { variableName: name })}
            onValueChange={(value) => onUpdateBlockData(block.instanceId, { value })}
            variables={variables}
          />
        )
      case "arithmetic":
        return (
          <ArithmeticBlock
            left={block.data?.leftValue || ""}
            operation={block.data?.operation || "+"}
            right={block.data?.rightValue || ""}
            onLeftChange={(value) => onUpdateBlockData(block.instanceId, { leftValue: value })}
            onOperationChange={(op) => onUpdateBlockData(block.instanceId, { operation: op })}
            onRightChange={(value) => onUpdateBlockData(block.instanceId, { rightValue: value })}
            variables={variables}
          />
        )
      case "if":
        return (
          <IfBlock
            condition={block.data?.condition || ""}
            operator={block.data?.operator || "=="}
            onConditionChange={(condition) => onUpdateBlockData(block.instanceId, { condition })}
            onOperatorChange={(operator) => onUpdateBlockData(block.instanceId, { operator })}
            variables={variables}
          />
        )
      default:
        return null
    }
  }
  return (
    <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
      <Animated.View style={[styles.workspaceBlockContainer, animatedStyle]}>{renderBlockContent()}</Animated.View>
    </PanGestureHandler>
  )
}
