import { StyleSheet, View } from "react-native"
import Svg, { Path } from "react-native-svg"

interface ConnectionLineProps {
  startX: number
  startY: number
  endX: number
  endY: number
  color?: string
  isTrue?: boolean
}

export function ConnectionLine({ startX, startY, endX, endY, color = "#2A2A2A", isTrue }: ConnectionLineProps) {
  if (!isFinite(startX) || !isFinite(startY) || !isFinite(endX) || !isFinite(endY)) {
    return null;
  }

  const maxSize = 5000;
  if (Math.abs(startX) > maxSize || Math.abs(startY) > maxSize || 
      Math.abs(endX) > maxSize || Math.abs(endY) > maxSize) {
    return null;
  }

  const minX = Math.min(startX, endX) - 10;
  const minY = Math.min(startY, endY) - 10;
  const maxX = Math.max(startX, endX) + 10;
  const maxY = Math.max(startY, endY) + 10;
  
  const width = maxX - minX;
  const height = maxY - minY;

  if (width <= 0 || height <= 0 || width > 2000 || height > 2000) {
    return null;
  }

  const midY = startY + (endY - startY) / 2;
  const path = `M ${startX - minX} ${startY - minY} C ${startX - minX} ${midY - minY}, ${endX - minX} ${midY - minY}, ${endX - minX} ${endY - minY}`;

  return (
    <View style={[StyleSheet.absoluteFill, { left: minX, top: minY, width, height }]} pointerEvents="none">
      <Svg width={width} height={height}>
        <Path
          d={path}
          stroke={isTrue === true ? "#4CAF50" : isTrue === false ? "#F44336" : color}
          strokeWidth={2}
          fill="none"
          strokeDasharray={isTrue === undefined ? undefined : "5,5"}
        />
      </Svg>
    </View>
  )
}