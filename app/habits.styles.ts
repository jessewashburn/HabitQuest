import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
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
    backgroundColor: '#d4edda',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#666',
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
});

export default styles;
