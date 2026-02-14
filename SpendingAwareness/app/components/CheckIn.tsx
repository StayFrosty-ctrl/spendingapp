import { motion } from 'motion/react';
import { Leaf } from 'lucide-react';

interface CheckInProps {
  onYes: () => void;
  onNo: () => void;
}

export default function CheckIn({ onYes, onNo }: CheckInProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen flex-col items-center justify-center p-8"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring" }}
        className="mb-8"
      >
        <div className="bg-[#87A878] bg-opacity-20 rounded-full p-6 inline-block">
          <Leaf className="w-16 h-16 text-[#87A878]" strokeWidth={1.5} />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl font-bold text-[#3D3229] mb-3">
          Quick check-in 🌱
        </h1>
        <p className="text-lg text-[#7A7067]">
          Did you spend on Amazon today?
        </p>
      </motion.div>

      <div className="w-full max-w-sm space-y-4">
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileTap={{ scale: 0.97 }}
          onClick={onNo}
          className="w-full bg-[#87A878] text-[#FAF6F1] py-5 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-lg font-semibold"
          style={{ boxShadow: '0 8px 24px rgba(135, 168, 120, 0.2)' }}
        >
          Nope! 🌿
        </motion.button>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileTap={{ scale: 0.97 }}
          onClick={onYes}
          className="w-full bg-[#EDE6DC] text-[#3D3229] py-5 rounded-2xl hover:bg-[#e5dfd5] transition-colors text-lg font-semibold"
        >
          Yes
        </motion.button>
      </div>
    </motion.div>
  );
}
