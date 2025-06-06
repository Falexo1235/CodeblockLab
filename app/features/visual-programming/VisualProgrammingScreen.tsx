import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { BlocksArea } from './components/BlocksArea';
import { CategorySidebar } from './components/CategorySidebar';
import { Header } from './components/Header';
import { MainTabs } from './components/MainTabs';
import { MobileTabs } from './components/MobileTabs';
import { Workspace } from './components/Workspace';
import { WorkspaceBlock } from './components/WorkspaceBlock';
import { useBlockData } from './hooks/useBlockData';
import { Interpreter } from './interpreter/interpreter';
import { styles } from './styles';
import type { ArrayData, BlockType, ConnectionPoint, PlacedBlockType, VariableData } from './types';

const WORKSPACE_STORAGE_KEY = 'visual_programming_workspace';
const WORKSPACE_OFFSET_STORAGE_KEY = 'visual_programming_workspace_offset';

const VisualProgrammingScreen = () => {
  const [activeView, setActiveView] = useState<'blocks' | 'workspace'>('blocks');
  const [selectedTab, setSelectedTab] = useState<string>('Code');
  const [selectedCategory, setSelectedCategory] = useState<string>('Управление');
  const [placedBlocks, setPlacedBlocks] = useState<PlacedBlockType[]>([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [windowDimensions, setWindowDimensions] = useState(Dimensions.get('window'));
  const [variables, setVariables] = useState<VariableData[]>([]);
  const [errors, setErrors] = useState<{ blockId: string; message: string }[]>([]);
  const [output, setOutput] = useState<{ blockId: string; message: string }[]>([]);
  const [workspaceOffset, setWorkspaceOffset] = useState({ x: 0, y: 0 });
  const [arrays, setArrays] = useState<ArrayData[]>([]);

  const [isConnecting, setIsConnecting] = useState(false);
  const [sourceConnectionPoint, setSourceConnectionPoint] = useState<ConnectionPoint | null>(null);

  const { blocks } = useBlockData();

  const workspaceRef = useRef<View | null>(null);
  const [workspaceLayout, setWorkspaceLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const interpreter = useRef(new Interpreter());

  const isPortrait = windowDimensions.height > windowDimensions.width;
  
  useEffect(() => {
    const loadWorkspace = async () => {
      try {
        const savedWorkspaceJson = await AsyncStorage.getItem(WORKSPACE_STORAGE_KEY);
        if (savedWorkspaceJson !== null) {
          const savedBlocks = JSON.parse(savedWorkspaceJson) as PlacedBlockType[];
          if (Array.isArray(savedBlocks)) {
             setPlacedBlocks(savedBlocks);
          }
        }

        const savedOffsetJson = await AsyncStorage.getItem(WORKSPACE_OFFSET_STORAGE_KEY)
        if (savedOffsetJson !== null) {
          const savedOffset = JSON.parse(savedOffsetJson)
          setWorkspaceOffset(savedOffset)
        }
      } catch (e) {
        console.error("Failed to load workspace from storage", e);
        Alert.alert("Ошибка загрузки", "Не удалось загрузить сохраненную рабочую область.");
      }
    };
    loadWorkspace();
  }, []);

  useEffect(() => {
    const saveWorkspace = async () => {
      if (placedBlocks === undefined) return;
      try {
        const jsonValue = JSON.stringify(placedBlocks);
        await AsyncStorage.setItem(WORKSPACE_STORAGE_KEY, jsonValue);
      } catch (e) {
        console.error("Failed to save workspace to storage", e);
        
        
      }
    }
    if (placedBlocks.length > 0 || AsyncStorage.getItem(WORKSPACE_STORAGE_KEY) !== null) {
      saveWorkspace()
    }
  }, [placedBlocks])

  useEffect(() => {
    const saveWorkspaceOffset = async () => {
      try {
        const jsonValue = JSON.stringify(workspaceOffset)
        await AsyncStorage.setItem(WORKSPACE_OFFSET_STORAGE_KEY, jsonValue)
      } catch (e) {
        console.error("Failed to save workspace offset to storage", e)
      }
    }
    saveWorkspaceOffset()
  }, [workspaceOffset])

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setWindowDimensions(window)
    })

    return () => subscription.remove()
  }, [])

  const onWorkspaceLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout

    if (workspaceRef.current) {
      workspaceRef.current.measure((fx, fy, width, height, px, py) => {
        setWorkspaceLayout({ x: px, y: py, width, height })
      })
    } else {

      const { x, y } = event.nativeEvent.layout
      setWorkspaceLayout({ x, y, width, height })
    }
  }

  const centerWorkspace = () => {
  }
  const addBlockToWorkspace = (block: BlockType, x: number, y: number) => {
    if (block.type === "start") {
      const startBlockExists = placedBlocks.find((PlacedBlock) => PlacedBlock.type === "start")
      if (startBlockExists) {
        Alert.alert("Ограничение", 'На рабочей области может быть только один блок "Старт"', [{ text: "OK" }])
        return
      }
    } 
    const adjustedX = x - workspaceOffset.x
    const adjustedY = y - workspaceOffset.y

    const newBlock: PlacedBlockType = {
      ...block,
      instanceId: `${block.id}-${Date.now()}`,
      x: adjustedX,
      y: adjustedY,
      nextBlockId: null,
      trueBlockId: null,
      falseBlockId: null,
      previousBlockId: null,
      inputConnections: {
        valueInputId: null,
        leftInputId: null,
        rightInputId: null,
        indexInputId: null,
      },
      data: {
        variableName: '',
        value: '',
        leftValue: '',
        rightValue: '',
        operation: '+',
        condition: '',
        operator: '==',
        expression: '',
        initialization: '',
        iteration: '',
        functionName: '',
        arrayName: '',
        arraySize: '',
        arrayIndex: '',
      },
    };
    
    setPlacedBlocks(prev => [...prev, newBlock]);
  };
  
  const handleBlockPress = (block: BlockType) => {
    const centerX = workspaceLayout.width / 2 - 150
    const centerY = workspaceLayout.height / 2 - 60

    const offsetX = (placedBlocks.length % 3) * 30
    const offsetY = (placedBlocks.length % 5) * 30

    addBlockToWorkspace(block, centerX + offsetX, centerY + offsetY)
  }

  const updateBlockPosition = (instanceId: string, x: number, y: number) => {
    setPlacedBlocks(prev => 
      prev.map(b => 
        b.instanceId === instanceId ? { ...b, x, y } : b
      )
    );
  };

  const updateBlockData = (instanceId: string, data: any) => {
    setPlacedBlocks((prev) =>
      prev.map((b) => (b.instanceId === instanceId ? { ...b, data: { ...b.data, ...data } } : b)),
    )
  }

  const clearWorkspace = () => {
    setPlacedBlocks([])
    setVariables([])
    setArrays([])
    setErrors([])
    setOutput([]);
  }

  const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible)

  const handleConnectionPointPress = (point: ConnectionPoint) => {

    if (!isConnecting) {

      const block = placedBlocks.find((b) => b.instanceId === point.blockId)
      if (block) {

        if (point.type === 'top' && block.previousBlockId) {

          removeConnection(point)
          return
        } else if (point.type === 'bottom' && block.nextBlockId) {

          removeConnection(point)
          return
        } else if (point.type === 'true' && block.trueBlockId) {

          removeConnection(point)
          return
        } else if (point.type === 'false' && block.falseBlockId) {

          removeConnection(point)
          return
        } else if (point.type === 'valueInput' && block.inputConnections?.valueInputId) {

          removeInputConnection(point)
          return
        } else if (point.type === 'leftInput' && block.inputConnections?.leftInputId) {

          removeInputConnection(point)
          return
        } else if (point.type === "rightInput" && block.inputConnections?.rightInputId) {
          removeInputConnection(point)
          return
        } else if (point.type === "indexInput" && block.inputConnections?.indexInputId) {
          removeInputConnection(point)
          return
        }
      }

      setIsConnecting(true)
      setSourceConnectionPoint(point)
    } else {

      if (sourceConnectionPoint && sourceConnectionPoint.blockId !== point.blockId) {

        if (
          (sourceConnectionPoint.type === "output" &&
            (point.type === "valueInput" ||
              point.type === "leftInput" ||
              point.type === "rightInput" ||
              point.type === "indexInput")) ||
          (point.type === "output" &&
            (sourceConnectionPoint.type === "valueInput" ||
              sourceConnectionPoint.type === "leftInput" ||
              sourceConnectionPoint.type === "rightInput" ||
              sourceConnectionPoint.type === "indexInput"))
        ) {

          connectInputs(sourceConnectionPoint, point)
        } else {

          connectBlocks(sourceConnectionPoint, point)
        }
      }

      setIsConnecting(false)
      setSourceConnectionPoint(null)
    }
  }

  const removeInputConnection = (point: ConnectionPoint) => {
    const blockId = point.blockId
    const connectionType = point.type

    setPlacedBlocks((prev) => {
      const updatedBlocks = [...prev]
      const blockIndex = updatedBlocks.findIndex((b) => b.instanceId === blockId)
      if (blockIndex === -1) return prev

      const block = updatedBlocks[blockIndex]

      if (!block.inputConnections) {
        return prev
      }

      if (connectionType === 'valueInput') {
        updatedBlocks[blockIndex] = {
          ...block,
          inputConnections: { ...block.inputConnections, valueInputId: null },
        }
      } else if (connectionType === 'leftInput') {
        updatedBlocks[blockIndex] = {
          ...block,
          inputConnections: { ...block.inputConnections, leftInputId: null },
        }
      } else if (connectionType === 'rightInput') {
        updatedBlocks[blockIndex] = {
          ...block,
          inputConnections: { ...block.inputConnections, rightInputId: null },
        }
      } else if (connectionType === "indexInput") {
        updatedBlocks[blockIndex] = {
          ...block,
          inputConnections: { ...block.inputConnections, indexInputId: null },
        }
      }

      return updatedBlocks
    })
  }

  const removeConnection = (point: ConnectionPoint) => {
    const blockId = point.blockId
    const connectionType = point.type

    setPlacedBlocks((prev) => {
      const updatedBlocks = [...prev]

      const blockIndex = updatedBlocks.findIndex((b) => b.instanceId === blockId)
      if (blockIndex === -1) return prev

      const block = updatedBlocks[blockIndex]

      if (connectionType === 'top' && block.previousBlockId) {

        const prevBlockIndex = updatedBlocks.findIndex((b) => b.instanceId === block.previousBlockId)
        if (prevBlockIndex !== -1) {
          const prevBlock = updatedBlocks[prevBlockIndex]

          if (prevBlock.nextBlockId === blockId) {
            updatedBlocks[prevBlockIndex] = { ...prevBlock, nextBlockId: null }
          } else if (prevBlock.trueBlockId === blockId) {
            updatedBlocks[prevBlockIndex] = { ...prevBlock, trueBlockId: null }
          } else if (prevBlock.falseBlockId === blockId) {
            updatedBlocks[prevBlockIndex] = { ...prevBlock, falseBlockId: null }
          }
        }

        updatedBlocks[blockIndex] = { ...block, previousBlockId: null }
      } else if (connectionType === 'bottom' && block.nextBlockId) {

        const nextBlockIndex = updatedBlocks.findIndex((b) => b.instanceId === block.nextBlockId)
        if (nextBlockIndex !== -1) {
          updatedBlocks[nextBlockIndex] = {
            ...updatedBlocks[nextBlockIndex],
            previousBlockId: null,
          }
        }

        updatedBlocks[blockIndex] = { ...block, nextBlockId: null }
      } else if (connectionType === 'true' && block.trueBlockId) {

        const trueBlockIndex = updatedBlocks.findIndex((b) => b.instanceId === block.trueBlockId)
        if (trueBlockIndex !== -1) {
          updatedBlocks[trueBlockIndex] = {
            ...updatedBlocks[trueBlockIndex],
            previousBlockId: null,
          }
        }

        updatedBlocks[blockIndex] = { ...block, trueBlockId: null }
      } else if (connectionType === 'false' && block.falseBlockId) {

        const falseBlockIndex = updatedBlocks.findIndex((b) => b.instanceId === block.falseBlockId)
        if (falseBlockIndex !== -1) {
          updatedBlocks[falseBlockIndex] = {
            ...updatedBlocks[falseBlockIndex],
            previousBlockId: null,
          }
        }

        updatedBlocks[blockIndex] = { ...block, falseBlockId: null }
      }

      return updatedBlocks
    })
  }

  const connectInputs = (source: ConnectionPoint, target: ConnectionPoint) => {
    let outputBlockId: string
    let targetBlockId: string
    let inputType: 'valueInput' | 'leftInput' | 'rightInput' | 'indexInput'

    if (source.type === 'output') {
      outputBlockId = source.blockId
      targetBlockId = target.blockId
      inputType = target.type as 'valueInput' | 'leftInput' | 'rightInput' | 'indexInput'
    } else {
      outputBlockId = target.blockId
      targetBlockId = source.blockId
      inputType = source.type as 'valueInput' | 'leftInput' | 'rightInput' | 'indexInput'
    }

    const outputBlock = placedBlocks.find((b) => b.instanceId === outputBlockId)
    const targetBlock = placedBlocks.find((b) => b.instanceId === targetBlockId)

    if (
      !outputBlock ||
      (outputBlock.type !== "arithmetic" && outputBlock.type !== "arrayElement") ||
      !targetBlock
    ) {
      Alert.alert("Ошибка соединения", "Неверный тип блока для соединения")
      return
    }

    const validConnections = {
      assignment: ["valueInput"],
      output: ["valueInput"],
      if: ["leftInput", "rightInput"],
      while: ["leftInput", "rightInput"],
      for: ["leftInput", "rightInput"],
      arrayAssignment: ["valueInput", "indexInput"],
      arrayElement: ["indexInput"]
    }

    const targetType = targetBlock.type as keyof typeof validConnections
    if (validConnections[targetType] && !validConnections[targetType].includes(inputType)) {
      Alert.alert("Ошибка соединения", `Блок ${targetBlock.title} не поддерживает этот тип входа`)
      return
    }

    setPlacedBlocks((prev) =>
      prev.map((block) => {
        if (block.instanceId === targetBlockId) {
          if (inputType === "valueInput") {
            return {
              ...block,
              inputConnections: { ...block.inputConnections, valueInputId: outputBlockId },
            }
          } else if (inputType === "leftInput") {
            return {
              ...block,
              inputConnections: { ...block.inputConnections, leftInputId: outputBlockId },
            }
          } else if (inputType === "rightInput") {
            return {
              ...block,
              inputConnections: { ...block.inputConnections, rightInputId: outputBlockId },
            }
          } else if (inputType === "indexInput") {
            return {
              ...block,
              inputConnections: { ...block.inputConnections, indexInputId: outputBlockId },
            }
          }
        }
        return block
      }),
    )
  }

  const deleteBlock = (instanceId: string) => {
    const blockToDelete = placedBlocks.find((block) => block.instanceId === instanceId)
    if (!blockToDelete) return

    setPlacedBlocks((prev) => {
      const updatedBlocks = prev.filter((block) => block.instanceId !== instanceId)

      return updatedBlocks.map((block) => {
        const updates: Partial<PlacedBlockType> = {}

        if (block.nextBlockId === instanceId) {
          updates.nextBlockId = null
        }
        if (block.previousBlockId === instanceId) {
          updates.previousBlockId = null
        }
        if (block.trueBlockId === instanceId) {
          updates.trueBlockId = null
        }
        if (block.falseBlockId === instanceId) {
          updates.falseBlockId = null
        }

        if (block.inputConnections) {
          const inputUpdates: any = {}

          if (block.inputConnections.valueInputId === instanceId) {
            inputUpdates.valueInputId = null
          }
          if (block.inputConnections.leftInputId === instanceId) {
            inputUpdates.leftInputId = null
          }
          if (block.inputConnections.rightInputId === instanceId) {
            inputUpdates.rightInputId = null
          }
          if (block.inputConnections.indexInputId === instanceId) {
            inputUpdates.indexInputId = null
          }

          if (Object.keys(inputUpdates).length > 0) {
            updates.inputConnections = { ...block.inputConnections, ...inputUpdates }
          }
        }

        return Object.keys(updates).length > 0 ? { ...block, ...updates } : block
      })
    })
  }

  const connectBlocks = (source: ConnectionPoint, target: ConnectionPoint) => {

    const sourceBlock = placedBlocks.find((block) => block.instanceId === source.blockId)
    const targetBlock = placedBlocks.find((block) => block.instanceId === target.blockId)

    if (!sourceBlock || !targetBlock) {
      return
    }

    if (source.blockId === target.blockId) {
      Alert.alert('Ошибка соединения', 'Нельзя соединить блок с самим собой')
      return
    }

    let fromBlock, toBlock, fromType, toType

    if ((source.type === 'bottom' || source.type === 'true' || source.type === 'false') && target.type === 'top') {
      fromBlock = sourceBlock
      toBlock = targetBlock
      fromType = source.type
      toType = target.type
    } else if (
      source.type === "top" &&
      (target.type === "bottom" || target.type === "true" || target.type === "false")
    ) {
      fromBlock = targetBlock
      toBlock = sourceBlock
      fromType = target.type
      toType = source.type
    } else {
      Alert.alert("Ошибка соединения", "Недопустимый тип соединения. Соединяйте выход одного блока со входом другого.")
      return
    }

    if (toBlock.previousBlockId) {
      Alert.alert("Ошибка соединения", "Блок уже имеет входящее соединение")
      return
    }

    if (fromType === "bottom" && fromBlock.nextBlockId) {
      Alert.alert("Ошибка соединения", "Блок уже имеет исходящее соединение")
      return
    } else if (fromType === "true" && fromBlock.trueBlockId) {
      Alert.alert("Ошибка соединения", "Блок уже имеет соединение для 'true'")
      return
    } else if (fromType === "false" && fromBlock.falseBlockId) {
      Alert.alert("Ошибка соединения", "Блок уже имеет соединение для 'false'")
      return
    }

    setPlacedBlocks((prev) =>
      prev.map((block) => {
        if (block.instanceId === fromBlock.instanceId) {
          if (fromType === 'bottom') {
            return { ...block, nextBlockId: toBlock.instanceId }
          } else if (fromType === 'true') {
            return { ...block, trueBlockId: toBlock.instanceId }
          } else if (fromType === 'false') {
            return { ...block, falseBlockId: toBlock.instanceId }
          }
        }
        if (block.instanceId === toBlock.instanceId) {
          return { ...block, previousBlockId: fromBlock.instanceId }
        }
        return block
      }),
    )
  }

  const runCode = () => {
    if (placedBlocks.length === 0) {
      Alert.alert('Ошибка', 'Нет блоков для выполнения')
      return
    }

    const startBlock = placedBlocks.find((block) => block.type === 'start')
    if (!startBlock) {
      Alert.alert('Ошибка', 'Программа должна начинаться с блока "Старт"')
      return
    }

    setErrors([])
    setOutput([]);

    const result = interpreter.current.execute(placedBlocks)
    setVariables(result.variables)
    setArrays(result.arrays)
    setErrors(result.errors)
    setOutput(result.output);

    if (result.errors.length > 0) {
      Alert.alert('Ошибки выполнения', `Найдено ${result.errors.length} ошибок`)
    } else {
      Alert.alert('Успех', 'Код выполнен успешно')
    }

    setSelectedTab('Run')
  }

  const getVariableNames = () => {
    return variables.map((v) => v.name)
  }

  const getFunctionNames = () => {
    return placedBlocks
      .filter((block) => block.type === "functionStart" && block.data?.functionName)
      .map((block) => block.data!.functionName!)
      .filter((name) => name.trim() !== "")
  }

  const getArrayNames = () => {
    return arrays.map((arr) => arr.name)
  }

  const renderRunView = () => {
    return (
      <View style={styles.runView}>
        <Text style={styles.runViewTitle}>Результаты выполнения</Text>
        <ScrollView>
          {output.length > 0 && (
            <View style={styles.outputContainer}>
              <Text style={styles.outputTitle}>Вывод:</Text>
              {output.map((item, index) => (
                <Text key={index} style={styles.outputText}>
                  • {item.message}
                </Text>
              ))}
            </View>
          )}

          {errors.length > 0 && (
            <View style={styles.errorsContainer}>
              <Text style={styles.errorsTitle}>Ошибки:</Text>
              {errors.map((error, index) => (
                <Text key={index} style={styles.errorText}>
                  • {error.message}
                </Text>
              ))}
            </View>
          )}

          <View style={styles.variablesContainer}>
            <Text style={styles.variablesTitle}>Переменные:</Text>
            {variables.length > 0 ? (
              variables.map((variable, index) => (
                <Text key={index} style={styles.variableText}>
                  {variable.name} = {variable.value}
                </Text>
              ))
            ) : (
              <Text style={styles.noVariablesText}>Нет переменных</Text>
            )}
          </View>

          {arrays.length > 0 && (
            <View style={styles.variablesContainer}>
              <Text style={styles.variablesTitle}>Массивы:</Text>
              {arrays.map((array, index) => (
                <Text key={index} style={styles.variableText}>
                  {array.name}[{array.size}] = [{array.elements.join(", ")}]
                </Text>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    )
  }

  const handleBlockDrop = (x: number, y: number, block: BlockType) => {
    addBlockToWorkspace(block, x, y)
  }

  return (
    <SafeAreaView style={styles.container}>
      
      <Header />
      
      <MainTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

      {isPortrait && <MobileTabs activeView={activeView} setActiveView={setActiveView} />}

      {selectedTab === "Code" ? (
        <View style={styles.contentContainer}>
          {(!isPortrait || activeView === 'blocks') && (
            <CategorySidebar
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              isSidebarVisible={isSidebarVisible}
              toggleSidebar={toggleSidebar}
            />
          )}

          {isPortrait ? (
            <View style={styles.mainContent}>
              {activeView === 'blocks' && (
                <BlocksArea
                  selectedCategory={selectedCategory}
                  blocks={blocks}
                  onBlockDrop={addBlockToWorkspace}
                  workspaceLayout={workspaceLayout}
                  workspaceRef={workspaceRef}
                  isPortrait={isPortrait}
                  onBlockPress={handleBlockPress}
                />
              )}

              {activeView === 'workspace' && (
                <View style={styles.workspaceContainer}>
                  <Workspace
                    placedBlocks={placedBlocks}
                    onClearWorkspace={clearWorkspace}
                    onUpdateBlockPosition={updateBlockPosition}
                    workspaceRef={workspaceRef}
                    onWorkspaceLayout={onWorkspaceLayout}
                    onBlockDrop={handleBlockDrop}
                    workspaceOffset={workspaceOffset}
                    onWorkspaceOffsetChange={setWorkspaceOffset}
                    onCenterWorkspace={centerWorkspace}
                  >
                    {placedBlocks.map((block) => (
                      <WorkspaceBlock
                        key={block.instanceId}
                        block={block}
                        onUpdatePosition={updateBlockPosition}
                        onUpdateBlockData={updateBlockData}
                        onConnectionPointPress={handleConnectionPointPress}
                        onDeleteBlock={deleteBlock}
                        variables={getVariableNames()}
                        isConnecting={isConnecting}
                        activeConnectionPoint={sourceConnectionPoint}
                        placedBlocks={placedBlocks}
                        errors={errors}
                        functions={getFunctionNames()}
                        arrays={getArrayNames()}
                      />
                    ))}
                  </Workspace>

                  <TouchableOpacity style={styles.runButton} onPress={runCode}>
                    <Text style={styles.runButtonText}>Запустить</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.mainContent}>
              <BlocksArea
                selectedCategory={selectedCategory}
                blocks={blocks}
                onBlockDrop={addBlockToWorkspace}
                workspaceLayout={workspaceLayout}
                workspaceRef={workspaceRef}
                isPortrait={isPortrait}
                onBlockPress={handleBlockPress}
              />

              <View style={styles.workspaceContainer}>
                <Workspace
                  placedBlocks={placedBlocks}
                  onClearWorkspace={clearWorkspace}
                  onUpdateBlockPosition={updateBlockPosition}
                  workspaceRef={workspaceRef}
                  onWorkspaceLayout={onWorkspaceLayout}
                  onBlockDrop={handleBlockDrop}
                  workspaceOffset={workspaceOffset}
                  onWorkspaceOffsetChange={setWorkspaceOffset}
                  onCenterWorkspace={centerWorkspace}
                >
                  {placedBlocks.map((block) => (
                    <WorkspaceBlock
                      key={block.instanceId}
                      block={block}
                      onUpdatePosition={updateBlockPosition}
                      onUpdateBlockData={updateBlockData}
                      onConnectionPointPress={handleConnectionPointPress}
                      onDeleteBlock={deleteBlock}
                      variables={getVariableNames()}
                      isConnecting={isConnecting}
                      activeConnectionPoint={sourceConnectionPoint}
                      placedBlocks={placedBlocks}
                      errors={errors}
                      functions={getFunctionNames()}
                      arrays={getArrayNames()}
                    />
                  ))}
                </Workspace>

                <TouchableOpacity style={styles.runButton} onPress={runCode}>
                  <Text style={styles.runButtonText}>Запустить</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      ) : (
        renderRunView()
      )}
    </SafeAreaView>
  );
};

export default VisualProgrammingScreen; 