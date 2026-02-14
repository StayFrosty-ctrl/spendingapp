import { motion } from 'motion/react';
import { Plus, Settings as SettingsIcon, TrendingDown, TrendingUp } from 'lucide-react';
import { UserData } from '../App';
import StreakVisualization from './StreakVisualization';

interface HomeProps {
  userData: UserData;
  onCheckIn: () => void;
  onLogPurchase: () => void;
  onSettings: () => void;
}

export default function Home({ userData, onCheckIn, onLogPurchase, onSettings }: HomeProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getThisWeekSpending = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return userData.purchases
      .filter(p => new Date(p.date) >= weekAgo)
      .reduce((sum, p) => sum + p.amount, 0);
  };

  const getLastWeekSpending = () => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    return userData.purchases
      .filter(p => {
        const date = new Date(p.date);
        return date >= twoWeeksAgo && date < weekAgo;
      })
      .reduce((sum, p) => sum + p.amount, 0);
  };

  const getMonthlySpending = () => {
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return userData.purchases
      .filter(p => new Date(p.date) >= firstOfMonth)
      .reduce((sum, p) => sum + p.amount, 0);
  };

  const getLastMonthSpending = () => {
    const now = new Date();
    const firstOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const firstOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return userData.purchases
      .filter(p => {
        const date = new Date(p.date);
        return date >= firstOfLastMonth && date < firstOfThisMonth;
      })
      .reduce((sum, p) => sum + p.amount, 0);
  };

  const thisWeek = getThisWeekSpending();
  const lastWeek = getLastWeekSpending();
  const thisMonth = getMonthlySpending();
  const lastMonth = getLastMonthSpending();
  const weekDifference = thisWeek - lastWeek;

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pb-24"
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-2xl font-bold text-[#3D3229]">
              {getGreeting()}, {userData.userName}
            </h2>
            <p className="text-sm text-[#7A7067] mt-1">{formatDate()}</p>
          </div>
          <button
            onClick={onSettings}
            className="p-3 rounded-full hover:bg-[#EDE6DC] transition-colors"
          >
            <SettingsIcon className="w-6 h-6 text-[#7A7067]" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Streak Hero Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mx-6 mb-6"
      >
        <StreakVisualization
          currentStreak={userData.currentStreak}
          bestStreak={userData.bestStreak}
          monthlyNoSpendDays={userData.monthlyNoSpendDays}
        />
      </motion.div>

      {/* This Week vs Last Week */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mx-6 mb-6 bg-[#EDE6DC] rounded-2xl p-6"
        style={{ boxShadow: '0 4px 16px rgba(61, 50, 41, 0.06)' }}
      >
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-[#7A7067] mb-1">This week</p>
            <p className="text-2xl font-bold text-[#3D3229]">${thisWeek.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-[#7A7067] mb-1">Last week</p>
            <p className="text-2xl font-bold text-[#3D3229]">${lastWeek.toFixed(2)}</p>
          </div>
        </div>

        {weekDifference !== 0 && (
          <div className={`flex items-center gap-2 text-sm ${
            weekDifference < 0 ? 'text-[#87A878]' : 'text-[#7A7067]'
          }`}>
            {weekDifference < 0 ? (
              <>
                <TrendingDown className="w-4 h-4" strokeWidth={2} />
                <span>You're spending ${Math.abs(weekDifference).toFixed(2)} less this week 🌿</span>
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4" strokeWidth={2} />
                <span>That's ${weekDifference.toFixed(2)} more than last week - you've got this</span>
              </>
            )}
          </div>
        )}

        {weekDifference === 0 && thisWeek > 0 && (
          <p className="text-sm text-[#7A7067]">Holding steady</p>
        )}
      </motion.div>

      {/* Monthly Overview */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mx-6 mb-6 bg-[#EDE6DC] rounded-2xl p-6"
        style={{ boxShadow: '0 4px 16px rgba(61, 50, 41, 0.06)' }}
      >
        <h3 className="font-semibold text-[#3D3229] mb-4">Monthly Overview</h3>
        
        <div className="mb-4">
          <p className="text-sm text-[#7A7067] mb-1">This month</p>
          <p className="text-3xl font-bold text-[#3D3229]">${thisMonth.toFixed(2)}</p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-[#7A7067]">vs ${lastMonth.toFixed(2)} last month</span>
          {thisMonth < lastMonth && (
            <span className="text-[#87A878] font-medium">
              -${(lastMonth - thisMonth).toFixed(2)}
            </span>
          )}
        </div>

        {/* Simple bar visualization */}
        <div className="mt-4 h-2 bg-[#FAF6F1] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((thisMonth / (lastMonth || 100)) * 100, 100)}%` }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="h-full bg-gradient-to-r from-[#87A878] to-[#C4785A] rounded-full"
          />
        </div>
      </motion.div>

      {/* Quick Check-in Button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mx-6"
      >
        <button
          onClick={onCheckIn}
          className="w-full bg-gradient-to-r from-[#C4785A] to-[#87A878] text-[#FAF6F1] py-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
          style={{ boxShadow: '0 8px 24px rgba(61, 50, 41, 0.12)' }}
        >
          Quick check-in 🌱
        </button>
      </motion.div>

      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6, type: "spring" }}
        whileTap={{ scale: 0.9 }}
        onClick={onLogPurchase}
        className="fixed bottom-8 right-8 bg-[#C4785A] text-[#FAF6F1] p-4 rounded-full shadow-xl hover:shadow-2xl transition-shadow"
        style={{ boxShadow: '0 12px 32px rgba(196, 120, 90, 0.3)' }}
      >
        <Plus className="w-6 h-6" strokeWidth={2.5} />
      </motion.button>
    </motion.div>
  );
}
