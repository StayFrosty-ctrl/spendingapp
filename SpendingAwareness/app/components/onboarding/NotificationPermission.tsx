import { motion } from 'motion/react';
import { BellRing } from 'lucide-react';

interface NotificationPermissionProps {
  onNext: () => void;
}

export default function NotificationPermission({ onNext }: NotificationPermissionProps) {
  const handleEnableNotifications = () => {
    // In a real app, this would request notification permission
    // For this demo, we'll just proceed
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(() => {
        onNext();
      });
    } else {
      onNext();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex min-h-screen flex-col items-center justify-between p-8"
    >
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mb-12 relative"
        >
          <div className="bg-gradient-to-br from-[#C4785A] to-[#87A878] rounded-3xl p-12 inline-block relative overflow-hidden">
            {/* Glow effect */}
            <motion.div
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-[#D4A855] blur-2xl"
            />
            <BellRing className="w-20 h-20 text-[#FAF6F1] relative z-10" strokeWidth={1.5} />
            
            {/* Notification badge animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -top-2 -right-2 bg-[#D4A5A5] w-6 h-6 rounded-full border-4 border-[#FAF6F1]"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="mb-4 text-3xl font-bold text-[#3D3229]">
            Stay on track with<br />gentle nudges
          </h1>
          <p className="text-base text-[#7A7067] max-w-sm mx-auto leading-relaxed">
            We'll only send your check-in reminders. Nothing else. Ever.
          </p>
        </motion.div>
      </div>

      <div className="w-full space-y-3">
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleEnableNotifications}
          className="w-full bg-[#C4785A] text-[#FAF6F1] py-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
          style={{ boxShadow: '0 8px 24px rgba(61, 50, 41, 0.08)' }}
        >
          Enable notifications
        </motion.button>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          className="w-full text-[#7A7067] py-3 rounded-2xl hover:bg-[#EDE6DC] transition-colors"
        >
          Maybe later
        </motion.button>
      </div>
    </motion.div>
  );
}
