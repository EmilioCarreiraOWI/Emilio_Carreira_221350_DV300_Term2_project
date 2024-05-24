import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";
import SplashScreen from "../Screens/SplashScreen";
import SignInScreen from "../Screens/SignInScreen";
import SignUpScreen from "../Screens/SignUpScreen";
import HomeScreen from "../Screens/HomeScreen";
import SearchScreen from "../Screens/searchScreen";
import ProfileScreen from "@/Screens/ProfileScreen";
import ActivityScreen from "@/Screens/ActivityScreen";
import CreateActivityScreen from "@/Screens/CreateActivityScreen";

const Tab = createBottomTabNavigator();

export default function Index() {
  const [showSplash, setShowSplash] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 5000); // 5 seconds delay
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
        console.log("User logged in..." + user.email);
      } else {
        setLoggedIn(false);
        console.log("No user logged in...");
      }
    });
    return unsubscribe;
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  if (!loggedIn) {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            switch (route.name) {
              case 'SignIn':
                iconName = focused ? 'log-in' : 'log-in-outline';
                break;
              case 'SignUp':
                iconName = focused ? 'person-add' : 'person-add-outline';
                break;
              default:
                iconName = 'alert-circle-outline'; // Default icon
            }
            return <Ionicons name={iconName as any} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#F3C94F',
          tabBarInactiveTintColor: '#108DF9B3',
          tabBarStyle: { backgroundColor: '#000' },
          headerShown: false
        })}
      >
        <Tab.Screen name="SignIn" component={SignInScreen} options={{ tabBarLabel: 'Sign In' }} />
        <Tab.Screen name="SignUp" component={SignUpScreen} options={{ tabBarLabel: 'Sign Up' }} />
      </Tab.Navigator>
    );
  }

  // If logged in, directly navigate to the Home screen within the Tab Navigator
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Search':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'CreateActivity':
              iconName = focused ? 'add' : 'add-outline';
              break;
            case 'Activity':
              iconName = focused ? 'pulse' : 'pulse-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'alert-circle-outline'; // Default icon
          }
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#F3C94F',
        tabBarInactiveTintColor: '#108DF9B3',
        tabBarStyle: { backgroundColor: '#000' },
        headerShown: false
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ tabBarLabel: 'Search' }} />
      <Tab.Screen name="CreateActivity" component={CreateActivityScreen} options={{ tabBarLabel: 'Create Activity' }} />
      <Tab.Screen name="Activity" component={ActivityScreen} options={{ tabBarLabel: 'Activity' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}
