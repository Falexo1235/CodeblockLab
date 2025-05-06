import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';

interface CategoryButtonProps {
  title: string;
  selected: boolean;
  onPress: () => void;
  isCollapsed: boolean;
}

const CategoryButton = ({ 
  title, 
  selected, 
  onPress, 
  isCollapsed 
}: CategoryButtonProps) => {
  const iconMap: { [key: string]: any } = {
    'Управление': 'git-branch-outline',
    'Переменные': 'cube-outline',
    'Операторы': 'calculator-outline',
    'Мои блоки': 'bookmark-outline',
  };

  return (
    <TouchableOpacity 
      style={[
        styles.categoryButton, 
        selected && styles.selectedCategoryButton
      ]}
      onPress={onPress}
    >
      <Ionicons 
        name={iconMap[title] || 'square-outline'} 
        size={24} 
        color={selected ? '#2A2A2A' : '#555555'} 
      />
      
      {!isCollapsed && (
        <Text 
          style={[
            styles.categoryButtonText,
            selected && styles.selectedCategoryButtonText
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

interface CategorySidebarProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  isSidebarVisible: boolean;
  toggleSidebar: () => void;
}

export const CategorySidebar = ({ 
  selectedCategory, 
  setSelectedCategory,
  isSidebarVisible,
  toggleSidebar
}: CategorySidebarProps) => {
  const categories = ['Управление', 'Переменные', 'Операторы', 'Мои блоки'];
  
  return (
    <View style={[
      styles.sidebar, 
      { width: isSidebarVisible ? 120 : 50 }
    ]}>
      <TouchableOpacity 
        style={styles.sidebarToggle}
        onPress={toggleSidebar}
      >
        <Ionicons 
          name={isSidebarVisible ? "menu" : "menu-outline"} 
          size={24} 
          color="#555555" 
        />
      </TouchableOpacity>
      
      {categories.map(category => (
        <CategoryButton 
          key={category}
          title={category} 
          selected={selectedCategory === category}
          onPress={() => setSelectedCategory(category)}
          isCollapsed={!isSidebarVisible}
        />
      ))}
    </View>
  );
}; 