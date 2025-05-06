import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';
import { PlacedBlockType } from '../types';
import { PlacedBlock } from './PlacedBlock';

interface WorkspaceProps {
  placedBlocks: PlacedBlockType[];
  onClearWorkspace: () => void;
  onUpdateBlockPosition: (instanceId: string, x: number, y: number) => void;
  workspaceRef: React.RefObject<View | null>;
  onWorkspaceLayout: (event: any) => void;
}

export const Workspace = ({ 
  placedBlocks, 
  onClearWorkspace,
  onUpdateBlockPosition,
  workspaceRef,
  onWorkspaceLayout,
}: WorkspaceProps) => {
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
      <View style={styles.workspace}>
        {placedBlocks.map(block => (
          <PlacedBlock 
            key={block.instanceId} 
            block={block} 
            onUpdatePosition={onUpdateBlockPosition}
          />
        ))}
      </View>
    </View>
  );
}; 