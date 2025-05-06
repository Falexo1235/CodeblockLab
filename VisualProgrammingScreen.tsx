import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Block {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface BlockCategory {
  name: string;
  blocks: Block[];
}

const variableBlocks: Block[] = [
  { id: 'var-1', name: 'Create variable', description: 'Creates a new variable with a given name.', category: 'Variables' },
  { id: 'var-2', name: 'Set [var] to [0]', description: 'Assigns the value 0 to the variable `[var]`.', category: 'Variables' },
  { id: 'var-3', name: 'Change [var] by [1]', description: 'Increases or decreases the variable `[var]` by the specified amount.', category: 'Variables' },
];

const controlBlocks: Block[] = [
  { id: 'ctrl-1', name: 'If [condition] then …', description: 'If the condition is true, execute the nested blocks.', category: 'Control' },
  { id: 'ctrl-2', name: 'If … Else …', description: 'If the condition is true, do the first branch; otherwise, do the second.', category: 'Control' },
  { id: 'ctrl-3', name: 'Repeat [10] { … }', description: 'Repeat the enclosed blocks the specified number of times.', category: 'Control' },
  { id: 'ctrl-4', name: 'Forever { … }', description: 'An infinite loop executing the enclosed blocks.', category: 'Control' },
  { id: 'ctrl-5', name: 'Wait [1] seconds', description: 'Pause execution for the specified number of seconds.', category: 'Control' },
];

const operatorBlocks: Block[] = [
  { id: 'op-1', name: '[ ] < [ ]', description: 'A "less than" comparison between two numbers.', category: 'Operators' },
  { id: 'op-2', name: '[ ] = [ ]', description: 'Checks whether two values are equal.', category: 'Operators' },
  { id: 'op-3', name: '[ ] and [ ]', description: 'Logical operation "and".', category: 'Operators' },
  { id: 'op-4', name: '[ ] or [ ]', description: 'Logical operation "or".', category: 'Operators' },
  { id: 'op-5', name: 'not [ ]', description: 'Logical operation "not".', category: 'Operators' },
  { id: 'op-6', name: 'Pick random [1] to [10]', description: 'Returns a random number within the specified range.', category: 'Operators' },
];

const blockCategories: BlockCategory[] = [
  { name: 'Control', blocks: controlBlocks },
  { name: 'Variables', blocks: variableBlocks },
  { name: 'Operators', blocks: operatorBlocks },
  { name: 'My Blocks', blocks: [] },
];

const VisualProgrammingScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Code' | 'Run'>('Code');
  const [selectedCategory, setSelectedCategory] = useState<string>(blockCategories[0].name);

  const currentBlocks = blockCategories.find(cat => cat.name === selectedCategory)?.blocks || [];


  const Header = () => (
    <View style={styles.header}>
      <Text style={styles.logo}>CODEBLOCK</Text>
      <View style={styles.menu}>
        <Text style={styles.menuItem}>File</Text>
        <Text style={styles.menuItem}>Edit</Text>
      </View>
    </View>
  );

  const EditorTabs = () => (
    <View style={styles.tabsContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'Code' && styles.activeTab]}
        onPress={() => setActiveTab('Code')}
      >
        <Text style={styles.tabText}>Code</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'Run' && styles.activeTab]}
        onPress={() => setActiveTab('Run')}
      >
        <Text style={styles.tabText}>Run</Text>
      </TouchableOpacity>
    </View>
  );

  const Sidebar = () => (
    <View style={styles.sidebar}>
      <ScrollView>
        {blockCategories.map((category) => (
          <TouchableOpacity
            key={category.name}
            style={[
              styles.categoryItem,
              selectedCategory === category.name && styles.activeCategoryItem,
            ]}
            onPress={() => setSelectedCategory(category.name)}
          >
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const BlockCard: React.FC<{ block: Block }> = ({ block }) => (
    <View style={styles.blockCard}>
      <Text style={styles.blockName}>{block.name}</Text>
      <Text style={styles.blockDescription}>{block.description}</Text>
    </View>
  );

  const BlocksArea = () => (
    <ScrollView style={styles.blocksArea}>
      {activeTab === 'Code' ? (
        currentBlocks.length > 0 ? (
          currentBlocks.map((block) => <BlockCard key={block.id} block={block} />)
        ) : (
          <Text style={styles.emptyBlocksText}>Select a category to see blocks or this category is empty.</Text>
        )
      ) : (
        <View style={styles.runView}>
          <Text>Run Screen Placeholder</Text>
        </View>
      )}
    </ScrollView>
  );

  const WorkspaceArea = () => (
    <View style={styles.workspaceArea}>
        <Text style={styles.workspacePlaceholderText}>Drag blocks here to build your program</Text>
    </View>
  );


  return (
    <View style={styles.screen}>
      <Header />
      <EditorTabs />
      <View style={styles.mainContent}>
        <Sidebar />
        <View style={styles.editorPanel}>
          <BlocksArea />
          <WorkspaceArea />
        </View>
      </View>
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#4A90E2',
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  menu: {
    flexDirection: 'row',
  },
  menuItem: {
    marginLeft: 15,
    fontSize: 16,
    color: '#FFFFFF',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#4A90E2',
    backgroundColor: '#F0F0F0',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: screenWidth * 0.25,
    backgroundColor: '#D1D1D1',
    paddingVertical: 10,
  },
  categoryItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#C0C0C0',
  },
  activeCategoryItem: {
    backgroundColor: '#B0B0B0',
    borderLeftWidth: 3,
    borderLeftColor: '#4A90E2',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '500',
  },
  editorPanel: {
    flex: 1,
    flexDirection: 'column',
  },
  blocksArea: {
    flex: 0.4,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
  },
  blockCard: {
    backgroundColor: '#E8E8E8',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    elevation: 2,
  },
  blockName: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  blockDescription: {
    fontSize: 13,
    color: '#333',
  },
  emptyBlocksText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: '#666',
  },
  runView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  workspaceArea: {
    flex: 0.6,
    backgroundColor: '#FAFAFA',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#CCC',
  },
  workspacePlaceholderText: {
    fontSize: 16,
    color: '#AAA',
    textAlign: 'center',
  },
});

export default VisualProgrammingScreen; 