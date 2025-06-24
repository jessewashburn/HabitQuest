import { Text, View } from 'react-native';
import styles from './index.styles';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Habit Quest</Text>
      <Text style={styles.subtitle}>Track your habits. Level up your life.</Text>
    </View>
  );
}
