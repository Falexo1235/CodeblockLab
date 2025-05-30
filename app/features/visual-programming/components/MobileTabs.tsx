import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';

interface MobileTabsProps {
  activeView: 'blocks' | 'workspace';
  setActiveView: (view: 'blocks' | 'workspace') => void;
}

export const MobileTabs = ({ activeView, setActiveView }: MobileTabsProps) => {
  return (
    <View style={styles.mobileTabsContainer}>
      <TouchableOpacity 
        style={[
          styles.mobileTab,
          activeView === 'blocks' && styles.activeMobileTab
        ]}
        onPress={() => setActiveView('blocks')}
      >
        <Ionicons 
          name="cube" 
          size={24} 
          color={activeView === 'blocks' ? "#2A2A2A" : "#888888"} 
        />
        <Text 
          style={[
            styles.mobileTabText, 
            activeView === 'blocks' && styles.activeMobileTabText
          ]}
        >
          Блоки
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.mobileTab, 
          activeView === 'workspace' && styles.activeMobileTab
        ]}
        onPress={() => setActiveView('workspace')}
      >
        <Ionicons 
          name="code-slash" 
          size={24} 
          color={activeView === 'workspace' ? "#2A2A2A" : "#888888"} 
        />
        <Text 
          style={[
            styles.mobileTabText, 
            activeView === 'workspace' && styles.activeMobileTabText
          ]}
        >
          Рабочая область
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default MobileTabs; 