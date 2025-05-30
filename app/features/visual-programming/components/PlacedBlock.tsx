import React from 'react';
import { Text } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
import { styles } from '../styles';
import { PlacedBlockType } from '../types';

interface PlacedBlockProps {
  block: PlacedBlockType;
  onUpdatePosition: (instanceId: string, x: number, y: number) => void;
}

export const PlacedBlock = ({ 
  block, 
  onUpdatePosition 
}: PlacedBlockProps) => {
  const offsetX = useSharedValue(block.x);
  const offsetY = useSharedValue(block.y);
  
  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      onUpdatePosition(
        block.instanceId, 
        offsetX.value, 
        offsetY.value
      );
    }
  };
  
  const onGestureEvent = (event: any) => {
    offsetX.value = block.x + event.nativeEvent.translationX;
    offsetY.value = block.y + event.nativeEvent.translationY;
  };
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offsetX.value },
        { translateY: offsetY.value },
      ],
      position: 'absolute',
      left: 0,
      top: 0,
    };
  });
  
  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      <Animated.View 
        style={[
          styles.blockContainer, 
          { backgroundColor: block.color, width: 180 }, 
          animatedStyle
        ]}
      >
        <Text style={styles.blockTitle}>{block.title}</Text>
      </Animated.View>
    </PanGestureHandler>
  );
};

export default PlacedBlock; 