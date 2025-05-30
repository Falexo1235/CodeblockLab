import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';

const MenuItem = ({ title }: { title: string }) => (
  <TouchableOpacity style={styles.menuItem}>
    <Text style={styles.menuItemText}>{title}</Text>
  </TouchableOpacity>
);

export const Header = () => {
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>CODEBLOCK</Text>
      </View>
      <View style={styles.menuContainer}>
        <MenuItem title="Файл" />
        <MenuItem title="Правка" />
      </View>
    </View>
  );
};

export default Header; 