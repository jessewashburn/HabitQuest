import { StyleSheet } from 'react-native';

const leaderboardStyles = StyleSheet.create({
  leaderboardContainer: {
    marginVertical: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  leaderboardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
  },
  leaderboardList: {
    marginTop: 8,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  leaderboardRank: {
    fontSize: 18,
    fontWeight: 'bold',
    width: 32,
    textAlign: 'center',
    color: '#4A6741',
  },
  leaderboardName: {
    flex: 1,
    fontSize: 16,
    color: '#222',
  },
  leaderboardScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6BA8D6',
    marginLeft: 8,
  },
  leaderboardHighlight: {
    backgroundColor: '#e6f7ff',
  },

  // Added styles to match usages in leaderboards.tsx
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 8,
    color: '#2D4E85',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f2f2f2',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
  },
  pickerContainer: {
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#2D4E85',
  },
  scrollContent: {
    marginTop: 16,
    flexGrow: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  loadingText: {
    fontSize: 18,
    marginTop: 16,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  entryCard: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#f2f2f2',
    marginBottom: 16,
    alignItems: 'center',
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: '#2D4E85',
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  entryContent: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#2D4E85',
  },
  statsRow: {
    flexDirection: 'column',
  },
  habitName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
    color: '#2D4E85',
  },
  statText: {
    fontSize: 12,
    color: '#555',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default leaderboardStyles;
