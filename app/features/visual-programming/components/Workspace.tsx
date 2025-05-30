import { ConnectionLine } from '@/components/ConnectionLine';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { styles } from '../styles';
import { PlacedBlockType } from '../types';

const WorkspaceGrid = () => {
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
      }}
    >
      {Array.from({ length: 100 }).map((_, i) => (
        <View
          key={`h-${i}`}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: i * 40,
            height: 1,
            backgroundColor: "#E0E0E0",
          }}
        />
      ))}
      {Array.from({ length: 100 }).map((_, i) => (
        <View
          key={`v-${i}`}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: i * 40,
            width: 1,
            backgroundColor: "#E0E0E0",
          }}
        />
      ))}
    </View>
  )
}

interface WorkspaceProps {
  placedBlocks: PlacedBlockType[];
  onClearWorkspace: () => void;
  onUpdateBlockPosition: (instanceId: string, x: number, y: number) => void;
  workspaceRef: React.RefObject<View | null>;
  onWorkspaceLayout: (event: any) => void;
  onBlockDrop: (x: number, y: number, block: any) => void;
  children?: React.ReactNode;
  workspaceOffset: { x: number; y: number };
  onWorkspaceOffsetChange: (offset: { x: number; y: number }) => void;
  onCenterWorkspace: () => void;
}

