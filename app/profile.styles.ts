import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: '#2D4E85',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 8,
    color: '#2D4E85',
  },
  narrowContainer: {
    width: '80%',
    alignSelf: 'center',
  },
  levelInfoBlock: {
    alignItems: 'center',
    marginBottom: 2,
  },
  levelText: {
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  gradientBackground: {
    flex: 1,
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
  // Experience/level display styles
  levelContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  levelCard: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginTop: 6,
    marginBottom: 2,
    backgroundColor: '#f2f2f2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    minWidth: 220,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  xpText: {
    fontSize: 18,
    fontWeight: '600',
  },
  todayXpText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A6741',
  },
  loadingText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 8,
  },
  levelLoadingText: {
    fontSize: 16,
  },
  meta: {
    fontSize: 12,
    color: '#888',
  },
  levelSubtitle: {
    fontSize: 15,
    opacity: 0.8,
  },
});

export default styles;

