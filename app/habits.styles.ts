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
});

export default styles;
