import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { styles } from '../styles';
import { BlockType } from '../types';
import { DraggableBlock } from './DraggableBlock';

interface BlocksAreaProps {
  selectedCategory: string;
  blocks: BlockType[];
  onBlockDrop: (block: BlockType, x: number, y: number) => void;
  workspaceLayout: { x: number, y: number, width: number, height: number };
}

export const BlocksArea = ({ 
  selectedCategory, 
  blocks, 
  onBlockDrop,
  workspaceLayout,
}: BlocksAreaProps) => {
  const filteredBlocks = blocks.filter(block => block.category === selectedCategory);
  
  return (
    <View style={styles.blocksArea}>
      <Text style={styles.blocksAreaTitle}>{selectedCategory}</Text>
      <ScrollView style={styles.blocksList}>
        {filteredBlocks.map((block) => (
          <DraggableBlock 
            key={block.id} 
            block={block} 
            onDrop={onBlockDrop}
            workspaceLayout={workspaceLayout}
          />
        ))}
      </ScrollView>
    </View>
  );
}; 