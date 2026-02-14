import { motion } from 'motion/react';
import { ArrowLeft, Bell, Trash2, Download, Info, Sun, Moon } from 'lucide-react';
import { UserData } from '../App';
import { useState } from 'react';

interface SettingsProps {
  userData: UserData;
  onUpdate: (updates: Partial<UserData>) => void;
  onBack: () => void;
  onClearData: () => void;
}

export default function Settings({ userData, onUpdate, onBack, onClearData }: SettingsProps) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `grove-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pb-8"
    >
      {/* Header */}
      <div className="p-6 pb-4 flex items-center gap-4 border-b border-[#7A7067] border-opacity-10">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-[#EDE6DC] transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-[#7A7067]" strokeWidth={1.5} />
        </button>
        <h1 className="text-2xl font-bold text-[#3D3229]">Settings</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Check-in Times */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-[#C4785A]" strokeWidth={1.5} />
            <h2 className="text-lg font-semibold text-[#3D3229]">Check-in times</h2>
          </div>
          
          <div className="bg-[#EDE6DC] rounded-2xl p-4 space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[#3D3229]">Morning (9 AM)</span>
              <input
                type="checkbox"
                checked={userData.checkInTimes.morning}
                onChange={(e) => onUpdate({
                  checkInTimes: {
                    ...userData.checkInTimes,
                    morning: e.target.checked,
                  }
                })}
                className="w-5 h-5 rounded accent-[#C4785A]"
              />
            </label>
            
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[#3D3229]">Evening (8 PM)</span>
              <input
                type="checkbox"
                checked={userData.checkInTimes.evening}
                onChange={(e) => onUpdate({
                  checkInTimes: {
                    ...userData.checkInTimes,
                    evening: e.target.checked,
                  }
                })}
                className="w-5 h-5 rounded accent-[#C4785A]"
              />
            </label>

            {userData.checkInTimes.customTime && (
              <div className="flex items-center justify-between pt-2 border-t border-[#7A7067] border-opacity-10">
                <span className="text-[#3D3229]">Custom time</span>
                <input
                  type="time"
                  value={userData.checkInTimes.customTime}
                  onChange={(e) => onUpdate({
                    checkInTimes: {
                      ...userData.checkInTimes,
                      customTime: e.target.value,
                    }
                  })}
                  className="bg-[#FAF6F1] text-[#3D3229] px-3 py-1 rounded-lg border border-[#7A7067] border-opacity-20"
                />
              </div>
            )}
          </div>
        </motion.section>

        {/* Theme */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            {isDarkMode ? (
              <Moon className="w-5 h-5 text-[#C4785A]" strokeWidth={1.5} />
            ) : (
              <Sun className="w-5 h-5 text-[#C4785A]" strokeWidth={1.5} />
            )}
            <h2 className="text-lg font-semibold text-[#3D3229]">Theme</h2>
          </div>
          
          <button
            onClick={toggleDarkMode}
            className="w-full bg-[#EDE6DC] rounded-2xl p-4 flex items-center justify-between hover:bg-[#e5dfd5] transition-colors"
          >
            <span className="text-[#3D3229]">
              {isDarkMode ? 'Dark mode' : 'Light mode'}
            </span>
            <div className={`w-12 h-6 rounded-full transition-colors ${
              isDarkMode ? 'bg-[#C4785A]' : 'bg-[#7A7067]'
            } relative`}>
              <motion.div
                animate={{ x: isDarkMode ? 24 : 0 }}
                className="absolute top-0.5 left-0.5 w-5 h-5 bg-[#FAF6F1] rounded-full"
              />
            </div>
          </button>
        </motion.section>

        {/* Data & Privacy */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Download className="w-5 h-5 text-[#C4785A]" strokeWidth={1.5} />
            <h2 className="text-lg font-semibold text-[#3D3229]">Data & Privacy</h2>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={handleExportData}
              className="w-full bg-[#EDE6DC] rounded-2xl p-4 text-left hover:bg-[#e5dfd5] transition-colors"
            >
              <div className="font-medium text-[#3D3229] mb-1">Export data</div>
              <div className="text-sm text-[#7A7067]">
                Download your Grove data as JSON
              </div>
            </button>

            <button
              onClick={() => setShowClearConfirm(true)}
              className="w-full bg-[#D4A5A5] bg-opacity-20 rounded-2xl p-4 text-left hover:bg-opacity-30 transition-colors"
            >
              <div className="font-medium text-[#D4A5A5] mb-1 flex items-center gap-2">
                <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                Clear all data
              </div>
              <div className="text-sm text-[#7A7067]">
                This will reset everything
              </div>
            </button>
          </div>
        </motion.section>

        {/* About */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Info className="w-5 h-5 text-[#C4785A]" strokeWidth={1.5} />
            <h2 className="text-lg font-semibold text-[#3D3229]">About Grove</h2>
          </div>
          
          <div className="bg-[#EDE6DC] rounded-2xl p-6">
            <p className="text-sm text-[#7A7067] mb-4 leading-relaxed">
              Grove is a gentle companion for building awareness around spending habits.
            </p>
            <p className="text-sm text-[#87A878] italic font-medium">
              "No shame, just awareness."
            </p>
            <div className="mt-4 pt-4 border-t border-[#7A7067] border-opacity-10">
              <p className="text-xs text-[#7A7067]">Version 1.0.0</p>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Clear Data Confirmation Modal */}
      {showClearConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-[#3D3229] bg-opacity-50 flex items-center justify-center p-6 z-50"
          onClick={() => setShowClearConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FAF6F1] rounded-3xl p-8 max-w-sm w-full"
          >
            <h3 className="text-xl font-bold text-[#3D3229] mb-3">
              Clear all data?
            </h3>
            <p className="text-[#7A7067] mb-6">
              This will delete your streak, purchases, and all settings. This cannot be undone.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={onClearData}
                className="w-full bg-[#D4A5A5] text-[#FAF6F1] py-3 rounded-2xl hover:bg-opacity-90 transition-all"
              >
                Yes, clear everything
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="w-full bg-[#EDE6DC] text-[#3D3229] py-3 rounded-2xl hover:bg-[#e5dfd5] transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
