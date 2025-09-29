import { Ionicons } from "@expo/vector-icons"; // fix import
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Tabs } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, View } from "react-native";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

export default function TabLayout() {
  const [active, setActive] = useState(false);
  const toggleClick = () => setActive((prev) => !prev);

  return (
    <ConvexProvider client={convex}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#36978C",
          tabBarInactiveTintColor: "#666666",
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopWidth: 1,
            borderTopColor: "#E5E5E5",
            height: 120,
            paddingBottom: 20,
            paddingTop: 10,
            elevation: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
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
            tabBarIcon: ({ focused }) => (
              <View style={styles.centerIconContainer}>
                <View
                  style={[
                    styles.centerIconCircle,
                    { backgroundColor: "#81D8D0" },
                  ]}
                >
                  <Image
                    source={require("../../assets/images/PigLogo.png")}
                    style={[
                      styles.centerIcon,
                      { tintColor: focused ? "#36978C" : "#12312D" },
                    ]}
                    resizeMode="contain"
                  />
                </View>
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
    </ConvexProvider>
  );
}

const styles = StyleSheet.create({
  regularIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
  },
  centerIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    top: -15,
  },
  centerIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: "#36978C",
  },
  centerIcon: {
    width: 40,
    height: 40,
  },
});
