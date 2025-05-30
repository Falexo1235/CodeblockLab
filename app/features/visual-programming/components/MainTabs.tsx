import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';

interface TabProps {
  title: string;
  active: boolean;
  onPress: () => void;
}

const Tab = ({ title, active, onPress }: TabProps) => (
  <TouchableOpacity 
    style={[styles.tab, active && styles.activeTab]}
    onPress={onPress}
  >
    <Text style={[styles.tabText, active && styles.activeTabText]}>
      {title}
    </Text>
  </TouchableOpacity>
);

interface MainTabsProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

export const MainTabs = ({ selectedTab, setSelectedTab }: MainTabsProps) => {
  return (
    <View style={styles.tabsContainer}>
      <Tab 
        title="Создать" 
        active={selectedTab === 'Code'} 
        onPress={() => setSelectedTab('Code')} 
      />
      <Tab 
        title="Запустить" 
        active={selectedTab === 'Run'} 
        onPress={() => setSelectedTab('Run')} 
      />
    </View>
  );
};

export default MainTabs; 