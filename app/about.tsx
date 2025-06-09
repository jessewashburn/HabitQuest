import React from 'react';
import { Text, View } from 'react-native';
import styles from './about.styles';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>About Page</Text>
    </View>
  );
}
