import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from '../styles';
import { PlacedBlockType } from '../types';

interface WorkspaceProps {
  placedBlocks: PlacedBlockType[];
  onClearWorkspace: () => void;
  onUpdateBlockPosition: (instanceId: string, x: number, y: number) => void;
  workspaceRef: React.RefObject<View | null>;
  onWorkspaceLayout: (event: any) => void;
  children?: React.ReactNode
}

export const Workspace = ({ 
  placedBlocks, 
  onClearWorkspace,
  onUpdateBlockPosition,
  workspaceRef,
  onWorkspaceLayout,
  children,
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
      <ScrollView style={styles.workspaceScrollView} contentContainerStyle={styles.workspaceScrollContent}>
      <View style={styles.workspace}>
        {children}
        {placedBlocks.length === 0 && (
          <Text style={styles.emptyWorkspaceText}>Перетащите блоки сюда, чтобы создать программу</Text>
        )}
      </View>
      </ScrollView>
    </View>
  );
}; 