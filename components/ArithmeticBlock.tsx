import { useEffect, useState } from "react"
import { StyleSheet, Text, TextInput, View } from "react-native"

interface ArithmeticBlockProps {
  expression: string
  onExpressionChange: (expression: string) => void
  blockId: string
}

export function ArithmeticBlock({ expression, onExpressionChange, blockId }: ArithmeticBlockProps) {
  const [expressionValue, setExpressionValue] = useState(expression)

  useEffect(() => {
    if (expression !== expressionValue) {
      setExpressionValue(expression)
    }
  }, [expression])

  const handleExpressionChange = (text: string) => {
    setExpressionValue(text)
    onExpressionChange(text)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Арифметика</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            value={expressionValue}
            onChangeText={handleExpressionChange}
            placeholder="Введите выражение (например: 2 + 3 * x)"
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FF9800",
    borderRadius: 8,
    marginBottom: 0,
    overflow: "visible",
    position: "relative",
    zIndex: 1,
    width: 300,
  },
  header: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    padding: 8,
  },
  title: {
    color: "white",
    fontWeight: "bold",
  },
  content: {
    padding: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 4,
    padding: 8,
    marginHorizontal: 4,
  },
})
