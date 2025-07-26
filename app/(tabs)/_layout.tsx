import { ThemeProvider } from '@/hooks/ThemeContext';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider>
      <View style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            tabBarButton: HapticTab,
            tabBarBackground: TabBarBackground,
            tabBarStyle: Platform.select({
              ios: {
                position: 'absolute',
              },
              default: {},
            }),
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color }: { color: string }) => (
                <IconSymbol size={28} name="house.fill" color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="explore"
            options={{
              title: 'Explore',
              tabBarIcon: ({ color }: { color: string }) => (
                <IconSymbol size={28} name="paperplane.fill" color={color} />
              ),
            }}
          />
        </Tabs>
      </View>
    </ThemeProvider>
  );
}
