import { Stack } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
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
import type { BlockType, PlacedBlockType, VariableData } from './types';

const VisualProgrammingScreen = () => {
  const [activeView, setActiveView] = useState<'blocks' | 'workspace'>('blocks');
  const [selectedTab, setSelectedTab] = useState<string>('Code');
  const [selectedCategory, setSelectedCategory] = useState<string>('Переменные');
  const [placedBlocks, setPlacedBlocks] = useState<PlacedBlockType[]>([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [windowDimensions, setWindowDimensions] = useState(Dimensions.get('window'));
  const [variables, setVariables] = useState<VariableData[]>([]);
  const [errors, setErrors] = useState<{ blockId: string; message: string }[]>([]);

  const { blocks } = useBlockData();

  const workspaceRef = useRef<View | null>(null);
  const [workspaceLayout, setWorkspaceLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const interpreter = useRef(new Interpreter());

  const isPortrait = windowDimensions.height > windowDimensions.width;
  
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setWindowDimensions(window);
    });
    
    return () => subscription.remove();
  }, []);
  
  const addBlockToWorkspace = (block: BlockType, x: number, y: number) => {
    const newBlock: PlacedBlockType = {
      ...block,
      instanceId: `${block.id}-${Date.now()}`,
      x,
      y,
      data: {
        variableName: '',
        value: '',
        leftValue: '',
        rightValue: '',
        operation: '+',
        condition: '',
        operator: '==',
      },
    };
    
    setPlacedBlocks(prev => [...prev, newBlock]);
  };
  
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
    setErrors([])
  }

  const onWorkspaceLayout = (event: any) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setWorkspaceLayout({ x, y, width, height });
  };
  
  const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible);
  
  const runCode = () => {
    if (placedBlocks.length === 0) {
      Alert.alert('Ошибка', 'Нет блоков для выполнения')
      return
    }

    const result = interpreter.current.execute(placedBlocks)
    setVariables(result.variables)
    setErrors(result.errors)

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

  const renderRunView = () => {
    return (
      <View style={styles.runView}>
        <Text style={styles.runViewTitle}>Результаты выполнения</Text>

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
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <Header />
      
      <MainTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      
      {isPortrait && (
        <MobileTabs activeView={activeView} setActiveView={setActiveView} />
      )}

      {selectedTab === 'Code' ? (
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
                  >
                    {placedBlocks.map((block) => (
                      <WorkspaceBlock
                        key={block.instanceId}
                        block={block}
                        onUpdatePosition={updateBlockPosition}
                        onUpdateBlockData={updateBlockData}
                        variables={getVariableNames()}
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
              />

              <View style={styles.workspaceContainer}>
                <Workspace
                  placedBlocks={placedBlocks}
                  onClearWorkspace={clearWorkspace}
                  onUpdateBlockPosition={updateBlockPosition}
                  workspaceRef={workspaceRef}
                  onWorkspaceLayout={onWorkspaceLayout}
                >
                  {placedBlocks.map((block) => (
                    <WorkspaceBlock
                      key={block.instanceId}
                      block={block}
                      onUpdatePosition={updateBlockPosition}
                      onUpdateBlockData={updateBlockData}
                      variables={getVariableNames()}
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