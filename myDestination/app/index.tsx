import React, { useState, useEffect } from "react";
import { View, Image } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";
import Logo from '../assets/images/myDestinationLogo.png';
import SplashScreen from "../Screens/SplashScreen";
import SignInScreen from "../Screens/SignInScreen";
import SignUpScreen from "../Screens/SignUpScreen";
import HomeScreen from "../Screens/HomeScreen";
import SearchScreen from "../Screens/searchScreen";
import ProfileScreen from "@/Screens/ProfileScreen";
import ActivityScreen from "@/Screens/ActivityScreen";
import CreateActivityScreen from "@/Screens/CreateActivityScreen";
import DetailedUserScreen from "@/Screens/DetailedUserScreen";
import RewardScreen from "@/Screens/RewardScreen"; // Import RewardScreen
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

// Define the types for navigation parameters
export type RootStackParamList = {
  Home: undefined;
  ActivityScreen: { userId: string; id: string; };
  Profile: { userId: string };
  DetailedUser: { userId: string };
  SignInScreen: undefined;
};

// Define props for ActivityScreen
interface ActivityScreenProps {
  userId: string;
}

// Create navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();
const SearchStack = createStackNavigator();
const UserActivityStack = createStackNavigator();

// Stack navigator for Home
function HomeStack() {
  return (
      <Stack.Navigator
        screenOptions={{
          headerTitle: () => <LogoTitle />,
          headerStyle: { backgroundColor: '#108DF9' },
          headerTintColor: '#FFF',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
        initialRouteName="Home"
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
        />
        <Stack.Screen 
          name="ActivityScreen" 
          component={ActivityScreen}
          initialParams={{ userId: '' }}
        />
      </Stack.Navigator>
  );
}

// Stack navigator for searching users
function SearchUserStack() {
  return (
    <SearchStack.Navigator
      screenOptions={{
        headerTitle: () => <LogoTitle />,
        headerStyle: { backgroundColor: '#108DF9' },
        headerTintColor: '#FFF',
        headerTitleStyle: { fontWeight: 'bold' }
      }}
      initialRouteName="Back"
    >
      <SearchStack.Screen
        name="Back"
        component={SearchScreen}
      />
      <SearchStack.Screen
        name="DetailedUser"
        component={DetailedUserScreen}
      />
    </SearchStack.Navigator>
  );
}

// Stack navigator for user activities
function UserActivityStackScreen() {
  return (
    <UserActivityStack.Navigator
      screenOptions={{
        headerTitle: () => <LogoTitle />,
        headerStyle: { backgroundColor: '#108DF9' },
        headerTintColor: '#FFF',
        headerTitleStyle: { fontWeight: 'bold' }
      }}
      initialRouteName="DetailedUser"
    >
      <UserActivityStack.Screen
        name="DetailedUser"
        component={DetailedUserScreen}
      />
      <UserActivityStack.Screen
        name="ActivityScreen"
        component={ActivityScreen}
        initialParams={{ userId: '' }}
      />
    </UserActivityStack.Navigator>
  );
}

// Logo component used in the header
function LogoTitle() {
  return (
    <Image
      style={{ width: 50, height: 50 }}
      source={Logo}
    />
  );
}

// Main component
export default function Index() {
  const [showSplash, setShowSplash] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const auth = getAuth();

  // Handle splash screen timing
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 5000); // 5 seconds delay
    return () => clearTimeout(timer);
  }, []);

  // Monitor authentication state
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

  // Display splash screen if applicable
  if (showSplash) {
    return <SplashScreen />;
  }

  // Display authentication screens if not logged in
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
          tabBarActiveTintColor: '#FFF',
          tabBarInactiveTintColor: '#323232',
          tabBarStyle: { backgroundColor: '#108DF9' },
          headerShown: false
        })}
      >
        <Tab.Screen name="SignIn" component={SignInScreen} options={{ tabBarLabel: 'Sign In' }} />
        <Tab.Screen name="SignUp" component={SignUpScreen} options={{ tabBarLabel: 'Sign Up' }} />
      </Tab.Navigator>
    );
  }

  // Main app navigation if logged in
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'HomeStack':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'SearchUserStack':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'CreateActivityScreen':
              iconName = focused ? 'create' : 'create-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            case 'RewardScreen': // Add RewardScreen icon
              iconName = focused ? 'trophy' : 'trophy-outline';
              break;
            default:
              iconName = 'alert-circle-outline'; // Default icon
          }
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FFF',
        tabBarInactiveTintColor: '#323232',
        tabBarStyle: { backgroundColor: '#108DF9' },
        headerShown: false
      })}
    >
      <Tab.Screen name="HomeStack" component={HomeStack} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="SearchUserStack" component={SearchUserStack} options={{ tabBarLabel: 'Search' }} />
      <Tab.Screen name="CreateActivityScreen" component={CreateActivityScreen} options={{ tabBarLabel: 'Create Activity' }} />
      <Tab.Screen name="RewardScreen" component={RewardScreen} options={{ tabBarLabel: 'Rewards' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

// Use the defined types in your component
function SomeComponent() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Component logic here
  navigation.navigate('ActivityScreen', { userId: 'someUserId', id: 'someId' });
}
