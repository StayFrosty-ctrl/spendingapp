import { useState, useEffect } from 'react';
import Welcome from './components/onboarding/Welcome';
import Promise from './components/onboarding/Promise';
import CheckInTime from './components/onboarding/CheckInTime';
import NotificationPermission from './components/onboarding/NotificationPermission';
import Ready from './components/onboarding/Ready';
import Home from './components/Home';
import CheckIn from './components/CheckIn';
import LogPurchase from './components/LogPurchase';
import Settings from './components/Settings';
import Celebration from './components/Celebration';

export interface UserData {
  onboardingComplete: boolean;
  userName: string;
  checkInTimes: {
    morning: boolean;
    evening: boolean;
    customTime?: string;
  };
  currentStreak: number;
  bestStreak: number;
  monthlyNoSpendDays: number;
  lastCheckInDate: string | null;
  purchases: Array<{
    date: string;
    amount: number;
    category?: string;
  }>;
  startDate: string;
}

export type Screen = 
  | 'welcome' 
  | 'promise' 
  | 'checkInTime' 
  | 'notificationPermission' 
  | 'ready'
  | 'home'
  | 'checkIn'
  | 'logPurchase'
  | 'celebration'
  | 'settings';

const STORAGE_KEY = 'grove_user_data';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [userData, setUserData] = useState<UserData>({
    onboardingComplete: false,
    userName: 'Friend',
    checkInTimes: {
      morning: false,
      evening: true,
      customTime: undefined,
    },
    currentStreak: 0,
    bestStreak: 0,
    monthlyNoSpendDays: 0,
    lastCheckInDate: null,
    purchases: [],
    startDate: new Date().toISOString(),
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsedData = JSON.parse(stored);
        setUserData(parsedData);
        if (parsedData.onboardingComplete) {
          setCurrentScreen('home');
        }
      } catch (e) {
        console.error('Failed to parse stored data');
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  }, [userData]);

  const updateUserData = (updates: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...updates }));
  };

  const logPurchase = (amount: number, category?: string) => {
    const today = new Date().toISOString().split('T')[0];
    const newPurchase = {
      date: today,
      amount,
      category,
    };

    setUserData(prev => {
      const newStreak = 0; // Reset current streak
      const purchases = [...prev.purchases, newPurchase];
      
      return {
        ...prev,
        purchases,
        currentStreak: newStreak,
        lastCheckInDate: today,
      };
    });
  };

  const logNoSpend = () => {
    const today = new Date().toISOString().split('T')[0];
    
    setUserData(prev => {
      const newStreak = prev.currentStreak + 1;
      const newBestStreak = Math.max(newStreak, prev.bestStreak);
      
      // Check if we need to reset monthly counter
      const lastCheckDate = prev.lastCheckInDate ? new Date(prev.lastCheckInDate) : null;
      const currentDate = new Date(today);
      const isNewMonth = lastCheckDate && (
        lastCheckDate.getMonth() !== currentDate.getMonth() ||
        lastCheckDate.getFullYear() !== currentDate.getFullYear()
      );
      
      const newMonthlyNoSpendDays = isNewMonth ? 1 : prev.monthlyNoSpendDays + 1;
      
      return {
        ...prev,
        currentStreak: newStreak,
        bestStreak: newBestStreak,
        monthlyNoSpendDays: newMonthlyNoSpendDays,
        lastCheckInDate: today,
      };
    });
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <Welcome onNext={() => setCurrentScreen('promise')} />;
      case 'promise':
        return <Promise onNext={() => setCurrentScreen('checkInTime')} />;
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
              setCurrentScreen('home');
            }}
          />
        );
      case 'home':
        return (
          <Home
            userData={userData}
            onCheckIn={() => setCurrentScreen('checkIn')}
            onLogPurchase={() => setCurrentScreen('logPurchase')}
            onSettings={() => setCurrentScreen('settings')}
          />
        );
      case 'checkIn':
        return (
          <CheckIn
            onYes={() => setCurrentScreen('logPurchase')}
            onNo={() => {
              logNoSpend();
              setCurrentScreen('celebration');
            }}
          />
        );
      case 'logPurchase':
        return (
          <LogPurchase
            onSubmit={(amount, category) => {
              logPurchase(amount, category);
              setCurrentScreen('home');
            }}
            onCancel={() => setCurrentScreen('home')}
            hadStreak={userData.currentStreak}
          />
        );
      case 'celebration':
        return (
          <Celebration
            streak={userData.currentStreak}
            onContinue={() => setCurrentScreen('home')}
          />
        );
      case 'settings':
        return (
          <Settings
            userData={userData}
            onUpdate={updateUserData}
            onBack={() => setCurrentScreen('home')}
            onClearData={() => {
              localStorage.removeItem(STORAGE_KEY);
              window.location.reload();
            }}
          />
        );
      default:
        return <Welcome onNext={() => setCurrentScreen('promise')} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md">
        {renderScreen()}
      </div>
    </div>
  );
}

export default App;