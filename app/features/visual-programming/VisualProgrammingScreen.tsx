import { Stack } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, SafeAreaView, View } from 'react-native';
import { BlocksArea } from './components/BlocksArea';
import { CategorySidebar } from './components/CategorySidebar';
import { Header } from './components/Header';
import { MainTabs } from './components/MainTabs';
import { MobileTabs } from './components/MobileTabs';
import { Workspace } from './components/Workspace';
import { useBlockData } from './hooks/useBlockData';
import { styles } from './styles';
import { BlockType, PlacedBlockType } from './types';

const VisualProgrammingScreen = () => {
  const [activeView, setActiveView] = useState<'blocks' | 'workspace'>('blocks');
  const [selectedTab, setSelectedTab] = useState<string>('Code');
  const [selectedCategory, setSelectedCategory] = useState<string>('Control');
  const [placedBlocks, setPlacedBlocks] = useState<PlacedBlockType[]>([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [windowDimensions, setWindowDimensions] = useState(Dimensions.get('window'));
  
  const workspaceRef = useRef<View | null>(null);
  const [workspaceLayout, setWorkspaceLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
  const { blocks } = useBlockData();
  
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
  
  const clearWorkspace = () => setPlacedBlocks([]);
  
  const onWorkspaceLayout = (event: any) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setWorkspaceLayout({ x, y, width, height });
  };
  
  const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible);
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <Header />
      
      <MainTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      
      {isPortrait && (
        <MobileTabs activeView={activeView} setActiveView={setActiveView} />
      )}
      
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
              <Workspace 
                placedBlocks={placedBlocks}
                onClearWorkspace={clearWorkspace}
                onUpdateBlockPosition={updateBlockPosition}
                workspaceRef={workspaceRef}
                onWorkspaceLayout={onWorkspaceLayout}
              />
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
            
            <Workspace 
              placedBlocks={placedBlocks}
              onClearWorkspace={clearWorkspace}
              onUpdateBlockPosition={updateBlockPosition}
              workspaceRef={workspaceRef}
              onWorkspaceLayout={onWorkspaceLayout}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default VisualProgrammingScreen; 