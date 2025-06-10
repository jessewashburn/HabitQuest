import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 480;
  return (
    <View style={[styles.nav, isMobile && styles.navMobile]}>
      {isMobile ? (
        <>
          <TouchableOpacity onPress={() => setMenuOpen(prev => !prev)}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
          {menuOpen && (
            <Modal transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
              <TouchableOpacity style={styles.modalBackdrop} onPress={() => setMenuOpen(false)} activeOpacity={1}>
                <View style={styles.mobileMenu}>
                  <TouchableOpacity style={styles.link} onPress={() => { setMenuOpen(false); router.push('/'); }}>
                    <Text style={styles.linkText}>Home</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.link} onPress={() => { setMenuOpen(false); router.push('/habits'); }}>
                    <Text style={styles.linkText}>Habits</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.link} onPress={() => { setMenuOpen(false); router.push('/friends'); }}>
                    <Text style={styles.linkText}>Friends</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.link} onPress={() => { setMenuOpen(false); router.push('/profile'); }}>
                    <Text style={styles.linkText}>Profile</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.link} onPress={() => { setMenuOpen(false); router.push('/about'); }}>
                    <Text style={styles.linkText}>About</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Modal>
          )}
        </>
      ) : (
        <>
          <Link href="/" style={styles.link}><Text style={styles.linkText}>Home</Text></Link>
          <Link href="/habits" style={styles.link}><Text style={styles.linkText}>Habits</Text></Link>
          <Link href="/friends" style={styles.link}><Text style={styles.linkText}>Friends</Text></Link>
          <Link href="/profile" style={styles.link}><Text style={styles.linkText}>Profile</Text></Link>
          <Link href="/about" style={styles.link}><Text style={styles.linkText}>About</Text></Link>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
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
    // Covers full screen to detect outside taps
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-start',
  },
  link: {
    paddingVertical: 8,
    paddingHorizontal: 12,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    paddingVertical: 8,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
});
