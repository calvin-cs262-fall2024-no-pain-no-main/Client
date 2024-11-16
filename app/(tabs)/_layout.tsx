import { Tabs } from "expo-router";
import React from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { globalStyles } from "@/assets/styles/globalStyles";
import { theme } from "@/assets/styles/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background, // Tab bar background color
          borderTopWidth: 0, // Remove the border between the screen and the tab bar
        },
        tabBarActiveTintColor: theme.colors.secondary, // Active tab icon color
        tabBarInactiveTintColor: theme.colors.secondary, // Inactive tab icon color
      }}>
      <Tabs.Screen
        name="workouts"
        options={{
          title: "Workouts",
          tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? "menu" : "menu-outline"} color={color} />,
        }}
      />
      {/* Timer tab has been removed */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? "person" : "person-outline"} color={color} />,
        }}
      />
    </Tabs>
  );
}
