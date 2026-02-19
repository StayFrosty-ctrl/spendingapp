/**
 * Shared types - same shape as web App.tsx
 */

/** Purchase or savings entry (date + amount) */
export interface PurchaseEntry {
  date: string;
  amount: number;
  category?: string;
}

export type GoalType = 'no_spend' | 'save_by_date' | 'budget_cap';

export interface GoalBase {
  id: string;
  name: string;
  type: GoalType;
  createdAt: string;
}

export interface NoSpendGoal extends GoalBase {
  type: 'no_spend';
  categoryLabel?: string;
  currentStreak: number;
  bestStreak: number;
  lastCheckInDate: string | null;
  purchases: PurchaseEntry[];
}

export interface SaveByDateGoal extends GoalBase {
  type: 'save_by_date';
  targetAmount: number;
  endDate: string;
  savings: Array<{ date: string; amount: number }>;
}

export interface BudgetCapGoal extends GoalBase {
  type: 'budget_cap';
  limitAmount: number;
  period: 'week' | 'month';
  periodStartDate: string;
  purchases: PurchaseEntry[];
}

export type Goal = NoSpendGoal | SaveByDateGoal | BudgetCapGoal;

export function isNoSpendGoal(g: Goal): g is NoSpendGoal {
  return g.type === 'no_spend';
}
export function isSaveByDateGoal(g: Goal): g is SaveByDateGoal {
  return g.type === 'save_by_date';
}
export function isBudgetCapGoal(g: Goal): g is BudgetCapGoal {
  return g.type === 'budget_cap';
}

export interface UserData {
  onboardingComplete: boolean;
  userName: string;
  checkInTimes: {
    morning: boolean;
    evening: boolean;
    customTime?: string;
  };
  /** Legacy: used for migration only; primary data lives in goals[]. */
  currentStreak: number;
  bestStreak: number;
  monthlyNoSpendDays: number;
  lastCheckInDate: string | null;
  purchases: PurchaseEntry[];
  startDate: string;
  goals: Goal[];
  /** Theme: follow system or force light/dark. Default 'system'. */
  appearance?: 'system' | 'light' | 'dark';
}

export type Screen =
  | 'welcome'
  | 'promise'
  | 'checkInTime'
  | 'notificationPermission'
  | 'ready'
  | 'home'
  | 'nursery'
  | 'goalDetail'
  | 'createGoal'
  | 'checkIn'
  | 'checkInAckNoSpend'
  | 'checkInAckSpend'
  | 'logPurchase'
  | 'logSavings'
  | 'celebration'
  | 'settings';

/** Today's date in user's local timezone as YYYY-MM-DD (for once-per-day check-in). */
export function getTodayLocalDateString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export const INITIAL_USER_DATA: UserData = {
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
  goals: [],
  appearance: 'system',
};

export function generateGoalId(): string {
  return 'goal-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
}

/** One-time migration: if goals missing (not an array) and legacy streak/purchases exist, create one NoSpendGoal. */
export function migrateUserDataToGoals(data: UserData): UserData {
  const hasGoalsArray = Array.isArray(data.goals);
  const hasLegacyData =
    (data.currentStreak !== 0 || data.bestStreak !== 0 ||
      (data.purchases && data.purchases.length > 0) || !!data.lastCheckInDate);
  if (!hasGoalsArray) {
    if (hasLegacyData) {
      const legacyGoal: NoSpendGoal = {
        id: generateGoalId(),
        name: 'No unnecessary spending',
        type: 'no_spend',
        categoryLabel: 'unnecessary spending',
        createdAt: data.startDate || new Date().toISOString(),
        currentStreak: data.currentStreak ?? 0,
        bestStreak: data.bestStreak ?? 0,
        lastCheckInDate: data.lastCheckInDate ?? null,
        purchases: data.purchases ?? [],
      };
      return { ...data, goals: [legacyGoal] };
    }
    return { ...data, goals: [] };
  }
  return data;
}
