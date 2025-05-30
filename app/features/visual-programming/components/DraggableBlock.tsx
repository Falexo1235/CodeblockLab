import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { styles } from '../styles';
import { BlockType } from '../types';

interface DraggableBlockProps {
  block: BlockType;
  onDrop: (block: BlockType, x: number, y: number) => void;
  workspaceLayout: { x: number, y: number, width: number, height: number };
  workspaceRef: React.RefObject<View | null>;
  isPortrait: boolean;
  onBlockPress?: (block: BlockType) => void;
}

export const DraggableBlock = ({ 
  block, 
  onDrop,
  workspaceLayout,
  workspaceRef,
  isPortrait,
  onBlockPress
}: DraggableBlockProps) => {
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { absoluteX, absoluteY } = event.nativeEvent;

      if (
        absoluteX > workspaceLayout.x && 
        absoluteX < workspaceLayout.x + workspaceLayout.width &&
        absoluteY > workspaceLayout.y && 
        absoluteY < workspaceLayout.y + workspaceLayout.height
      ) {

        if (workspaceRef.current) {
          workspaceRef.current.measure((fx, fy, width, height, px, py) => {

            const dropX = absoluteX - px;
            const dropY = absoluteY - py;

            const centeredX = Math.max(0, dropX - 150) 
            const centeredY = Math.max(0, dropY - 40) 

            onDrop(block, centeredX, centeredY)
          })
        } else {

          const dropX = absoluteX - workspaceLayout.x
          const dropY = absoluteY - workspaceLayout.y
          onDrop(block, dropX, dropY)
        }
      }
      
      offsetX.value = withSpring(0);
      offsetY.value = withSpring(0);
      scale.value = withSpring(1);
      opacity.value = withTiming(1);
    }
  };
  
  const onGestureEvent = (event: any) => {
    offsetX.value = event.nativeEvent.translationX;
    offsetY.value = event.nativeEvent.translationY;
    
    scale.value = withSpring(1.05);
    opacity.value = 0.8;
  };
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offsetX.value },
        { translateY: offsetY.value },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    };
  });
  
  const handlePress = () => {
    if (isPortrait && onBlockPress) {
      onBlockPress(block)
    }
  }

  if (isPortrait) {
    return (
      <TouchableOpacity
        style={[styles.blockContainer, { backgroundColor: block.color }]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Text style={styles.blockTitle}>{block.title}</Text>
        <Text style={styles.blockDescription}>{block.description}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      <Animated.View 
        style={[
          styles.blockContainer, 
          { backgroundColor: block.color }, 
          animatedStyle
        ]}
      >
        <Text style={styles.blockTitle}>{block.title}</Text>
        <Text style={styles.blockDescription}>{block.description}</Text>
      </Animated.View>
    </PanGestureHandler>
  );
};

export default DraggableBlock; 