import { FontAwesome5, Ionicons } from "@expo/vector-icons"; // fix import
import { Tabs } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";


export default function TabLayout() {
  const [active, setActive] = useState(false);
  const toggleClick = () => setActive((prev) => !prev);

  return (
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#36978C",
          tabBarInactiveTintColor: "#666666",
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            height: 120,
            paddingBottom: 20,
            paddingTop: 10,
          },
          tabBarItemStyle: { paddingVertical: 5 },
          tabBarIconStyle: { marginBottom: 0 },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "",
            tabBarIcon: ({ color }) => (
              <View style={styles.regularIconContainer}>
                <Ionicons name="home" size={28} color={color} />
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="income"
          options={{
            title: "",
            tabBarIcon: ({ color }) => (
              <View style={styles.regularIconContainer}>
                <Ionicons name="stats-chart" size={28} color={color} />
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="budgetStatus"
          options={{
            title: "",
            tabBarIcon: ({ color }) => (
              <View style={styles.regularIconContainer}>
                <FontAwesome5 name="wallet" size={28} color={color} />
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="expenses"
          options={{
            title: "",
            tabBarIcon: ({ color }) => (
              <View style={styles.regularIconContainer}>
                <Ionicons name="pie-chart" size={28} color={color} />
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="account"
          options={{
            title: "",
            tabBarIcon: ({ color }) => (
              <View style={styles.regularIconContainer}>
                <Ionicons name="person" size={28} color={color} />
              </View>
            ),
          }}
        />
      </Tabs>
 
  );
}

const styles = StyleSheet.create({
  regularIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
  },
});
