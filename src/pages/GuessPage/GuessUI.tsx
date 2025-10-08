import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  RefreshCw,
  Send,
  RotateCcw,
  DollarSign,
  Zap,
  ArrowLeft,
} from "lucide-react";
import { RealisticHammer } from "../../components/ui/RealisticHammer";
import { ToggleWithTooltip } from "../../components/ui/ToggleWithTooltip";

// Define the props interface for the GuessUI component
interface GuessUIProps {
  guessId: number;
  paidGuess: boolean;
  overwrite: boolean;
  complex: boolean;
  blockIncrement: number;
  actualHash: string;
  secretHash: string;
  dummyHash: string;
  tokenSize: number;
  tokens: string[];
  isGeneratingActual: boolean;
  isGeneratingSecret: boolean;
  isSubmitting: boolean;
  isFormReadonly: boolean;
  onPaidGuessChange: (value: boolean) => void;
  onOverwriteChange: (value: boolean) => void;
  onComplexChange: (value: boolean) => void;
  onBlockIncrementChange: (value: number) => void;
  onActualHashChange: (value: string) => void;
  onSecretHashChange: (value: string) => void;
  onTokenSizeChange: (value: number) => void;
  onGenerateActualHash: () => void;
  onGenerateSecretHash: () => void;
  onSubmit: () => void;
  onClear: () => void;
  onBack: () => void;
}

