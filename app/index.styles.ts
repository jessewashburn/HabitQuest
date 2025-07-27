import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  //Home styles
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
  // Login/Register form styles
  formContainer: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
  },
  input: {
    width: '100%',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#B8D4F0',
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: '#2D4E85',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#2D4E85',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#2D4E85',
    fontSize: 16,
    fontWeight: '600',
  },
  orText: {
    marginVertical: 12,
    color: '#666',
    textAlign: 'center',
    fontSize: 14,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginBottom: 8,
    marginTop: -8,
  },
  inputError: {
    borderColor: '#e74c3c',
    borderWidth: 2,
  },
  statsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
    alignItems: 'center',
  },
  statsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D4E85',
    textAlign: 'center',
  },
  // Habit task styles
  habitTaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2D4E85',
  },
  completedTaskItem: {
    backgroundColor: '#e8f5e8',
    borderLeftColor: '#28a745',
    opacity: 0.7,
  },
  habitTaskInfo: {
    flex: 1,
  },
  habitTaskName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  completedTaskName: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  habitCategory: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
  },
  completeButton: {
    backgroundColor: '#2D4E85',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  completingButton: {
    backgroundColor: '#5a7bb8',
  },
  completeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  completedBadge: {
    color: '#28a745',
    fontSize: 14,
    fontWeight: '600',
  },
  // Category level styles
  categoryLevelItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff4e6',
    padding: 10,
    borderRadius: 6,
    marginBottom: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#ff9500',
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  categoryLevel: {
    fontSize: 12,
    color: '#666',
  },
});

export default styles;
