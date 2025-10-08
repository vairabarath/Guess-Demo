import React from "react";
import { motion, type AnimationControls } from "framer-motion";
import { Sparkles, Star } from "lucide-react";

interface RealisticHammerProps {
  animate?: AnimationControls;
  index?: number;
  token?: string;
  onClick?: () => void;
  isMatched?: boolean;
  isMismatch?: boolean;
}

// Demo Component showing multiple hammers

export const RealisticHammer: React.FC<RealisticHammerProps> = ({
  animate,
  index = 0,
  token,
  onClick,
  isMatched,
  isMismatch,
}) => {
  const handleClick = () => {
    if (onClick) onClick();
  };

  const getBorderColor = () => {
    if (isMatched) return "border-green-500";
    if (isMismatch) return "border-red-500";
    return "border-gray-700/50 hover:border-purple-500/50";
  };

  return (
    <div
      className={`relative flex flex-col items-center p-4 bg-gray-900/40 rounded-lg border-2 ${getBorderColor()} transition-all hover:bg-gray-900/60 group cursor-pointer`}
      onClick={handleClick}
    >
      {/* Hammer Visual */}
      <motion.div
        className="relative w-16 h-20 mb-3"
        animate={animate}
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Wooden Handle */}
        <div
          className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-14 rounded-full shadow-2xl"
          style={{
            background:
              "linear-gradient(145deg, #D2691E 0%, #CD853F 20%, #8B4513 50%, #654321 80%, #2F1B14 100%)",
            boxShadow:
              "inset -2px -2px 4px rgba(139, 69, 19, 0.8), inset 2px 2px 4px rgba(210, 180, 140, 0.6), 0 4px 12px rgba(0,0,0,0.6)",
          }}
        />

        {/* Steel Hammer Head */}
        <div
          className="absolute top-1 left-1/2 transform -translate-x-1/2 w-12 h-7 rounded-lg shadow-2xl"
          style={{
            background:
              "linear-gradient(145deg, #F8F8FF 0%, #E6E6FA 15%, #C0C0C0 30%, #A9A9A9 50%, #808080 70%, #696969 85%, #2F2F2F 100%)",
            boxShadow:
              "inset -2px -2px 6px rgba(105, 105, 105, 0.8), inset 2px 2px 6px rgba(248, 248, 255, 0.8), 0 6px 16px rgba(0,0,0,0.7)",
          }}
        >
          <motion.div
            className="absolute top-1 left-1 right-1 h-2 rounded-t opacity-60"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.9) 30%, rgba(255,255,255,0.7) 70%, transparent 100%)",
            }}
            animate={{ x: [-15, 15, -15] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Floating Magical Aura */}
        <motion.div
          className="absolute top-0 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
        >
          <Star className="w-4 h-4 text-yellow-300 opacity-70" />
        </motion.div>

        {/* Power Status Indicator */}
        <motion.div
          className="absolute -top-3 -right-3 text-yellow-400"
          animate={{ rotate: [0, 360], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 4, repeat: Infinity, delay: index * 0.3 }}
        >
          <Sparkles className="w-3 h-3" />
        </motion.div>
      </motion.div>

      {/* Token Display */}
      {token && (
        <div className="w-full flex flex-col items-center gap-2">
          <div className="text-xs font-mono text-gray-300 bg-gray-800/80 px-2 py-1.5 rounded border border-gray-700 break-all text-center max-w-full overflow-hidden">
            <div className="truncate" title={token}>
              {token}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
