import { ThemeProvider } from '@/hooks/ThemeContext.tsx';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';

import { HapticTab } from '@/components/HapticTab.tsx';
import { IconSymbol } from '@/components/ui/IconSymbol.tsx';
import TabBarBackground from '@/components/ui/TabBarBackground.tsx';
import { Colors } from '@/constants/Colors.ts';
import { useColorScheme } from '@/hooks/useColorScheme.ts';

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
