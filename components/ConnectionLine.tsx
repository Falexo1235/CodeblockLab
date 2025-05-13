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

  const midY = startY + (endY - startY) / 2
  const path = `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%">
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