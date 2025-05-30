import { ConnectionLine } from '@/components/ConnectionLine';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';
import { PlacedBlockType } from '../types';

interface WorkspaceProps {
  placedBlocks: PlacedBlockType[];
  onClearWorkspace: () => void;
  onUpdateBlockPosition: (instanceId: string, x: number, y: number) => void;
  workspaceRef: React.RefObject<View | null>;
  onWorkspaceLayout: (event: any) => void;
  onBlockDrop: (x: number, y: number, block: any) => void;
  children?: React.ReactNode;
}

export const Workspace = ({ 
  placedBlocks, 
  onClearWorkspace,
  onUpdateBlockPosition,
  workspaceRef,
  onWorkspaceLayout,
  onBlockDrop,
  children,
}: WorkspaceProps) => {

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
      onLayout={onWorkspaceLayout}
    >
      <View style={styles.workspaceHeader}>
        <Text style={styles.workspaceTitle}>Рабочая область</Text>
        {placedBlocks.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={onClearWorkspace}
          >
            <Text style={styles.clearButtonText}>Очистить все</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView>
      <ScrollView
        style={styles.workspaceScrollView}
        contentContainerStyle={styles.workspaceScrollContent}
        horizontal={true}
      >
        <View style={styles.workspace}>
          {renderConnectionLines()}
          {children}
          {placedBlocks.length === 0 && (
            <Text style={styles.emptyWorkspaceText}>Перетащите блоки сюда, чтобы создать программу</Text>
          )}
        </View>
      </ScrollView>
      </ScrollView>
    </View>
  );
};

export default Workspace; 