import { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts as useInterFonts,
  Inter_400Regular,
  Inter_500Medium,
} from '@expo-google-fonts/inter';
import {
  useFonts as useNunitoFonts,
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from '@expo-google-fonts/nunito';
import { loadUserData, saveUserData, clearUserData } from './src/storage';
import type { UserData, Screen, Goal } from './src/types';
import {
  INITIAL_USER_DATA,
  getTodayLocalDateString,
  migrateUserDataToGoals,
  isNoSpendGoal,
  isSaveByDateGoal,
} from './src/types';
import { ThemeProvider, useTheme } from './src/theme';

import Welcome from './src/screens/onboarding/Welcome';
import PromiseScreen from './src/screens/onboarding/Promise';
import CheckInTime from './src/screens/onboarding/CheckInTime';
import NotificationPermission from './src/screens/onboarding/NotificationPermission';
import Ready from './src/screens/onboarding/Ready';
import Nursery from './src/screens/Nursery';
import CreateGoal from './src/screens/CreateGoal';
import GoalDetail from './src/screens/GoalDetail';
import CheckIn from './src/screens/CheckIn';
import LogPurchase from './src/screens/LogPurchase';
import LogSavings from './src/screens/LogSavings';
import Celebration from './src/screens/Celebration';
import Settings from './src/screens/Settings';
import CheckInAckNoSpend from './src/screens/CheckInAckNoSpend';
import CheckInAckSpend from './src/screens/CheckInAckSpend';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [userData, setUserData] = useState<UserData>(INITIAL_USER_DATA);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  const [interLoaded] = useInterFonts({ Inter_400Regular, Inter_500Medium });
  const [nunitoLoaded] = useNunitoFonts({
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });
  const fontsLoaded = interLoaded && nunitoLoaded;

  useEffect(() => {
    let mounted = true;
    loadUserData().then((raw) => {
      if (!mounted || !raw) return;
      const data = migrateUserDataToGoals(raw as UserData);
      setUserData(data);
      if (data.onboardingComplete) {
        setCurrentScreen('nursery');
      }
    });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!userData) return;
    saveUserData(userData);
  }, [userData]);

  useEffect(() => {
    if (
      currentScreen === 'goalDetail' &&
      selectedGoalId &&
      !userData.goals?.some((g) => g.id === selectedGoalId)
    ) {
      setSelectedGoalId(null);
      setCurrentScreen('nursery');
    }
  }, [currentScreen, selectedGoalId, userData.goals]);


  const updateUserData = useCallback((updates: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateGoal = useCallback((goalId: string, updater: (goal: Goal) => Goal) => {
    setUserData((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => (g.id === goalId ? updater(g) : g)),
    }));
  }, []);

  const addGoal = useCallback((goal: Goal) => {
    setUserData((prev) => ({ ...prev, goals: [...(prev.goals || []), goal] }));
    setSelectedGoalId(goal.id);
    setCurrentScreen('goalDetail');
  }, []);

  const logNoSpendForGoal = useCallback((goalId: string) => {
    const today = getTodayLocalDateString();
    updateGoal(goalId, (g) => {
      if (!isNoSpendGoal(g)) return g;
      const newStreak = g.currentStreak + 1;
      return {
        ...g,
        currentStreak: newStreak,
        bestStreak: Math.max(newStreak, g.bestStreak),
        lastCheckInDate: today,
      };
    });
  }, [updateGoal]);

  const setLastCheckInDateForGoal = useCallback((goalId: string) => {
    const today = getTodayLocalDateString();
    updateGoal(goalId, (g) => (isNoSpendGoal(g) ? { ...g, lastCheckInDate: today } : g));
  }, [updateGoal]);

  const logPurchaseForGoal = useCallback((goalId: string, amount: number, category?: string) => {
    const today = getTodayLocalDateString();
    setUserData((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => {
        if (g.id !== goalId) return g;
        if (isNoSpendGoal(g)) {
          return {
            ...g,
            purchases: [...g.purchases, { date: today, amount, category }],
            currentStreak: 0,
            lastCheckInDate: today,
          };
        }
        if (g.type === 'budget_cap') {
          return { ...g, purchases: [...g.purchases, { date: today, amount, category }] };
        }
        return g;
      }),
    }));
  }, []);

  const logSavingsForGoal = useCallback((goalId: string, amount: number) => {
    const today = getTodayLocalDateString();
    updateGoal(goalId, (g) => {
      if (!isSaveByDateGoal(g)) return g;
      return { ...g, savings: [...g.savings, { date: today, amount }] };
    });
  }, [updateGoal]);

  const logPurchase = useCallback((amount: number, category?: string) => {
    const today = getTodayLocalDateString();
    setUserData((prev) => ({
      ...prev,
      purchases: [...prev.purchases, { date: today, amount, category }],
      currentStreak: 0,
      lastCheckInDate: today,
    }));
  }, []);

  const logNoSpend = useCallback(() => {
    const today = getTodayLocalDateString();
    setUserData((prev) => {
      const newStreak = prev.currentStreak + 1;
      const newBestStreak = Math.max(newStreak, prev.bestStreak);
      const lastCheckDate = prev.lastCheckInDate ? new Date(prev.lastCheckInDate) : null;
      const currentDate = new Date(today);
      const isNewMonth =
        lastCheckDate &&
        (lastCheckDate.getMonth() !== currentDate.getMonth() ||
          lastCheckDate.getFullYear() !== currentDate.getFullYear());
      const newMonthlyNoSpendDays = isNewMonth ? 1 : prev.monthlyNoSpendDays + 1;
      return {
        ...prev,
        currentStreak: newStreak,
        bestStreak: newBestStreak,
        monthlyNoSpendDays: newMonthlyNoSpendDays,
        lastCheckInDate: today,
      };
    });
  }, []);

  const handleClearData = useCallback(async () => {
    await clearUserData();
    setUserData(INITIAL_USER_DATA);
    setSelectedGoalId(null);
    setCurrentScreen('welcome');
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <Welcome onNext={() => setCurrentScreen('promise')} />;
      case 'promise':
        return <PromiseScreen onNext={() => setCurrentScreen('checkInTime')} />;
      case 'checkInTime':
        return (
          <CheckInTime
            checkInTimes={userData.checkInTimes}
            onUpdate={(times) => updateUserData({ checkInTimes: times })}
            onNext={() => setCurrentScreen('notificationPermission')}
          />
        );
      case 'notificationPermission':
        return <NotificationPermission onNext={() => setCurrentScreen('ready')} />;
      case 'ready':
        return (
          <Ready
            checkInTimes={userData.checkInTimes}
            onNext={() => {
              updateUserData({ onboardingComplete: true });
              setCurrentScreen('nursery');
            }}
          />
        );
      case 'nursery':
        return (
          <Nursery
            userData={userData}
            onSelectGoal={(id) => {
              setSelectedGoalId(id);
              setCurrentScreen('goalDetail');
            }}
            onCreateGoal={() => setCurrentScreen('createGoal')}
            onSettings={() => setCurrentScreen('settings')}
          />
        );
      case 'goalDetail': {
        const goal = userData.goals?.find((g) => g.id === selectedGoalId);
        if (!goal) return null;
        return (
          <GoalDetail
            goal={goal}
            onBack={() => {
              setSelectedGoalId(null);
              setCurrentScreen('nursery');
            }}
            onCheckIn={() => setCurrentScreen('checkIn')}
            onLogPurchase={() => setCurrentScreen('logPurchase')}
            onLogSavings={() => setCurrentScreen('logSavings')}
          />
        );
      }
      case 'createGoal':
        return (
          <CreateGoal
            onSubmit={(g) => addGoal(g)}
            onBack={() => setCurrentScreen('nursery')}
          />
        );
      case 'home':
        return (
          <Nursery
            userData={userData}
            onSelectGoal={(id) => {
              setSelectedGoalId(id);
              setCurrentScreen('goalDetail');
            }}
            onCreateGoal={() => setCurrentScreen('createGoal')}
            onSettings={() => setCurrentScreen('settings')}
          />
        );
      case 'checkIn': {
        const goal = selectedGoalId ? userData.goals?.find((g) => g.id === selectedGoalId) : null;
        const question =
          goal && isNoSpendGoal(goal)
            ? `Did you spend on ${goal.categoryLabel || goal.name} today?`
            : 'Did you stick to your goal today?';
        return (
          <CheckIn
            question={question}
            onYes={() => {
              if (selectedGoalId) setLastCheckInDateForGoal(selectedGoalId);
              else updateUserData({ lastCheckInDate: getTodayLocalDateString() });
              setCurrentScreen('checkInAckSpend');
            }}
            onNo={() => {
              if (selectedGoalId) logNoSpendForGoal(selectedGoalId);
              else logNoSpend();
              setCurrentScreen('checkInAckNoSpend');
            }}
          />
        );
      }
      case 'checkInAckNoSpend':
        return (
          <CheckInAckNoSpend
            onContinue={() => setCurrentScreen('celebration')}
          />
        );
      case 'checkInAckSpend':
        return (
          <CheckInAckSpend onContinue={() => setCurrentScreen('logPurchase')} />
        );
      case 'logPurchase': {
        const goal = selectedGoalId ? userData.goals?.find((g) => g.id === selectedGoalId) : null;
        const hadStreak = goal && isNoSpendGoal(goal) ? goal.currentStreak : userData.currentStreak;
        return (
          <LogPurchase
            onSubmit={(amount, category) => {
              if (selectedGoalId) logPurchaseForGoal(selectedGoalId, amount, category);
              else logPurchase(amount, category);
              setCurrentScreen(selectedGoalId ? 'goalDetail' : 'nursery');
            }}
            onCancel={() =>
              setCurrentScreen(selectedGoalId ? 'goalDetail' : 'nursery')
            }
            hadStreak={hadStreak}
          />
        );
      }
      case 'logSavings': {
        const goal = selectedGoalId ? userData.goals?.find((g) => g.id === selectedGoalId) : null;
        if (!goal || !isSaveByDateGoal(goal)) {
          setCurrentScreen(selectedGoalId ? 'goalDetail' : 'nursery');
          return null;
        }
        return (
          <LogSavings
            goalName={goal.name}
            onSubmit={(amount) => {
              logSavingsForGoal(goal.id, amount);
              setCurrentScreen('goalDetail');
            }}
            onCancel={() => setCurrentScreen('goalDetail')}
          />
        );
      }
      case 'celebration': {
        const goal = selectedGoalId ? userData.goals?.find((g) => g.id === selectedGoalId) : null;
        const streak = goal && isNoSpendGoal(goal) ? goal.currentStreak : userData.currentStreak;
        return (
          <Celebration
            streak={streak}
            onContinue={() =>
              setCurrentScreen(selectedGoalId ? 'goalDetail' : 'nursery')
            }
          />
        );
      }
      case 'settings':
        return (
          <Settings
            userData={userData}
            onUpdate={updateUserData}
            onBack={() => setCurrentScreen('nursery')}
            onClearData={handleClearData}
          />
        );
      default:
        return <Welcome onNext={() => setCurrentScreen('promise')} />;
    }
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider
        appearance={userData.appearance ?? 'system'}
        onAppearanceChange={(mode) => updateUserData({ appearance: mode })}
      >
        <AppContent renderScreen={renderScreen} />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function AppContent({ renderScreen }: { renderScreen: () => React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View
        style={[
          styles.inner,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
        ]}
      >
        {renderScreen()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    maxWidth: 448,
    width: '100%',
    alignSelf: 'center',
  },
});
