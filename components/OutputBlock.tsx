import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface OutputBlockProps {
  expression: string;
  onExpressionChange: (expression: string) => void;
  blockId: string;
  
  
}

export function OutputBlock({ 
  expression,
  onExpressionChange,
  blockId, 
  
}: OutputBlockProps) {
  const [currentExpression, setCurrentExpression] = useState(expression);

  useEffect(() => {
    if (expression !== currentExpression) {
      setCurrentExpression(expression);
    }
  }, [expression]);

  const handleExpressionChange = (text: string) => {
    setCurrentExpression(text);
    onExpressionChange(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Вывод</Text>
      </View>
      <View style={styles.content}>
        <TextInput
          style={styles.input}
          value={currentExpression}
          onChangeText={handleExpressionChange}
          placeholder="Переменная или выражение"
          autoCapitalize="none"
          
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#795548", 
    borderRadius: 8,
    marginBottom: 12,
    overflow: "hidden",
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
  input: {
    backgroundColor: "white",
    borderRadius: 4,
    padding: 10,
    fontSize: 14,
  },
}); 