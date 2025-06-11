import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';

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
                  <TouchableOpacity style={styles.link} onPress={() => { setMenuOpen(false); router.push('/about'); }}>
                    <Text style={styles.linkText}>About</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.link} onPress={() => { setMenuOpen(false); router.push('/profile'); }}>
                    <Text style={styles.linkText}>Profile</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Modal>
          )}
        </>
      ) : (
        <>
          <Pressable onPress={() => router.push('/')} style={({ hovered }) => [styles.link, hovered && styles.linkHover]}>
            <Text style={styles.linkText}>Home</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/habits')} style={({ hovered }) => [styles.link, hovered && styles.linkHover]}>
            <Text style={styles.linkText}>Habits</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/friends')} style={({ hovered }) => [styles.link, hovered && styles.linkHover]}>
            <Text style={styles.linkText}>Friends</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/about')} style={({ hovered }) => [styles.link, hovered && styles.linkHover]}>
            <Text style={styles.linkText}>About</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/profile')} style={({ hovered }) => [styles.link, hovered && styles.linkHover]}>
            <Text style={styles.linkText}>Profile</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
