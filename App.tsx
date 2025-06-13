import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfilePage from './app/ProfilePage.tsx';

const Stack = createNativeStackNavigator();

export default function App() {
    return <ProfilePage />;
}
