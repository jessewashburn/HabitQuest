// Level/XP display styles
export const levelContainer = {
  alignItems: 'center' as const,
  marginBottom: 16,
};

export const levelCard = {
  borderRadius: 12,
  paddingVertical: 10,
  paddingHorizontal: 24,
  marginTop: 6,
  marginBottom: 2,
  shadowOpacity: 0.08,
  shadowRadius: 6,
  elevation: 2,
  minWidth: 220,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  // Stack vertically
  flexDirection: 'column' as const,
};

export const levelLoadingText = {
  fontSize: 16,
};

export const levelInfoBlock = {
  alignItems: 'center' as const,
  marginBottom: 2,
};

export const levelText = {
  fontWeight: '700' as const,
  fontSize: 18,
  letterSpacing: 0.5,
};

export const xpText = {
  fontSize: 15,
  opacity: 0.85,
};

export const todayXpText = {
  fontWeight: '700' as const,
};

export const levelSubtitle = {
  fontSize: 15,
  opacity: 0.8,
};
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 40,
  },
  narrowContainer: {
    width: '80%',
    alignSelf: 'center',
    flex: 1,
  },
  scrollContent: {
    marginTop: 16,
    flexGrow: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 8,
    color: '#2D4E85',
  },
  card: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#f2f2f2',
    marginBottom: 16,
    alignItems: 'center',
  },
  habitName: {
    fontSize: 18,
    fontWeight: '600',
  },
  text: {
    fontSize: 16,
    color: '#2D4E85',
  },
  category: {
    fontStyle: 'italic',
    color: '#555',
  },
  note: {
    color: '#333',
  },
  meta: {
    fontSize: 12,
    color: '#888',
  },
  completedCard: {
    backgroundColor: '#b6f5c9', // lighter green for better contrast
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#23272A', // dark text for contrast in light/green backgrounds
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ccc',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 18,
    color: '#2D4E85',
    marginTop: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#d32f2f',
    textAlign: 'center',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D4E85',
    marginBottom: 12,
    marginTop: 8,
  },
  draftCard: {
    backgroundColor: '#fff3cd',
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D4E85',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16,
  },
  categoryButton: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  selectedCategory: {
    backgroundColor: '#4A6741',
    borderColor: '#4A6741',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: 'white',
  },
  // Level/XP styles
  levelContainer,
  levelCard,
  levelLoadingText,
  levelInfoBlock,
  levelText,
  xpText,
  todayXpText,
  levelSubtitle,
});

export default styles;
