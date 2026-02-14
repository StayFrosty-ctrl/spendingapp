import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface ReadyProps {
  checkInTimes: {
    morning: boolean;
    evening: boolean;
    customTime?: string;
  };
  onNext: () => void;
}

export default function Ready({ checkInTimes, onNext }: ReadyProps) {
  const getCheckInTimeText = () => {
    const times = [];
    if (checkInTimes.morning) times.push('9 AM');
    if (checkInTimes.evening) times.push('8 PM');
    if (checkInTimes.customTime) times.push(checkInTimes.customTime);
    
    if (times.length === 1) return times[0];
    if (times.length === 2) return `${times[0]} and ${times[1]}`;
    return times.join(', ');
  };

  // Confetti particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1 + Math.random() * 0.5,
    color: ['#C4785A', '#87A878', '#D4A855', '#D4A5A5'][Math.floor(Math.random() * 4)],
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen flex-col items-center justify-between p-8 relative overflow-hidden"
    >
      {/* Confetti animation */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ y: -20, x: `${particle.x}vw`, opacity: 1, rotate: 0 }}
          animate={{
            y: '100vh',
            opacity: [1, 1, 0],
            rotate: 360,
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: 'linear',
          }}
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: particle.color }}
        />
      ))}

      <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 10, 0],
            }}
            transition={{
              duration: 0.5,
              delay: 0.5,
            }}
            className="bg-gradient-to-br from-[#87A878] to-[#C4785A] rounded-full p-8 inline-block relative"
          >
            <Sparkles className="w-16 h-16 text-[#FAF6F1]" strokeWidth={1.5} fill="#FAF6F1" />
            
            {/* Pulsing glow */}
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0.2, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-[#D4A855] rounded-full blur-xl -z-10"
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="mb-2 text-4xl font-bold text-[#3D3229]">
            Your grove is planted
          </h1>
          <div className="text-5xl mb-6">🌱</div>
          
          <p className="text-base text-[#7A7067] max-w-sm mx-auto leading-relaxed">
            Day 1 starts now. We'll check in at {getCheckInTimeText()}.
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-[#EDE6DC] rounded-2xl p-6 max-w-sm"
        >
          <p className="text-sm text-[#7A7067] italic">
            "No shame, just awareness."
          </p>
        </motion.div>
      </div>

      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        whileTap={{ scale: 0.97 }}
        onClick={onNext}
        className="w-full bg-[#C4785A] text-[#FAF6F1] py-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow relative z-10"
        style={{ boxShadow: '0 8px 24px rgba(61, 50, 41, 0.08)' }}
      >
        See my grove
      </motion.button>
    </motion.div>
  );
}
