import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#eee',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    position: 'relative',
    overflow: 'visible',
  },
  // on mobile, push content to the right
  navMobile: {
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-start',
  },
  link: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  linkHover: {
    backgroundColor: '#ddd',
  },
  linkText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuIcon: {
    fontSize: 24,
    padding: 8,
  },
  mobileMenu: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
    paddingVertical: 8,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
});
