import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { useApp } from '../context/AppContext';
import { COLORS } from '../utils/theme';

import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import StudyScreen from '../screens/StudyScreen';
import TopicDetailScreen from '../screens/TopicDetailScreen';
import PracticeScreen from '../screens/PracticeScreen';
import QuizScreen from '../screens/QuizScreen';
import MockTestScreen from '../screens/MockTestScreen';
import FlashcardsScreen from '../screens/FlashcardsScreen';
import ReviewScreen from '../screens/ReviewScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Cast screens to any to avoid strict prop-type conflicts with React Navigation's internal types
const S = {
  TopicDetail: TopicDetailScreen as any,
  Quiz: QuizScreen as any,
  MockTest: MockTestScreen as any,
  Flashcards: FlashcardsScreen as any,
  Home: HomeScreen as any,
  Study: StudyScreen as any,
  Practice: PracticeScreen as any,
  Review: ReviewScreen as any,
  Profile: ProfileScreen as any,
  Onboarding: OnboardingScreen as any,
};

function StudyStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StudyHome" component={S.Study} />
      <Stack.Screen name="TopicDetail" component={S.TopicDetail} />
      <Stack.Screen name="Flashcards" component={S.Flashcards} />
      <Stack.Screen name="Quiz" component={S.Quiz} />
    </Stack.Navigator>
  );
}

function PracticeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PracticeHome" component={S.Practice} />
      <Stack.Screen name="MockTest" component={S.MockTest} />
      <Stack.Screen name="Quiz" component={S.Quiz} />
      <Stack.Screen name="Flashcards" component={S.Flashcards} />
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={S.Home} />
      <Stack.Screen name="TopicDetail" component={S.TopicDetail} />
      <Stack.Screen name="Quiz" component={S.Quiz} />
      <Stack.Screen name="MockTest" component={S.MockTest} />
      <Stack.Screen name="Flashcards" component={S.Flashcards} />
    </Stack.Navigator>
  );
}

function ReviewStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ReviewHome" component={S.Review} />
      <Stack.Screen name="Quiz" component={S.Quiz} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileHome" component={S.Profile} />
      <Stack.Screen name="Onboarding" component={S.Onboarding} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, [string, string]> = {
            Home: ['home', 'home-outline'],
            Study: ['book', 'book-outline'],
            Practice: ['newspaper', 'newspaper-outline'],
            Review: ['star', 'star-outline'],
            Profile: ['person', 'person-outline'],
          };
          const [active, inactive] = icons[route.name] ?? ['ellipse', 'ellipse-outline'];
          return (
            <Ionicons name={(focused ? active : inactive) as any} size={size} color={color} />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Study" component={StudyStack} />
      <Tab.Screen name="Practice" component={PracticeStack} />
      <Tab.Screen name="Review" component={ReviewStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { profile, loading } = useApp();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {profile?.onboardingComplete ? <MainTabs /> : <OnboardingScreen />}
    </NavigationContainer>
  );
}
