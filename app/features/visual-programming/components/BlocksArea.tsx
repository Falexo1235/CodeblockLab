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
  workspaceRef: React.RefObject<View | null>;
  isPortrait: boolean;
  onBlockPress?: (block: BlockType) => void;
}

export const BlocksArea = ({ 
  selectedCategory, 
  blocks, 
  onBlockDrop,
  workspaceLayout,
  workspaceRef,
  isPortrait,
  onBlockPress,
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
            workspaceRef={workspaceRef}
            isPortrait={isPortrait}
            onBlockPress={onBlockPress}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default BlocksArea; 