export const Workspace = ({ 
  placedBlocks, 
  onClearWorkspace,
  onUpdateBlockPosition,
  workspaceRef,
  onWorkspaceLayout,
  onBlockDrop,
  children,
  workspaceOffset,
  onWorkspaceOffsetChange,
  onCenterWorkspace,
}: WorkspaceProps) => {
  const offsetX = useSharedValue(workspaceOffset.x)
  const offsetY = useSharedValue(workspaceOffset.y)
  const isDragging = useRef(false)
  const containerSize = useRef({ width: 0, height: 0 })
  const [isInitialized, setIsInitialized] = useState(false)

  const getCenteredOffset = () => {
    if (containerSize.current.width === 0 || containerSize.current.height === 0) {
      return { x: 0, y: 0 }
    }

    const centerX = -containerSize.current.width * 1.5
    const centerY = -containerSize.current.height * 1.5

    return { x: centerX, y: centerY }
  }

  useEffect(() => {
    offsetX.value = workspaceOffset.x
    offsetY.value = workspaceOffset.y
  }, [workspaceOffset.x, workspaceOffset.y])

  useEffect(() => {
    if (!isInitialized && containerSize.current.width > 0 && containerSize.current.height > 0) {
      const centeredOffset = getCenteredOffset()
      onWorkspaceOffsetChange(centeredOffset)
      setIsInitialized(true)
    }
  }, [containerSize.current.width, containerSize.current.height, isInitialized])

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      isDragging.current = false
      onWorkspaceOffsetChange({
        x: offsetX.value,
        y: offsetY.value,
      })
    }
  }

  const onGestureEvent = (event: any) => {
    if (!isDragging.current) {
      isDragging.current = true
    }

    const newOffsetX = workspaceOffset.x + event.nativeEvent.translationX
    const newOffsetY = workspaceOffset.y + event.nativeEvent.translationY

    const workspaceWidth = containerSize.current.width * 4 
    const workspaceHeight = containerSize.current.height * 4

    const minVisiblePart = 100
    const maxOffsetX = containerSize.current.width - minVisiblePart
    const maxOffsetY = containerSize.current.height - minVisiblePart
    const minOffsetX = -(workspaceWidth - containerSize.current.width) - minVisiblePart
    const minOffsetY = -(workspaceHeight - containerSize.current.height) - minVisiblePart

    offsetX.value = Math.min(Math.max(newOffsetX, minOffsetX), maxOffsetX)
    offsetY.value = Math.min(Math.max(newOffsetY, minOffsetY), maxOffsetY)
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offsetX.value }, { translateY: offsetY.value }],
    }
  })

  const handleContainerLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout
    containerSize.current = { width, height }
    onWorkspaceLayout(event)
  }

  const handleCenterWorkspace = () => {
    const centeredOffset = getCenteredOffset()

    offsetX.value = withSpring(centeredOffset.x)
    offsetY.value = withSpring(centeredOffset.y)

    onCenterWorkspace()
    onWorkspaceOffsetChange(centeredOffset)
  }

  const renderConnectionLines = () => {
    const lines = []

    for (const block of placedBlocks) {

      if (block.nextBlockId) {
        const nextBlock = placedBlocks.find((b) => b.instanceId === block.nextBlockId)
        if (nextBlock) {
          lines.push(
            <ConnectionLine
              key={`${block.instanceId}-${nextBlock.instanceId}`}
              startX={block.x + 150}
              startY={block.y + 60}
              endX={nextBlock.x + 150}
              endY={nextBlock.y}
            />,
          )
        }
      }

      if ((block.type === 'if' || block.type === 'while' || block.type === 'for') && block.trueBlockId) {
        const trueBlock = placedBlocks.find((b) => b.instanceId === block.trueBlockId)
        if (trueBlock) {
          lines.push(
            <ConnectionLine
              key={`${block.instanceId}-true-${trueBlock.instanceId}`}
              startX={block.x + 75}
              startY={block.y + 120}
              endX={trueBlock.x + 150}
              endY={trueBlock.y}
              isTrue={true}
            />,
          )
        }
      }

      if ((block.type === 'if' || block.type === 'while' || block.type === 'for') && block.falseBlockId) {
        const falseBlock = placedBlocks.find((b) => b.instanceId === block.falseBlockId)
        if (falseBlock) {
          lines.push(
            <ConnectionLine
              key={`${block.instanceId}-false-${falseBlock.instanceId}`}
              startX={block.x + 225}
              startY={block.y + 120}
              endX={falseBlock.x + 150}
              endY={falseBlock.y}
              isTrue={false}
            />,
          )
        }
      }

      if (block.type === 'arithmetic') {

        const connectedBlocks = placedBlocks.filter(
          (b) =>
            b.inputConnections?.valueInputId === block.instanceId ||
            b.inputConnections?.leftInputId === block.instanceId ||
            b.inputConnections?.rightInputId === block.instanceId,
        )

        for (const connectedBlock of connectedBlocks) {
          if (connectedBlock.inputConnections?.valueInputId === block.instanceId) {

            lines.push(
              <ConnectionLine
                key={`${block.instanceId}-value-${connectedBlock.instanceId}`}
                startX={block.x + 300}
                startY={block.y + 30}
                endX={connectedBlock.x + 300}
                endY={connectedBlock.y + 60}
                color='#FF9800'
              />,
            )
          } else if (connectedBlock.inputConnections?.leftInputId === block.instanceId) {

            lines.push(
              <ConnectionLine
                key={`${block.instanceId}-left-${connectedBlock.instanceId}`}
                startX={block.x + 300}
                startY={block.y + 30}
                endX={connectedBlock.x}
                endY={connectedBlock.y + 40}
                color='#FF9800'
              />,
            )
          } else if (connectedBlock.inputConnections?.rightInputId === block.instanceId) {

            lines.push(
              <ConnectionLine
                key={`${block.instanceId}-right-${connectedBlock.instanceId}`}
                startX={block.x + 300}
                startY={block.y + 30}
                endX={connectedBlock.x + 300}
                endY={connectedBlock.y + 40}
                color='#FF9800'
              />,
            )
          }
        }
      }
    }

    return lines
  }

  return (
    <View 
      style={styles.workspaceArea} 
      ref={workspaceRef} 
      onLayout={handleContainerLayout}
    >
      <View style={styles.workspaceHeader}>
        <Text style={styles.workspaceTitle}>Рабочая область</Text>
        <View style={{ flexDirection: "row" }}>
          {placedBlocks.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={onClearWorkspace}>
              <Text style={styles.clearButtonText}>Очистить все</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.workspaceContainer}>
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
          minPointers={1}
          maxPointers={1}
        >
          <Animated.View style={[styles.workspace, animatedStyle]}>
            <WorkspaceGrid />
            {renderConnectionLines()}
            {children}
            {placedBlocks.length === 0 && (
              <Text style={styles.emptyWorkspaceText}>
                Перетащите блоки сюда, чтобы создать программу
              </Text>
            )}
          </Animated.View>
        </PanGestureHandler>

        <TouchableOpacity style={styles.centerButton} onPress={handleCenterWorkspace}>
          <Ionicons name="locate-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Workspace;