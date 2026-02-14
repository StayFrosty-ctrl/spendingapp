import { motion } from 'motion/react';
import { Leaf, Sparkles } from 'lucide-react';
import { useEffect } from 'react';

interface CelebrationProps {
  streak: number;
  onContinue: () => void;
}

export default function Celebration({ streak, onContinue }: CelebrationProps) {
  // Auto-advance after 3 seconds for quick streaks
  useEffect(() => {
    if (streak <= 2) {
      const timer = setTimeout(() => {
        onContinue();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [streak, onContinue]);

  const getMessage = () => {
    if (streak === 1) return "Another day in the grove!";
    if (streak === 3) return "Three days! You're a sapling now!";
    if (streak === 7) return "A whole week! Taking root!";
    if (streak === 14) return "Two weeks! Flourishing!";
    if (streak === 30) return "30 days! You're a mighty oak!";
    return "Another day in the grove!";
  };

  const getEmoji = () => {
    if (streak >= 30) return "🌳";
    if (streak >= 14) return "🌿";
    if (streak >= 7) return "🌱";
    if (streak >= 3) return "🌿";
    return "🍃";
  };

  // Leaf particles falling
  const leaves = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 1,
    rotation: Math.random() * 360,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen flex-col items-center justify-center p-8 relative overflow-hidden"
    >
      {/* Falling leaves animation */}
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          initial={{ 
            y: -50, 
            x: `${leaf.x}vw`, 
            opacity: 1, 
            rotate: leaf.rotation 
          }}
          animate={{
            y: '110vh',
            x: `${leaf.x + (Math.random() * 20 - 10)}vw`,
            opacity: [1, 1, 0],
            rotate: leaf.rotation + 360,
          }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            ease: 'linear',
          }}
          className="absolute pointer-events-none"
        >
          <Leaf className="w-6 h-6 text-[#87A878] opacity-40" fill="#87A878" />
        </motion.div>
      ))}

      <div className="text-center relative z-10">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            delay: 0.2, 
            type: "spring", 
            stiffness: 200,
            damping: 15 
          }}
          className="mb-8"
        >
          <motion.div
            animate={{
              rotate: [0, -10, 10, -10, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 0.6,
              delay: 0.5,
            }}
            className="inline-block relative"
          >
            <div className="bg-gradient-to-br from-[#87A878] to-[#C4785A] rounded-full p-8 relative">
              <Sparkles 
                className="w-20 h-20 text-[#FAF6F1]" 
                strokeWidth={1.5} 
                fill="#FAF6F1" 
              />
              
              {/* Pulsing glow */}
              <motion.div
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.4, 0.1, 0.4],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-[#D4A855] rounded-full blur-2xl -z-10"
              />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-4xl font-bold text-[#3D3229] mb-4">
            {getMessage()}
          </h1>
          <div className="text-6xl mb-6">
            {getEmoji()}
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
          className="bg-[#EDE6DC] rounded-2xl p-6 mb-8 inline-block"
        >
          <div className="text-5xl font-bold text-[#87A878] mb-2">
            {streak}
          </div>
          <div className="text-sm text-[#7A7067]">
            day streak
          </div>
        </motion.div>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-base text-[#7A7067] mb-8 max-w-sm mx-auto"
        >
          You're building awareness and making progress. Keep growing! 🌿
        </motion.p>
      </div>

      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        whileTap={{ scale: 0.97 }}
        onClick={onContinue}
        className="w-full max-w-sm bg-[#C4785A] text-[#FAF6F1] py-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow relative z-10"
        style={{ boxShadow: '0 8px 24px rgba(61, 50, 41, 0.08)' }}
      >
        Back to my grove
      </motion.button>

      {/* Auto-dismiss after 3 seconds */}
      {streak <= 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          <p className="text-xs text-[#7A7067] mt-4">
            Tap anywhere or wait to continue
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}