import { useEffect, useState } from "react"
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

const isPhone = Platform.OS === "android" || Platform.OS === "ios"

interface ArrayElementBlockProps {
  arrayName: string
  arrayIndex: string
  onArrayNameChange: (name: string) => void
  onArrayIndexChange: (index: string) => void
  arrays: string[]
  blockId: string
  indexInputConnected?: boolean
}

export function ArrayElementBlock({
  arrayName,
  arrayIndex,
  onArrayNameChange,
  onArrayIndexChange,
  arrays,
  blockId,
  indexInputConnected = false,
}: ArrayElementBlockProps) {
  const [name, setName] = useState(arrayName)
  const [index, setIndex] = useState(arrayIndex)
  const [showArrays, setShowArrays] = useState(false)

  useEffect(() => {
    if (arrayName !== name) setName(arrayName)
    if (arrayIndex !== index) setIndex(arrayIndex)
  }, [arrayName, arrayIndex])

  const handleNameChange = (text: string) => {
    setName(text)
    onArrayNameChange(text)
  }

  const handleIndexChange = (text: string) => {
    setIndex(text)
    onArrayIndexChange(text)
  }

  const selectArray = (arrayName: string) => {
    setName(arrayName)
    onArrayNameChange(arrayName)
    setShowArrays(false)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Элемент массива</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.label}>Массив:</Text>
          <TouchableOpacity style={styles.arraySelector} onPress={() => setShowArrays(!showArrays)}>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={handleNameChange}
              placeholder="Имя массива"
              autoCapitalize="none"
            />
          </TouchableOpacity>
          {showArrays && arrays.length > 0 && (
            <View style={styles.arraysDropdown}>
              <ScrollView style={{ maxHeight: isPhone ? undefined : 150 }}>
                {arrays.map((arrayName) => (
                  <TouchableOpacity key={arrayName} style={styles.arrayOption} onPress={() => selectArray(arrayName)}>
                    <Text>{arrayName}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Индекс:</Text>
          <TextInput
            style={[styles.input, indexInputConnected && styles.disabledInput]}
            value={index}
            onChangeText={handleIndexChange}
            placeholder="Индекс элемента"
            keyboardType="numeric"
            editable={!indexInputConnected}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#3F51B5",
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
    marginBottom: 8,
    position: "relative",
  },
  label: {
    color: "white",
    width: 80,
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 4,
    padding: 8,
  },
  disabledInput: {
    backgroundColor: "#E0E0E0",
    color: "#666",
  },
  arraySelector: {
    flex: 1,
  },
  arraysDropdown: {
    position: "absolute",
    top: 40,
    left: 88,
    right: 0,
    backgroundColor: "white",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    zIndex: 100,
  },
  arrayOption: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
})
