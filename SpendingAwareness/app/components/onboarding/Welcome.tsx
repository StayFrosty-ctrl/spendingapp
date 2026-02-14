import { motion } from 'motion/react';
import { Sprout } from 'lucide-react';

interface WelcomeProps {
  onNext: () => void;
}

export default function Welcome({ onNext }: WelcomeProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen flex-col items-center justify-between p-8"
    >
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-12"
        >
          <div className="relative">
            {/* Organic blob background */}
            <div className="absolute inset-0 -z-10 scale-150 opacity-20">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path
                  fill="#87A878"
                  d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.2,73.1,42.8C64.8,56.4,53.8,69,39.8,76.4C25.8,83.8,8.8,86,-7.8,83.2C-24.4,80.4,-40.6,72.6,-54.2,62.4C-67.8,52.2,-78.8,39.6,-84.4,24.8C-90,10,-90.2,-7,-85.2,-22.8C-80.2,-38.6,-70,-53.2,-56.8,-60.8C-43.6,-68.4,-27.4,-69,-11.8,-69.8C3.8,-70.6,30.6,-83.6,44.7,-76.4Z"
                  transform="translate(100 100)"
                />
              </svg>
            </div>
            
            <div className="bg-[#87A878] rounded-full p-8 inline-block">
              <Sprout className="w-24 h-24 text-[#FAF6F1]" strokeWidth={1.5} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="mb-4 text-4xl font-bold text-[#3D3229]">
            Spend less.<br />Notice more.
          </h1>
          <p className="text-lg text-[#7A7067] max-w-sm mx-auto leading-relaxed">
            Grove helps you build awareness around Amazon spending - no judgment, just gentle check-ins.
          </p>
        </motion.div>
      </div>

      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        whileTap={{ scale: 0.97 }}
        onClick={onNext}
        className="w-full bg-[#C4785A] text-[#FAF6F1] py-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
        style={{ boxShadow: '0 8px 24px rgba(61, 50, 41, 0.08)' }}
      >
        Let's grow together
      </motion.button>
    </motion.div>
  );
}