const GuessUI: React.FC<GuessUIProps> = ({
  guessId,
  paidGuess,
  overwrite,
  complex,
  blockIncrement,
  actualHash,
  secretHash,
  dummyHash,
  tokenSize,
  tokens,
  isGeneratingActual,
  isGeneratingSecret,
  isSubmitting,
  isFormReadonly,
  onPaidGuessChange,
  onComplexChange,
  onBlockIncrementChange,
  onActualHashChange,
  onSecretHashChange,
  onTokenSizeChange,
  onGenerateActualHash,
  onGenerateSecretHash,
  onSubmit,
  onClear,
  onBack,
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4 sm:p-8 font-mono">
      <div className="max-w-4xl lg:max-w-7xl mx-auto space-y-6 lg:space-y-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="pt-4 pb-0 text-left"
        >
          <motion.button
            onClick={onBack}
            className="flex items-center text-purple-300 hover:text-purple-100 transition-colors font-semibold text-sm sm:text-base bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-purple-500/30 shadow-md"
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Start
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="text-center py-6 sm:py-8"
        >
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2 bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            NEW GUESS PROTOCOL
          </motion.h1>
          <motion.div
            className="text-xl sm:text-2xl text-purple-300 font-semibold"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            GUESS ID: #{guessId}
          </motion.div>
        </motion.div>

        {/* Form Sections */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="bg-gray-800/60 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-gray-700 shadow-xl"
          >
            <h2 className="text-xl font-semibold text-white mb-6">
              FEATURE CONFIGURATION
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <ToggleWithTooltip
                label="Complex"
                checked={complex}
                onChange={onComplexChange}
                color="rose"
                description="Enables a complex hash generation algorithm for advanced guesses."
                icon={<Zap />}
                disabled={isFormReadonly}
              />
              <ToggleWithTooltip
                label="Paid Guess"
                checked={paidGuess}
                onChange={onPaidGuessChange}
                color="emerald"
                description="Enables paid guess mode. This will cost 25 tokens."
                icon={<DollarSign />}
                disabled={isFormReadonly}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-gray-800/60 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-gray-700 shadow-xl"
          >
            <h2 className="text-xl font-semibold text-white mb-4">
              BLOCK INCREMENT COUNT
            </h2>
            <div className="space-y-4 font-mono">
              <div className="flex items-center justify-between text-white">
                <span>
                  TARGET BLOCK:{" "}
                  <span className="text-purple-300 font-bold">
                    {blockIncrement}
                  </span>
                </span>
                <span className="text-sm text-gray-300">Range: 10 - 100</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={blockIncrement}
                  onChange={(e) =>
                    onBlockIncrementChange(parseInt(e.target.value))
                  }
                  disabled={isFormReadonly}
                  className={`w-full h-4 bg-gray-700 rounded-lg appearance-none cursor-pointer slider ${
                    isFormReadonly ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  style={{
                    background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${
                      ((blockIncrement - 10) / (100 - 10)) * 100
                    }%, #374151 ${
                      ((blockIncrement - 10) / (100 - 10)) * 100
                    }%, #374151 100%)`,
                  }}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-gray-800/60 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-gray-700 shadow-xl"
          >
            <h2 className="text-xl font-semibold text-white mb-6">
              HASH GENERATION
            </h2>
            {/* Actual Hash, Secret Hash, Dummy Hash inputs */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  ACTUAL HASH
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={actualHash}
                    onChange={(e) => onActualHashChange(e.target.value)}
                    placeholder="Enter 64-char hex or generate"
                    disabled={isFormReadonly}
                    className={`flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 transition-all text-sm ${
                      isFormReadonly ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  />
                  <motion.button
                    onClick={onGenerateActualHash}
                    disabled={isGeneratingActual || isFormReadonly}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RefreshCw className="w-4 h-4" />
                    GENERATE
                  </motion.button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  SECRET KEY HASH
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={secretHash}
                    onChange={(e) => onSecretHashChange(e.target.value)}
                    placeholder="Enter 64-char hex or generate"
                    disabled={isFormReadonly}
                    className={`flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 transition-all text-sm ${
                      isFormReadonly ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  />
                  <motion.button
                    onClick={onGenerateSecretHash}
                    disabled={isGeneratingSecret || isFormReadonly}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RefreshCw className="w-4 h-4" />
                    GENERATE
                  </motion.button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  DUMMY HASH (AUTO-GENERATED)
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={dummyHash}
                    readOnly
                    className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed text-sm"
                  />
                  <motion.button
                    onClick={() => copyToClipboard(dummyHash)}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Copy className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-gray-800/60 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-gray-700 shadow-xl"
          >
            <h2 className="text-xl font-semibold text-white mb-4">
              TOKEN SIZE CONFIGURATION
            </h2>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between text-white mb-4">
                  <span>
                    TOKEN SIZE:{" "}
                    <span className="text-green-300 font-bold">
                      {tokenSize}
                    </span>
                  </span>
                  <span className="text-sm text-gray-300">Range: 3 - 64</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="64"
                  value={tokenSize}
                  onChange={(e) => onTokenSizeChange(parseInt(e.target.value))}
                  disabled={isFormReadonly}
                  className={`w-full h-4 bg-gray-700 rounded-lg appearance-none cursor-pointer slider ${
                    isFormReadonly ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  style={{
                    background: `linear-gradient(to right, #10b981 0%, #10b981 ${
                      ((tokenSize - 3) / (64 - 3)) * 100
                    }%, #374151 ${
                      ((tokenSize - 3) / (64 - 3)) * 100
                    }%, #374151 100%)`,
                  }}
                />
              </div>

              <AnimatePresence>
                {tokens.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-xl font-bold text-white mb-6">
                      REALISTIC POWER HAMMERS ({tokens.length} FORGED)
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-h-[500px] overflow-y-auto p-6 bg-gray-800/60 rounded-xl border border-gray-700">
                      {tokens.map((token, index) => (
                        <RealisticHammer
                          key={index}
                          onClick={() => copyToClipboard(token)}
                          token={token}
                          index={index}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
        >
          {overwrite && (
            <motion.button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-800 disabled:from-gray-600 text-white rounded-xl font-semibold text-lg flex items-center justify-center gap-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              {isSubmitting ? "VERIFYING..." : "SUBMIT GUESS"}
            </motion.button>
          )}

          <motion.button
            onClick={onClear}
            disabled={isSubmitting}
            className="px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold text-lg flex items-center justify-center gap-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-5 h-5" />
            CLEAR
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default GuessUI;
