import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  menuContainer: {
    flexDirection: 'row',
  },
  menuItem: {
    marginLeft: 16,
  },
  menuItemText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2A2A2A',
  },
  tabText: {
    fontSize: 16,
    color: '#888888',
  },
  activeTabText: {
    color: '#2A2A2A',
    fontWeight: 'bold',
  },
  mobileTabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  mobileTab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeMobileTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2A2A2A',
  },
  mobileTabText: {
    fontSize: 16,
    color: '#888888',
    marginLeft: 8,
  },
  activeMobileTabText: {
    color: '#2A2A2A',
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    backgroundColor: '#F8F8F8',
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  sidebarToggle: {
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  selectedCategoryButton: {
    backgroundColor: '#E0E0E0',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#555555',
    overflow: 'hidden',
  },
  selectedCategoryButtonText: {
    fontWeight: 'bold',
    color: '#2A2A2A',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  blocksArea: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8F8F8',
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
    maxWidth: 280,
  },
  blocksAreaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  blocksList: {
    flex: 1,
  },
  blockContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  blockDescription: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  workspaceArea: {
    flex: 2,
    padding: 16,
  },
  workspaceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  workspaceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#FF6666',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  workspace: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    position: 'relative',
  },
}); 