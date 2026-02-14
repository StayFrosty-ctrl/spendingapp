import { useState } from 'react';
import { motion } from 'motion/react';
import { Sun, Moon, Clock } from 'lucide-react';

interface CheckInTimeProps {
  checkInTimes: {
    morning: boolean;
    evening: boolean;
    customTime?: string;
  };
  onUpdate: (times: { morning: boolean; evening: boolean; customTime?: string }) => void;
  onNext: () => void;
}

export default function CheckInTime({ checkInTimes, onUpdate, onNext }: CheckInTimeProps) {
  const [showCustomTime, setShowCustomTime] = useState(false);
  const [customTime, setCustomTime] = useState(checkInTimes.customTime || '20:00');

  const toggleMorning = () => {
    onUpdate({ ...checkInTimes, morning: !checkInTimes.morning });
  };

  const toggleEvening = () => {
    onUpdate({ ...checkInTimes, evening: !checkInTimes.evening });
  };

  const handleCustomTime = () => {
    setShowCustomTime(true);
    onUpdate({ ...checkInTimes, customTime });
  };

  const isAnySelected = checkInTimes.morning || checkInTimes.evening || checkInTimes.customTime;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex min-h-screen flex-col items-center justify-between p-8"
    >
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <h1 className="mb-3 text-3xl font-bold text-[#3D3229]">
            When should we check in?
          </h1>
          <p className="text-base text-[#7A7067] max-w-sm mx-auto leading-relaxed">
            Most impulse purchases happen at night. Choose what works for you.
          </p>
        </motion.div>

        <div className="w-full max-w-sm space-y-4">
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            whileTap={{ scale: 0.98 }}
            onClick={toggleMorning}
            className={`w-full p-6 rounded-2xl transition-all ${
              checkInTimes.morning
                ? 'bg-[#C4785A] text-[#FAF6F1] shadow-lg'
                : 'bg-[#EDE6DC] text-[#3D3229] hover:bg-[#e5dfd5]'
            }`}
            style={{ boxShadow: checkInTimes.morning ? '0 8px 24px rgba(196, 120, 90, 0.2)' : 'none' }}
          >
            <div className="flex items-center gap-4">
              <div className={`rounded-full p-3 ${checkInTimes.morning ? 'bg-[#FAF6F1]/20' : 'bg-[#FAF6F1]'}`}>
                <Sun className={`w-6 h-6 ${checkInTimes.morning ? 'text-[#FAF6F1]' : 'text-[#C4785A]'}`} strokeWidth={1.5} />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold mb-1">Morning (9 AM)</div>
                <div className={`text-sm ${checkInTimes.morning ? 'text-[#FAF6F1]/80' : 'text-[#7A7067]'}`}>
                  Reflect on yesterday
                </div>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileTap={{ scale: 0.98 }}
            onClick={toggleEvening}
            className={`w-full p-6 rounded-2xl transition-all ${
              checkInTimes.evening
                ? 'bg-[#C4785A] text-[#FAF6F1] shadow-lg'
                : 'bg-[#EDE6DC] text-[#3D3229] hover:bg-[#e5dfd5]'
            }`}
            style={{ boxShadow: checkInTimes.evening ? '0 8px 24px rgba(196, 120, 90, 0.2)' : 'none' }}
          >
            <div className="flex items-center gap-4">
              <div className={`rounded-full p-3 ${checkInTimes.evening ? 'bg-[#FAF6F1]/20' : 'bg-[#FAF6F1]'}`}>
                <Moon className={`w-6 h-6 ${checkInTimes.evening ? 'text-[#FAF6F1]' : 'text-[#C4785A]'}`} strokeWidth={1.5} />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold mb-1">Evening (8 PM)</div>
                <div className={`text-sm ${checkInTimes.evening ? 'text-[#FAF6F1]/80' : 'text-[#7A7067]'}`}>
                  Catch yourself before checkout
                </div>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCustomTime}
            className={`w-full p-6 rounded-2xl transition-all ${
              showCustomTime
                ? 'bg-[#C4785A] text-[#FAF6F1] shadow-lg'
                : 'bg-[#EDE6DC] text-[#3D3229] hover:bg-[#e5dfd5]'
            }`}
            style={{ boxShadow: showCustomTime ? '0 8px 24px rgba(196, 120, 90, 0.2)' : 'none' }}
          >
            <div className="flex items-center gap-4">
              <div className={`rounded-full p-3 ${showCustomTime ? 'bg-[#FAF6F1]/20' : 'bg-[#FAF6F1]'}`}>
                <Clock className={`w-6 h-6 ${showCustomTime ? 'text-[#FAF6F1]' : 'text-[#C4785A]'}`} strokeWidth={1.5} />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold mb-1">Custom time</div>
                {showCustomTime && (
                  <input
                    type="time"
                    value={customTime}
                    onChange={(e) => {
                      setCustomTime(e.target.value);
                      onUpdate({ ...checkInTimes, customTime: e.target.value });
                    }}
                    className="bg-[#FAF6F1]/20 text-[#FAF6F1] px-3 py-1 rounded-lg border border-[#FAF6F1]/30 text-sm"
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
              </div>
            </div>
          </motion.button>
        </div>
      </div>

      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        whileTap={{ scale: 0.97 }}
        onClick={onNext}
        disabled={!isAnySelected}
        className={`w-full py-4 rounded-2xl shadow-lg transition-all ${
          isAnySelected
            ? 'bg-[#C4785A] text-[#FAF6F1] hover:shadow-xl'
            : 'bg-[#EDE6DC] text-[#7A7067] cursor-not-allowed'
        }`}
        style={{ boxShadow: isAnySelected ? '0 8px 24px rgba(61, 50, 41, 0.08)' : 'none' }}
      >
        Set my check-ins
      </motion.button>
    </motion.div>
  );
}
