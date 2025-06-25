import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 18,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#5e60ce',
    marginBottom: 8,
  },
  habitItem: {
    fontSize: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#e6e8ff',
    borderRadius: 8,
    marginBottom: 6,
    color: '#333',
  },
});

export default styles;
