import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
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
    color: '#2D4E85',
  },
  subtitle: {
    fontSize: 16,
    color: '#2D4E85',
    marginBottom: 24,
    textAlign: 'center',
  },
  sectionsContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  section: {
    minWidth: 280,
    flex: 1,
    marginBottom: 20,
    paddingHorizontal: 12,
    maxWidth: '48%',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D4E85',
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
