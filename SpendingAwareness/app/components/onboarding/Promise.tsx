import { motion } from 'motion/react';
import { Bell, Eye, TrendingDown } from 'lucide-react';

interface PromiseProps {
  onNext: () => void;
}

export default function Promise({ onNext }: PromiseProps) {
  const steps = [
    { icon: Bell, label: 'Gentle notification' },
    { icon: Eye, label: 'Quick check-in' },
    { icon: TrendingDown, label: 'Build awareness' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex min-h-screen flex-col items-center justify-between p-8"
    >
      <div className="flex-1 flex flex-col items-center justify-center text-center w-full">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-3 text-3xl font-bold text-[#3D3229]"
        >
          One question.<br />Once or twice a day.
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-base text-[#7A7067] mb-12 max-w-sm leading-relaxed"
        >
          We'll ask if you spent on Amazon. That's it. You'll start noticing patterns without tracking every penny.
        </motion.p>

        <div className="flex items-center gap-6 mb-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.15, type: "spring" }}
              className="flex flex-col items-center"
            >
              <div className="bg-[#EDE6DC] rounded-2xl p-4 mb-3">
                <step.icon className="w-8 h-8 text-[#C4785A]" strokeWidth={1.5} />
              </div>
              <p className="text-sm text-[#7A7067] max-w-[80px] text-center">
                {step.label}
              </p>
              
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.6 + index * 0.15 }}
                  className="absolute w-12 h-0.5 bg-[#EDE6DC] mt-8"
                  style={{ left: '50%', transform: 'translateX(20px)' }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        whileTap={{ scale: 0.97 }}
        onClick={onNext}
        className="w-full bg-[#C4785A] text-[#FAF6F1] py-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
        style={{ boxShadow: '0 8px 24px rgba(61, 50, 41, 0.08)' }}
      >
        Sounds good
      </motion.button>
    </motion.div>
  );
}
