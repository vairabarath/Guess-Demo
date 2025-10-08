import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

interface TreasureTokenGridProps {
  predictedTokens: string[];
  actualTokens: string[];
  label?: string;
}

const TreasureToken: React.FC<{
  token: string;
  isMatch: boolean;
  index: number;
}> = ({ token, isMatch, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.03,
        type: "spring",
        stiffness: 200,
      }}
      className="relative"
    >
      {/* Mini Treasure Box */}
      <div
        className={`relative flex flex-col items-center p-3 rounded-lg border transition-all ${
          isMatch
            ? "bg-green-900/40 border-green-500/50 hover:border-green-400"
            : "bg-red-900/40 border-red-500/50 hover:border-red-400"
        }`}
      >
        {/* Treasure Box Visual */}
        <motion.div
          className="relative w-12 h-12 mb-2"
          whileHover={{ scale: 1.1, rotateY: 10 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Box Base */}
          <div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-7 rounded shadow-lg"
            style={{
              background: isMatch
                ? "linear-gradient(145deg, #059669 0%, #10b981 50%, #34d399 100%)"
                : "linear-gradient(145deg, #991b1b 0%, #dc2626 50%, #ef4444 100%)",
              boxShadow: isMatch
                ? "inset -2px -2px 4px rgba(5, 150, 105, 0.8), inset 2px 2px 4px rgba(52, 211, 153, 0.6), 0 4px 12px rgba(0,0,0,0.6)"
                : "inset -2px -2px 4px rgba(153, 27, 27, 0.8), inset 2px 2px 4px rgba(239, 68, 68, 0.6), 0 4px 12px rgba(0,0,0,0.6)",
            }}
          >
            <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-gray-800/50" />
          </div>

          {/* Box Lid */}
          <div
            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-6 rounded-t shadow-lg"
            style={{
              background: isMatch
                ? "linear-gradient(145deg, #047857 0%, #059669 50%, #10b981 100%)"
                : "linear-gradient(145deg, #7f1d1d 0%, #991b1b 50%, #dc2626 100%)",
              boxShadow: isMatch
                ? "inset -2px -2px 4px rgba(4, 120, 87, 0.8), inset 2px 2px 4px rgba(16, 185, 129, 0.6), 0 4px 12px rgba(0,0,0,0.6)"
                : "inset -2px -2px 4px rgba(127, 29, 29, 0.8), inset 2px 2px 4px rgba(220, 38, 38, 0.6), 0 4px 12px rgba(0,0,0,0.6)",
            }}
          />

          {/* Match/Mismatch Icon */}
          <motion.div
            className="absolute top-0 right-0 transform translate-x-1 -translate-y-1"
            animate={{
              scale: [1, 1.2, 1],
              rotate: isMatch ? [0, 10, -10, 0] : 0,
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {isMatch ? (
              <CheckCircle className="w-4 h-4 text-green-400 drop-shadow-lg" />
            ) : (
              <XCircle className="w-4 h-4 text-red-400 drop-shadow-lg" />
            )}
          </motion.div>
        </motion.div>

        {/* Token Display */}
        <div
          className={`text-xs font-mono px-2 py-1 rounded border ${
            isMatch
              ? "text-green-300 bg-green-950/60 border-green-700/50"
              : "text-red-300 bg-red-950/60 border-red-700/50"
          }`}
        >
          {token}
        </div>
      </div>
    </motion.div>
  );
};

export const TreasureTokenGrid: React.FC<TreasureTokenGridProps> = ({
  predictedTokens,
  actualTokens,
  label = "Token Comparison",
}) => {
  // Calculate matches
  const matches = predictedTokens.filter(
    (token, index) => token === actualTokens[index],
  ).length;

  const matchPercentage = ((matches / predictedTokens.length) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h3 className="text-2xl font-bold text-white mb-2">{label}</h3>
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-300">
              Matches:{" "}
              <span className="font-bold text-green-400">{matches}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-300">
              Mismatches:{" "}
              <span className="font-bold text-red-400">
                {predictedTokens.length - matches}
              </span>
            </span>
          </div>
          <div className="px-3 py-1 bg-purple-600/30 rounded-lg border border-purple-500/50">
            <span className="text-purple-300 font-bold">
              {matchPercentage}% Match
            </span>
          </div>
        </div>
      </motion.div>

      {/* Predicted Tokens Grid */}
      <div className="bg-gray-900/40 p-6 rounded-xl border border-gray-700">
        <h4 className="text-lg font-semibold text-purple-300 mb-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
          YOUR PREDICTED TOKENS
        </h4>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3">
          {predictedTokens.map((token, index) => (
            <TreasureToken
              key={`predicted-${index}`}
              token={token}
              isMatch={token === actualTokens[index]}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Actual Tokens Grid */}
      <div className="bg-gray-900/40 p-6 rounded-xl border border-gray-700">
        <h4 className="text-lg font-semibold text-blue-300 mb-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          ACTUAL BLOCK TOKENS
        </h4>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3">
          {actualTokens.map((token, index) => (
            <TreasureToken
              key={`actual-${index}`}
              token={token}
              isMatch={token === predictedTokens[index]}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Match Visualization Bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-900/60 p-4 rounded-lg border border-gray-700"
      >
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Token Match Rate</span>
          <span>
            {matches} / {predictedTokens.length} tokens
          </span>
        </div>
        <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${matchPercentage}%` }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="absolute h-full bg-gradient-to-r from-green-600 via-green-500 to-emerald-400"
          />
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white mix-blend-difference">
            {matchPercentage}%
          </div>
        </div>
      </motion.div>
    </div>
  );
};
