import { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag } from 'lucide-react';

interface LogPurchaseProps {
  onSubmit: (amount: number, category?: string) => void;
  onCancel: () => void;
  hadStreak?: number;
}

const categories = [
  'Household',
  'Electronics',
  'Clothes',
  'Food',
  'Entertainment',
  'Other',
];

export default function LogPurchase({ onSubmit, onCancel, hadStreak }: LogPurchaseProps) {
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    if (numAmount > 0) {
      onSubmit(numAmount, selectedCategory);
    }
  };

  const handleAmountChange = (value: string) => {
    // Allow only numbers and decimal point
    if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
      setAmount(value);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen flex-col p-8"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-[#D4A5A5] bg-opacity-30 rounded-full p-3">
            <ShoppingBag className="w-6 h-6 text-[#D4A5A5]" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-[#3D3229]">
            No worries - let's log it
          </h1>
        </div>
        <p className="text-sm text-[#7A7067]">
          Awareness is the first step. You're doing great.
        </p>
        
        {hadStreak && hadStreak >= 3 && (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 bg-[#87A878] bg-opacity-10 rounded-2xl p-4 border-l-4 border-[#87A878]"
          >
            <p className="text-sm text-[#87A878] font-medium">
              One day doesn't erase your {hadStreak}-day awareness streak. You're building something meaningful.
            </p>
          </motion.div>
        )}
      </motion.div>

      <div className="flex-1">
        {/* Amount Input */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: hadStreak && hadStreak >= 3 ? 0.4 : 0.2 }}
          className="mb-8"
        >
          <label className="block text-sm text-[#7A7067] mb-3">
            How much did you spend?
          </label>
          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-4xl font-bold text-[#7A7067]">
              $
            </span>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0.00"
              className="w-full bg-[#EDE6DC] text-5xl font-bold text-[#3D3229] pl-16 pr-6 py-6 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#C4785A] focus:ring-opacity-30"
              autoFocus
            />
          </div>
        </motion.div>

        {/* Category Selection */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm text-[#7A7067] mb-3">
            What was it for? <span className="text-[#7A7067] opacity-60">(optional)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <motion.button
                key={category}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(
                  selectedCategory === category ? undefined : category
                )}
                className={`px-4 py-2 rounded-full transition-all ${
                  selectedCategory === category
                    ? 'bg-[#C4785A] text-[#FAF6F1] shadow-md'
                    : 'bg-[#EDE6DC] text-[#7A7067] hover:bg-[#e5dfd5]'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-8">
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={!amount || parseFloat(amount) <= 0}
          className={`w-full py-4 rounded-2xl shadow-lg transition-all ${
            amount && parseFloat(amount) > 0
              ? 'bg-[#C4785A] text-[#FAF6F1] hover:shadow-xl'
              : 'bg-[#EDE6DC] text-[#7A7067] cursor-not-allowed opacity-50'
          }`}
          style={{ 
            boxShadow: amount && parseFloat(amount) > 0 
              ? '0 8px 24px rgba(196, 120, 90, 0.2)' 
              : 'none' 
          }}
        >
          Log it
        </motion.button>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          whileTap={{ scale: 0.97 }}
          onClick={onCancel}
          className="w-full text-[#7A7067] py-3 rounded-2xl hover:bg-[#EDE6DC] transition-colors"
        >
          Cancel
        </motion.button>
      </div>
    </motion.div>
  );
}