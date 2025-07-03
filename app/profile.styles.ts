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
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 8,
    color: '#2D4E85',
  },
  text: {
    fontSize: 18,
    color: '#2D4E85',
  },
  nameText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  nameInput: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D4E85',
    borderBottomWidth: 2,
    borderBottomColor: '#2D4E85',
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 8,
    textAlign: 'center',
    minWidth: 200,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  imageHint: {
    fontSize: 12,
    color: '#2D4E85',
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.7,
  },
  disabledImage: {
    opacity: 0.6,
  },
  button: {
    backgroundColor: '#2D4E85',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondary: {
    backgroundColor: '#6BA8D6',
  },
  buttonDanger: {
    backgroundColor: '#F44336',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  textInput: {
    height: 40,
    width: '80%',
    borderColor: '#888',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});

export default styles;
