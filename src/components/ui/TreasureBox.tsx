import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Star, Lock, Unlock, Copy, Check } from "lucide-react";

interface TreasureBoxProps {
  hash?: string;
  isLocked?: boolean;
  animate?: boolean;
  index?: number;
  onClick?: () => void;
  label?: string;
}

export const TreasureBox: React.FC<TreasureBoxProps> = ({
  hash,
  isLocked = false,
  animate = true,
  index = 0,
  onClick,
  label = "Block Hash",
}) => {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(!isLocked);

  const handleCopy = () => {
    if (hash) {
      navigator.clipboard.writeText(hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    if (onClick) onClick();
  };

  const handleOpen = () => {
    if (!isLocked) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="relative flex flex-col items-center p-6 bg-gray-900/40 rounded-xl border border-gray-700/50 hover:border-yellow-500/50 transition-all hover:bg-gray-900/60 group">
      {/* Treasure Box Visual */}
      <motion.div
        className="relative w-24 h-24 mb-4 cursor-pointer"
        animate={
          animate
            ? {
                rotateY: [0, 5, -5, 0],
                scale: [1, 1.05, 1],
              }
            : {}
        }
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: index * 0.3,
        }}
        whileHover={{ scale: 1.1 }}
        onClick={handleOpen}
      >
        {/* Treasure Box Base */}
        <div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-14 rounded-lg shadow-2xl"
          style={{
            background:
              "linear-gradient(145deg, #CD7F32 0%, #B8860B 20%, #DAA520 40%, #FFD700 60%, #B8860B 80%, #8B6914 100%)",
            boxShadow:
              "inset -3px -3px 8px rgba(139, 105, 20, 0.8), inset 3px 3px 8px rgba(255, 215, 0, 0.6), 0 8px 20px rgba(0,0,0,0.7)",
          }}
        >
          {/* Metal Bands */}
          <div className="absolute top-1/3 left-0 right-0 h-1.5 bg-gradient-to-r from-gray-700 via-gray-400 to-gray-700 shadow-lg" />
          <div className="absolute bottom-1/3 left-0 right-0 h-1.5 bg-gradient-to-r from-gray-700 via-gray-400 to-gray-700 shadow-lg" />
        </div>

        {/* Treasure Box Lid */}
        <motion.div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-12 rounded-t-lg shadow-2xl origin-bottom"
          animate={isOpen ? { rotateX: -120 } : { rotateX: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          style={{
            background:
              "linear-gradient(145deg, #8B6914 0%, #B8860B 20%, #DAA520 40%, #FFD700 60%, #CD7F32 80%, #8B6914 100%)",
            boxShadow:
              "inset -3px -3px 8px rgba(139, 105, 20, 0.8), inset 3px 3px 8px rgba(255, 215, 0, 0.6), 0 8px 20px rgba(0,0,0,0.7)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Lock/Unlock Icon */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {isLocked ? (
              <Lock className="w-6 h-6 text-gray-800" />
            ) : (
              <Unlock className="w-6 h-6 text-green-400" />
            )}
          </div>
        </motion.div>

        {/* Glowing Effect when Open */}
        {isOpen && !isLocked && (
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-16 h-16 rounded-full bg-yellow-400/30 blur-xl" />
          </motion.div>
        )}

        {/* Floating Sparkles */}
        {isOpen && !isLocked && (
          <>
            <motion.div
              className="absolute top-0 left-1/2 transform -translate-x-1/2"
              animate={{
                y: [-10, -30, -10],
                x: [-5, 5, -5],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.2,
              }}
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </motion.div>
            <motion.div
              className="absolute top-0 right-0"
              animate={{
                y: [-10, -25, -10],
                x: [5, 10, 5],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: index * 0.3,
              }}
            >
              <Star className="w-3 h-3 text-yellow-400" />
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Label */}
      <div className="text-sm font-semibold text-yellow-400 mb-2">{label}</div>

      {/* Hash Display */}
      {hash && isOpen && !isLocked && (
        <div className="w-full flex flex-col items-center gap-2">
          <div className="text-xs font-mono text-gray-300 bg-gray-800/80 px-3 py-2 rounded border border-gray-700 break-all text-center max-w-full overflow-hidden">
            <div className="truncate" title={hash}>
              {hash}
            </div>
          </div>

          {/* Copy Button */}
          <motion.button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600/80 hover:bg-yellow-500 text-white text-xs rounded-lg font-medium transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Copy Hash
              </>
            )}
          </motion.button>
        </div>
      )}

      {/* Locked Message */}
      {isLocked && (
        <div className="text-xs text-gray-400 text-center mt-2">
          Waiting for block generation...
        </div>
      )}
    </div>
  );
};
