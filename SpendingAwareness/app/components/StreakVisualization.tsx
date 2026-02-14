import { motion } from 'motion/react';
import { Sprout, TreeDeciduous } from 'lucide-react';

interface StreakVisualizationProps {
  currentStreak: number;
  bestStreak: number;
  monthlyNoSpendDays: number;
}

export default function StreakVisualization({
  currentStreak,
  bestStreak,
  monthlyNoSpendDays,
}: StreakVisualizationProps) {
  // Generate rings based on streak
  const maxRings = 10;
  const ringsToShow = Math.min(Math.max(currentStreak, 1), maxRings);
  const rings = Array.from({ length: ringsToShow }, (_, i) => ({
    id: i,
    size: 100 - (i * (100 / maxRings)),
    opacity: 0.15 + (i * 0.08),
  }));

  const getMilestoneMessage = () => {
    if (currentStreak >= 30) return "Mighty oak! 🌳";
    if (currentStreak >= 14) return "Flourishing! 🌿";
    if (currentStreak >= 7) return "Taking root! 🌱";
    if (currentStreak >= 3) return "Sapling! 🌿";
    if (currentStreak === 0) return "Ready to grow";
    return "Growing strong! 🌱";
  };

  return (
    <div
      className="bg-gradient-to-br from-[#EDE6DC] to-[#FAF6F1] rounded-3xl p-8 relative overflow-hidden"
      style={{ boxShadow: '0 8px 32px rgba(61, 50, 41, 0.08)' }}
    >
      {/* Organic blob background */}
      <div className="absolute top-0 right-0 -z-0 opacity-10">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-64 h-64">
          <path
            fill="#87A878"
            d="M47.1,-78.5C60.1,-71.5,69.3,-56.8,75.8,-41.3C82.3,-25.8,86.1,-9.5,84.8,6.3C83.5,22.1,77.1,37.4,67.8,49.8C58.5,62.2,46.3,71.7,32.4,76.8C18.5,81.9,2.9,82.6,-13.2,80.8C-29.3,79,-45.9,74.7,-58.8,65.2C-71.7,55.7,-80.9,41,-84.5,25.2C-88.1,9.4,-86.1,-7.5,-79.8,-21.9C-73.5,-36.3,-62.9,-48.2,-49.9,-55.1C-36.9,-62,-21.5,-63.9,-5.8,-64.9C9.9,-65.9,34.1,-85.5,47.1,-78.5Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      {/* Tree Rings Visualization */}
      <div className="flex flex-col items-center justify-center relative z-10">
        {currentStreak === 0 ? (
          // Seed/Sprout state
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            <div className="bg-[#87A878] bg-opacity-20 rounded-full p-8">
              <Sprout className="w-20 h-20 text-[#87A878]" strokeWidth={1.5} />
            </div>
          </motion.div>
        ) : (
          // Tree rings
          <div className="relative mb-6 w-48 h-48 flex items-center justify-center">
            {rings.map((ring, index) => (
              <motion.div
                key={ring.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: ring.opacity }}
                transition={{
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 150,
                }}
                className="absolute rounded-full border-4 border-[#87A878]"
                style={{
                  width: `${ring.size}%`,
                  height: `${ring.size}%`,
                }}
              />
            ))}
            
            {/* Center icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="absolute"
            >
              {currentStreak >= 7 ? (
                <TreeDeciduous className="w-16 h-16 text-[#87A878]" strokeWidth={1.5} />
              ) : (
                <Sprout className="w-16 h-16 text-[#87A878]" strokeWidth={1.5} />
              )}
            </motion.div>
          </div>
        )}

        {/* Streak Number */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-center mb-4"
        >
          <div className="text-6xl font-bold text-[#3D3229] mb-2">
            {currentStreak}
          </div>
          <div className="text-lg text-[#7A7067]">
            days without Amazon spending
          </div>
        </motion.div>

        {/* Milestone Message */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-[#FAF6F1] px-6 py-3 rounded-full mb-6"
        >
          <p className="text-sm font-medium text-[#87A878]">
            {getMilestoneMessage()}
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex gap-6 text-center"
        >
          <div>
            <p className="text-2xl font-bold text-[#3D3229]">{bestStreak}</p>
            <p className="text-xs text-[#7A7067]">Best streak</p>
          </div>
          <div className="w-px bg-[#7A7067] opacity-20" />
          <div>
            <p className="text-2xl font-bold text-[#3D3229]">{monthlyNoSpendDays}</p>
            <p className="text-xs text-[#7A7067]">This month</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
