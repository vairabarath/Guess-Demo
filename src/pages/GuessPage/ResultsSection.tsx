import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Target,
  Hash,
  Clock,
  RefreshCw,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Star,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { getBlockByNumber } from "../../services/service";
import { tokenize } from "../../utils/hashUtils";

// Video Loading Popup Component
interface VideoLoadingPopupProps {
  isOpen: boolean;
  videoUrl: string;
  onComplete: () => void;
}

const VideoLoadingPopup: React.FC<VideoLoadingPopupProps> = ({
  isOpen,
  videoUrl,
  onComplete,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play();
    }
  }, [isOpen]);

  const handleVideoEnd = () => {
    onComplete();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Blurred Background Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-lg" />

      {/* Video Container */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative z-10 bg-gray-900/90 rounded-2xl p-8 shadow-2xl border-2 border-purple-500/50 max-w-2xl w-full mx-4"
      >
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
            Verifying Your Guess...
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
          </h3>
          <p className="text-gray-400 text-sm">
            Breaking open the treasure box to reveal your results!
          </p>
        </div>

        {/* Video Player */}
        <div className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-amber-600/50">
          <video
            ref={videoRef}
            src={videoUrl}
            onEnded={handleVideoEnd}
            className="w-full h-auto"
            playsInline
            muted={false}
          />

          {/* Animated Border Glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              boxShadow: [
                "inset 0 0 20px rgba(251, 191, 36, 0.3)",
                "inset 0 0 40px rgba(251, 191, 36, 0.6)",
                "inset 0 0 20px rgba(251, 191, 36, 0.3)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Loading Text */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <RefreshCw className="w-5 h-5 text-purple-400" />
          </motion.div>
          <span className="text-gray-300 font-medium">
            Fetching block data...
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

// RealisticHammer Component
interface RealisticHammerProps {
  index?: number;
  token?: string | null;
  onClick?: () => void;
  isMatched?: boolean;
  isMismatch?: boolean;
}

const RealisticHammer: React.FC<RealisticHammerProps> = ({
  index = 0,
  token = null,
  onClick,
  isMatched = false,
  isMismatch = false,
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
      className={`relative flex flex-col items-center p-3 bg-gray-900/40 rounded-lg border-2 ${getBorderColor()} transition-all hover:bg-gray-900/60 group min-h-[140px] cursor-pointer`}
      onClick={handleClick}
    >
      <motion.div
        className="relative w-12 h-16 mb-2"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Wooden Handle */}
        <div
          className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-11 rounded-full shadow-2xl"
          style={{
            background:
              "linear-gradient(145deg, #D2691E 0%, #CD853F 20%, #8B4513 50%, #654321 80%, #2F1B14 100%)",
            boxShadow:
              "inset -2px -2px 4px rgba(139, 69, 19, 0.8), inset 2px 2px 4px rgba(210, 180, 140, 0.6), 0 4px 12px rgba(0,0,0,0.6)",
          }}
        />
        {/* Steel Hammer Head */}
        <div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-6 rounded-lg shadow-2xl"
          style={{
            background:
              "linear-gradient(145deg, #F8F8FF 0%, #E6E6FA 15%, #C0C0C0 30%, #A9A9A9 50%, #808080 70%, #696969 85%, #2F2F2F 100%)",
            boxShadow:
              "inset -2px -2px 6px rgba(105, 105, 105, 0.8), inset 2px 2px 6px rgba(248, 248, 255, 0.8), 0 6px 16px rgba(0,0,0,0.7)",
          }}
        >
          <motion.div
            className="absolute top-0.5 left-1 right-1 h-1.5 rounded-t opacity-60"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.9) 30%, rgba(255,255,255,0.7) 70%, transparent 100%)",
            }}
            animate={{ x: [-10, 10, -10] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {(isMatched || isMismatch) && (
          <motion.div
            className="absolute -top-1 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, -6, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
          >
            <Star
              className={`w-3 h-3 ${
                isMatched ? "text-yellow-300" : "text-red-400"
              } opacity-70`}
            />
          </motion.div>
        )}

        {(isMatched || isMismatch) && (
          <motion.div
            className="absolute -top-2 -right-2 text-yellow-400"
            animate={{ rotate: [0, 360], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 4, repeat: Infinity, delay: index * 0.3 }}
          >
            <Sparkles className="w-2.5 h-2.5" />
          </motion.div>
        )}
      </motion.div>
      <div className="w-full flex flex-col items-center gap-1.5 mt-auto">
        {token ? (
          <>
            <div className="text-xs font-mono text-gray-300 bg-gray-800/80 px-2 py-1 rounded border border-gray-700 break-all text-center w-full overflow-hidden">
              <div className="truncate" title={token}>
                {token}
              </div>
            </div>
          </>
        ) : (
          <div className="text-xs font-mono text-gray-500">---</div>
        )}
      </div>
    </div>
  );
};

// TreasureBox Component with Broken State
interface TreasureBoxProps {
  index?: number;
  token?: string | null;
  onClick?: () => void;
  hash?: string;
  label?: string;
  isLarge?: boolean;
  isBroken?: boolean;
}

const TreasureBox: React.FC<TreasureBoxProps> = ({
  index = 0,
  token = null,
  onClick,
  hash,
  label,
  isLarge = false,
  isBroken = false,
}) => {
  const handleClick = () => {
    if (onClick) onClick();
  };

  // Large version for Full Hash Comparison
  if (isLarge) {
    return (
      <div className="relative flex flex-col items-center p-6 bg-gradient-to-br from-amber-900/30 to-yellow-900/30 rounded-lg border-2 border-amber-600/40 hover:border-amber-500/60 transition-all hover:shadow-lg hover:shadow-amber-600/20 group">
        {label && (
          <div className="mb-4 text-center">
            <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider">
              {label}
            </h4>
          </div>
        )}

        <motion.div
          className="relative w-32 h-32 mb-4 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
          onClick={handleClick}
        >
          {/* Treasure Box Base */}
          <div
            className="absolute bottom-4  transform -translate-x-1/2 w-28 h-20 rounded shadow-2xl"
            style={{
              background:
                "linear-gradient(145deg, #8B4513 0%, #A0522D 15%, #CD853F 30%, #DAA520 50%, #B8860B 70%, #8B4513 100%)",
              boxShadow:
                "inset -2px -2px 4px rgba(139, 69, 19, 0.9), inset 2px 2px 4px rgba(218, 165, 32, 0.6), 0 6px 14px rgba(0,0,0,0.7)",
            }}
          >
            {/* Front Lock */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-10 bg-gradient-to-b from-yellow-600 to-yellow-800 rounded border border-yellow-700 shadow-lg">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gray-900 rounded-full" />
            </div>

            {/* Metal Bands */}
            <div className="absolute top-4 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-700 to-transparent" />
            <div className="absolute bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-700 to-transparent" />
          </div>

          {/* Treasure Box Lid */}
          <div
            className="absolute top-8 left-1/2 transform -translate-x-1/2 w-28 h-8 rounded-t shadow-2xl"
            style={{
              background:
                "linear-gradient(145deg, #654321 0%, #8B4513 20%, #A0522D 40%, #CD853F 60%, #B8860B 80%, #8B4513 100%)",
              boxShadow:
                "inset -2px -2px 3px rgba(101, 67, 33, 0.9), inset 2px 2px 3px rgba(205, 133, 63, 0.7), 0 4px 10px rgba(0,0,0,0.8)",
            }}
          >
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-yellow-700/40 rounded-full" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-2 h-2 bg-gray-900 rounded-full" />
            </div>
          </div>

          <motion.div
            className="absolute -top-2 -right-2"
            animate={{
              rotate: [0, 360],
              scale: [0.8, 1.2, 0.8],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: index * 0.2,
            }}
          >
            <Star className="w-5 h-5 text-amber-400" />
          </motion.div>

          <motion.div
            className="absolute -inset-2 bg-amber-500/10 rounded-lg blur-md -z-10"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.3,
            }}
          />
        </motion.div>

        {hash && (
          <div className="w-full flex flex-col items-center gap-3 mt-2">
            <div className="text-xs font-mono text-amber-100 bg-amber-950/60 px-3 py-2 rounded border border-amber-700/50 break-all text-center w-full">
              {hash}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Small version for token grid with broken state
  const borderColor = isBroken
    ? "border-green-500 bg-green-900/20"
    : "border-amber-600/40 hover:border-amber-500/60";

  return (
    <div
      className={`relative flex flex-col items-center p-3 bg-gradient-to-br from-amber-900/30 to-yellow-900/30 rounded-lg border-2 ${borderColor} transition-all hover:shadow-lg hover:shadow-amber-600/20 group min-h-[140px] cursor-pointer`}
      onClick={handleClick}
    >
      <motion.div
        className="relative w-12 h-16 mb-2"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {isBroken ? (
          // Broken Treasure Box
          <>
            {/* Broken Pieces - Base Left */}
            <motion.div
              initial={{ x: 0, y: 0, rotate: 0 }}
              animate={{
                x: -6,
                y: 2,
                rotate: -15,
              }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="absolute bottom-1 left-0 w-5 h-6 rounded shadow-lg"
              style={{
                background:
                  "linear-gradient(145deg, #8B4513 0%, #CD853F 50%, #B8860B 100%)",
                boxShadow: "0 2px 6px rgba(0,0,0,0.7)",
              }}
            />

            {/* Broken Pieces - Base Right */}
            <motion.div
              initial={{ x: 0, y: 0, rotate: 0 }}
              animate={{
                x: 6,
                y: 2,
                rotate: 15,
              }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="absolute bottom-1 right-0 w-5 h-6 rounded shadow-lg"
              style={{
                background:
                  "linear-gradient(145deg, #8B4513 0%, #CD853F 50%, #B8860B 100%)",
                boxShadow: "0 2px 6px rgba(0,0,0,0.7)",
              }}
            />

            {/* Broken Pieces - Lid Left */}
            <motion.div
              initial={{ x: 0, y: 0, rotate: 0 }}
              animate={{
                x: -8,
                y: -2,
                rotate: -25,
              }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="absolute top-0 left-0 w-5 h-3 rounded-t shadow-lg"
              style={{
                background:
                  "linear-gradient(145deg, #654321 0%, #A0522D 50%, #B8860B 100%)",
                boxShadow: "0 2px 6px rgba(0,0,0,0.7)",
              }}
            />

            {/* Broken Pieces - Lid Right */}
            <motion.div
              initial={{ x: 0, y: 0, rotate: 0 }}
              animate={{
                x: 8,
                y: -2,
                rotate: 25,
              }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="absolute top-0 right-0 w-5 h-3 rounded-t shadow-lg"
              style={{
                background:
                  "linear-gradient(145deg, #654321 0%, #A0522D 50%, #B8860B 100%)",
                boxShadow: "0 2px 6px rgba(0,0,0,0.7)",
              }}
            />

            {/* Broken Lock */}
            <motion.div
              initial={{ x: 0, y: 0, rotate: 0, scale: 1 }}
              animate={{
                x: 0,
                y: 8,
                rotate: 45,
                scale: 0.8,
              }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-3 bg-gradient-to-b from-yellow-600 to-yellow-800 rounded-sm opacity-70"
            />

            {/* Sparkles on Break */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1.5, 0],
                  opacity: [1, 1, 0],
                  x: [0, (i - 2) * 8],
                  y: [0, (i - 2) * 8],
                }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.05 + i * 0.1,
                }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                <Star className="w-2 h-2 text-yellow-300" />
              </motion.div>
            ))}

            {/* Success Glow */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.1,
              }}
              className="absolute -inset-2 bg-green-500/30 rounded-lg blur-md -z-10"
            />
          </>
        ) : (
          // Closed Treasure Box
          <>
            {/* Treasure Box Base - Closed */}
            <div
              className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-11 h-8 rounded shadow-xl"
              style={{
                background:
                  "linear-gradient(145deg, #8B4513 0%, #A0522D 15%, #CD853F 30%, #DAA520 50%, #B8860B 70%, #8B4513 100%)",
                boxShadow:
                  "inset -1px -1px 2px rgba(139, 69, 19, 0.9), inset 1px 1px 2px rgba(218, 165, 32, 0.6), 0 3px 8px rgba(0,0,0,0.7)",
              }}
            >
              {/* Front Lock - Closed */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-4 bg-gradient-to-b from-yellow-600 to-yellow-800 rounded-sm border border-yellow-700 shadow">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-gray-900 rounded-full" />
              </div>

              {/* Metal Bands */}
              <div className="absolute top-1.5 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-700 to-transparent" />
              <div className="absolute bottom-1.5 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-700 to-transparent" />
            </div>

            {/* Treasure Box Lid - Closed */}
            <div
              className="absolute top-0 left-1/2 transform -translate-x-1/2 w-11 h-4 rounded-t shadow-xl"
              style={{
                background:
                  "linear-gradient(145deg, #654321 0%, #8B4513 20%, #A0522D 40%, #CD853F 60%, #B8860B 80%, #8B4513 100%)",
                boxShadow:
                  "inset -1px -1px 2px rgba(101, 67, 33, 0.9), inset 1px 1px 2px rgba(205, 133, 63, 0.7), 0 2px 6px rgba(0,0,0,0.8)",
              }}
            >
              {/* Lid Decoration Line */}
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-yellow-700/40 rounded-full" />

              {/* Keyhole on lid */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-1 h-1 bg-gray-900 rounded-full" />
              </div>
            </div>

            {/* Floating Sparkle */}
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{
                rotate: [0, 360],
                scale: [0.8, 1.2, 0.8],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: index * 0.2,
              }}
            >
              <Star className="w-2.5 h-2.5 text-amber-400" />
            </motion.div>

            {/* Ambient Glow */}
            <motion.div
              className="absolute -inset-1 bg-amber-500/10 rounded-lg blur-sm -z-10"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.3,
              }}
            />
          </>
        )}
      </motion.div>

      <div className="w-full flex flex-col items-center gap-1.5 mt-auto">
        {token ? (
          <>
            <div
              className={`text-xs font-mono ${
                isBroken
                  ? "text-green-300 bg-green-950/60 border-green-700/50"
                  : "text-amber-100 bg-amber-950/60 border-amber-700/50"
              } px-2 py-1 rounded border break-all text-center w-full overflow-hidden`}
            >
              <div className="truncate" title={token}>
                {token}
              </div>
            </div>
          </>
        ) : (
          <div className="text-xs font-mono text-amber-700/50">---</div>
        )}
      </div>
    </div>
  );
};

// Token Sequence Comparison Component - SLIDING WINDOW LOGIC
interface TokenSequenceComparisonProps {
  predictedHash: string;
  actualHash: string;
  tokenSize: number;
}

const TokenSequenceComparison: React.FC<TokenSequenceComparisonProps> = ({
  predictedHash,
  actualHash,
  tokenSize,
}) => {
  const cleanPredicted = predictedHash.toLowerCase().replace("0x", "");
  const cleanActual = actualHash.toLowerCase().replace("0x", "");

  // Generate all sliding window sequences
  const generateSequences = (hash: string, size: number): string[] => {
    const sequences: string[] = [];
    for (let i = 0; i <= hash.length - size; i++) {
      sequences.push(hash.substring(i, i + size));
    }
    return sequences;
  };

  const predictedSequences = generateSequences(cleanPredicted, tokenSize);
  const actualSequences = generateSequences(cleanActual, tokenSize);

  // Find matching sequences
  const matchingSequences: Array<{
    sequence: string;
    predictedIndex: number;
    actualIndex: number;
  }> = [];

  predictedSequences.forEach((seq, predIdx) => {
    const actualIdx = actualSequences.indexOf(seq);
    if (actualIdx !== -1) {
      matchingSequences.push({
        sequence: seq,
        predictedIndex: predIdx,
        actualIndex: actualIdx,
      });
    }
  });

  const matchCount = matchingSequences.length;

  return (
    <div className="bg-gray-900/40 p-6 rounded-xl border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-4 text-center">
        TOKEN SEQUENCE COMPARISON (Size: {tokenSize})
      </h3>
      <p className="text-sm text-gray-400 text-center mb-6">
        Comparing sliding window sequences of {tokenSize} characters. Found{" "}
        <span className="text-green-400 font-bold">{matchCount}</span> matching
        sequences.
      </p>

      {matchCount > 0 ? (
        <>
          {/* Matched Sequences Display */}
          <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4 mb-6">
            <h5 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              MATCHED TOKEN SEQUENCES:
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {matchingSequences.map((match, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-green-900/40 border border-green-600 rounded-lg p-3"
                >
                  <div className="text-center mb-2">
                    <span className="text-green-300 font-bold font-mono text-lg">
                      "{match.sequence}"
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 space-y-1">
                    <div>
                      Your Hash: Position {match.predictedIndex + 1} -{" "}
                      {match.predictedIndex + tokenSize}
                    </div>
                    <div>
                      Block Hash: Position {match.actualIndex + 1} -{" "}
                      {match.actualIndex + tokenSize}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Visual Hash Display with Highlighting */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Predicted Hash */}
            <div>
              <h4 className="text-sm font-semibold text-green-400 mb-3 text-center">
                YOUR PREDICTION
              </h4>
              <div className="bg-gray-950/60 p-4 rounded-lg border border-gray-700 font-mono text-xs break-all leading-relaxed">
                <span className="text-gray-500">0x</span>
                {cleanPredicted.split("").map((char, charIdx) => {
                  // Check if this character is part of any matched sequence
                  const isInMatch = matchingSequences.some(
                    (match) =>
                      charIdx >= match.predictedIndex &&
                      charIdx < match.predictedIndex + tokenSize,
                  );

                  return (
                    <span
                      key={`pred-char-${charIdx}`}
                      className={`${
                        isInMatch
                          ? "text-green-400 bg-green-900/40 font-bold"
                          : "text-gray-400"
                      }`}
                    >
                      {char}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Actual Hash */}
            <div>
              <h4 className="text-sm font-semibold text-purple-400 mb-3 text-center">
                ACTUAL BLOCK HASH
              </h4>
              <div className="bg-gray-950/60 p-4 rounded-lg border border-gray-700 font-mono text-xs break-all leading-relaxed">
                <span className="text-gray-500">0x</span>
                {cleanActual.split("").map((char, charIdx) => {
                  // Check if this character is part of any matched sequence
                  const isInMatch = matchingSequences.some(
                    (match) =>
                      charIdx >= match.actualIndex &&
                      charIdx < match.actualIndex + tokenSize,
                  );

                  return (
                    <span
                      key={`actual-char-${charIdx}`}
                      className={`${
                        isInMatch
                          ? "text-green-400 bg-green-900/40 font-bold"
                          : "text-gray-400"
                      }`}
                    >
                      {char}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-6 text-center">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-red-400 font-semibold mb-2">
            No Matching Sequences Found
          </p>
          <p className="text-sm text-gray-400">
            None of the {tokenSize}-character sequences in your prediction match
            any sequences in the actual block hash.
          </p>
        </div>
      )}
    </div>
  );
};

interface ResultsSectionProps {
  guessData: {
    guessId: number;
    blockIncrement: number;
    actualHash: string;
    secretHash: string;
    dummyHash: string;
    tokens: string[];
    paidGuess: boolean;
    complex: boolean;
    tokenSize: number;
  };
  currentBlockNumber?: number;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({
  guessData,
  currentBlockNumber,
}) => {
  const [isFetching, setIsFetching] = useState(false);
  const [blockExists, setBlockExists] = useState(false);
  const [realBlockHash, setRealBlockHash] = useState<string>("");

  const [error, setError] = useState<string>("");
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [hasFetched, setHasFetched] = useState(false); // NEW: Track if fetch has been used

  const [isHammersExpanded, setIsHammersExpanded] = useState(false);
  const [isTreasureExpanded, setIsTreasureExpanded] = useState(false);

  const [targetBlockNumber, setTargetBlockNumber] = useState<number>(0);
  const [blocksRemaining, setBlocksRemaining] = useState<number>(0);
  const [estimatedTime, setEstimatedTime] = useState<string>("");

  const initialTargetSet = useRef(false);

  const VIDEO_URL = "/hammer.mp4"; // Change this to your video path

  useEffect(() => {
    if (!initialTargetSet.current && currentBlockNumber) {
      const target = currentBlockNumber + guessData.blockIncrement;
      setTargetBlockNumber(target);
      initialTargetSet.current = true;
    }
  }, [currentBlockNumber, guessData.blockIncrement]);

  useEffect(() => {
    if (!currentBlockNumber || targetBlockNumber === 0) return;

    const remaining = targetBlockNumber - currentBlockNumber;
    setBlocksRemaining(Math.max(0, remaining));

    if (remaining > 0) {
      const minutes = Math.ceil((remaining * 12) / 60);
      if (minutes < 60) {
        setEstimatedTime(`~${minutes} minutes`);
      } else {
        const hours = Math.ceil(minutes / 60);
        setEstimatedTime(`~${hours} hours`);
      }
    } else {
      setEstimatedTime("Ready!");
    }
  }, [currentBlockNumber, targetBlockNumber]);

  const calculateMatches = (hash1: string, hash2: string): number => {
    const clean1 = hash1.toLowerCase().replace("0x", "");
    const clean2 = hash2.toLowerCase().replace("0x", "");
    let matches = 0;
    const minLength = Math.min(clean1.length, clean2.length);

    for (let i = 0; i < minLength; i++) {
      if (clean1[i] === clean2[i]) matches++;
    }
    return matches;
  };

  // Helper function to check if a predicted token matches any actual token sequence
  const checkTokenMatchesSequence = (
    predictedToken: string,
    actualHash: string,
    tokenSize: number,
  ): boolean => {
    const cleanActual = actualHash.toLowerCase().replace("0x", "");
    const cleanPredicted = predictedToken.toLowerCase();

    // Generate all sliding window sequences from actual hash
    for (let i = 0; i <= cleanActual.length - tokenSize; i++) {
      const sequence = cleanActual.substring(i, i + tokenSize);
      if (sequence === cleanPredicted) {
        return true;
      }
    }
    return false;
  };

  const fetchBlockData = async () => {
    try {
      const block = await getBlockByNumber(targetBlockNumber);
      const fetchedHash = String(block.hash);

      setRealBlockHash(fetchedHash);
      setBlockExists(true);

      calculateMatches(guessData.actualHash, fetchedHash);
    } catch (err: any) {
      if (err.message.includes("not found") || err.message.includes("null")) {
        setError(
          `Block #${targetBlockNumber.toLocaleString()} is not available yet. Current block: #${(
            currentBlockNumber || 0
          ).toLocaleString()}. Waiting for ${blocksRemaining} more blocks.`,
        );
      } else {
        setError(`Failed to fetch block data: ${err.message}`);
      }
      setBlockExists(false);
    }
  };

  const handleFetchResult = async () => {
    if (hasFetched) {
      return;
    }
    if (blocksRemaining > 0) {
      setError(
        `Block #${targetBlockNumber.toLocaleString()} hasn't been mined yet. Please wait for ${blocksRemaining} more blocks (~${estimatedTime}).`,
      );
      return;
    }

    setIsFetching(true);
    setError("");
    setShowVideoPopup(true);
    setHasFetched(true);

    // Start fetching block data in the background while video plays
    fetchBlockData();
  };

  const handleVideoComplete = () => {
    setShowVideoPopup(false);
    setIsFetching(false);
  };

  const isBlockReady = blocksRemaining <= 0 && targetBlockNumber > 0;

  const actualTokens = realBlockHash
    ? tokenize(realBlockHash, guessData.tokenSize)
    : [];
  const tokenMatches = realBlockHash
    ? guessData.tokens.filter((token) =>
        checkTokenMatchesSequence(token, realBlockHash, guessData.tokenSize),
      ).length
    : 0;
  const tokenMatchPercentage = realBlockHash
    ? ((tokenMatches / guessData.tokens.length) * 100).toFixed(1)
    : "0.0";

  if (targetBlockNumber === 0) {
    return (
      <div className="mt-8 bg-gray-800/60 backdrop-blur-lg rounded-xl p-6 border border-gray-700 shadow-xl">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 text-purple-400 animate-spin" />
          <span className="ml-3 text-gray-400">Initializing...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {showVideoPopup && (
          <VideoLoadingPopup
            isOpen={showVideoPopup}
            videoUrl={VIDEO_URL}
            onComplete={handleVideoComplete}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-4 sm:mt-8 bg-gray-800/60 backdrop-blur-lg rounded-xl p-3 sm:p-6 border border-gray-700 shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Target className="w-7 h-7 text-purple-400" />
            GUESS RESULTS OVERVIEW
          </h2>
        </div>

        {/* Block Progress Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 p-6 rounded-xl border border-blue-500/30 mb-6"
        >
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            BLOCK PREDICTION STATUS
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-900/60 p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Current Block</div>
              <div className="text-2xl font-bold text-blue-400">
                #{(currentBlockNumber || 0).toLocaleString()}
              </div>
            </div>

            <div className="bg-gray-900/60 p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Target Block</div>
              <div className="text-2xl font-bold text-purple-400">
                #{targetBlockNumber.toLocaleString()}
              </div>
            </div>

            <div className="bg-gray-900/60 p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">
                {isBlockReady ? "Status" : "Blocks Remaining"}
              </div>
              <div
                className={`text-2xl font-bold ${
                  isBlockReady ? "text-green-400" : "text-yellow-400"
                }`}
              >
                {isBlockReady ? "✓ READY" : blocksRemaining}
              </div>
            </div>
          </div>

          {!isBlockReady && blocksRemaining > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Mining Progress</span>
                <span>Est. Time: {estimatedTime}</span>
              </div>
              <div className="relative h-3 bg-gray-900/60 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      ((guessData.blockIncrement - blocksRemaining) /
                        guessData.blockIncrement) *
                      100
                    }%`,
                  }}
                  transition={{ duration: 0.5 }}
                  className="absolute h-full bg-gradient-to-r from-blue-600 to-purple-600"
                />
              </div>
              <div className="text-center text-xs text-gray-500 mt-2">
                {guessData.blockIncrement - blocksRemaining} /{" "}
                {guessData.blockIncrement} blocks mined
              </div>
            </div>
          )}
        </motion.div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-900/60 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Hash className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-400">Block Increment</span>
            </div>
            <div className="text-xl font-bold text-white">
              +{guessData.blockIncrement} blocks
            </div>
          </div>

          <div className="bg-gray-900/60 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-400">Guess Type</span>
            </div>
            <div className="text-xl font-bold text-white">
              {guessData.paidGuess ? "Paid" : "Free"}{" "}
              {guessData.complex && "• Complex"}
            </div>
          </div>

          <div className="bg-gray-900/60 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-400">Power Hammers</span>
            </div>
            <div className="text-xl font-bold text-white">
              {guessData.tokens.length}
            </div>
          </div>
        </div>

        {/* Hash Information */}
        <div className="space-y-4 mb-6">
          <div className="bg-gray-900/40 p-4 rounded-lg border border-gray-700">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              YOUR PREDICTED HASH
            </label>
            <div className="font-mono text-sm text-green-400 break-all bg-gray-950/60 p-3 rounded border border-green-500/30">
              {guessData.actualHash}
            </div>
          </div>

          <div className="bg-gray-900/40 p-4 rounded-lg border border-gray-700">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              SECRET KEY HASH
            </label>
            <div className="font-mono text-sm text-purple-400 break-all bg-gray-950/60 p-3 rounded border border-purple-500/30">
              {guessData.secretHash}
            </div>
          </div>

          <div className="bg-gray-900/40 p-4 rounded-lg border border-gray-700">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              UNREVEALED HASH (DUMMY)
            </label>
            <div className="font-mono text-sm text-blue-400 break-all bg-gray-950/60 p-3 rounded border border-blue-500/30">
              {guessData.dummyHash}
            </div>
          </div>
        </div>

        {/* Fetch Button - NOW WITH DISABLED STATE */}
        <div className="flex justify-center mb-6">
          <motion.button
            onClick={handleFetchResult}
            disabled={isFetching || hasFetched} // Disabled if fetching or already fetched
            className={`px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-3 transition-all ${
              hasFetched
                ? "bg-gray-600 cursor-not-allowed opacity-50" // Disabled style
                : isBlockReady
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-600/30"
                  : "bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white"
            }`}
            whileHover={!hasFetched ? { scale: 1.05 } : {}}
            whileTap={!hasFetched ? { scale: 0.95 } : {}}
          >
            {hasFetched ? (
              <>
                <CheckCircle className="w-5 h-5" />
                RESULT FETCHED
              </>
            ) : isFetching ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                FETCHING BLOCK...
              </>
            ) : !isBlockReady ? (
              <>
                <Clock className="w-5 h-5" />
                WAIT {blocksRemaining} BLOCKS ({estimatedTime})
              </>
            ) : (
              <>
                <Target className="w-5 h-5" />
                FETCH RESULT
              </>
            )}
          </motion.button>
        </div>

        {/* Show message if already fetched */}
        {hasFetched && !error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border rounded-lg p-4 mb-6 bg-blue-500/10 border-blue-500/50"
          >
            <div className="flex items-start gap-3 text-blue-400">
              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-semibold block mb-1">
                  Result Already Fetched
                </span>
                <span className="text-sm">
                  You can view the results below. To fetch a new guess, please
                  clear and start a new prediction.
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error/Warning Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border rounded-lg p-4 mb-6 ${
              blocksRemaining > 0
                ? "bg-yellow-500/10 border-yellow-500/50"
                : "bg-red-500/10 border-red-500/50"
            }`}
          >
            <div
              className={`flex items-start gap-3 ${
                blocksRemaining > 0 ? "text-yellow-400" : "text-red-400"
              }`}
            >
              {blocksRemaining > 0 ? (
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <span className="font-semibold block mb-1">
                  {blocksRemaining > 0 ? "Waiting for Block" : "Error"}
                </span>
                <span className="text-sm">{error}</span>
              </div>
            </div>
          </motion.div>
        )}
        {/* Results Display */}
        <AnimatePresence>
          {blockExists && realBlockHash && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4 sm:space-y-6"
            >
              {/* Match Statistics */}
              <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 p-4 sm:p-6 rounded-xl border border-purple-500/30">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2 sm:gap-3">
                  <Target className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
                  MATCH ANALYSIS
                </h3>

                <div className="flex justify-center">
                  <div className="bg-gray-900/60 p-6 sm:p-8 rounded-lg text-center w-full sm:min-w-[300px]">
                    <div className="text-4xl sm:text-6xl font-bold text-purple-400 mb-2">
                      {tokenMatches}
                    </div>
                    <div className="text-base sm:text-lg text-gray-300 font-semibold">
                      Total Tokens Matched
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 mt-2">
                      out of {guessData.tokens.length} tokens
                    </div>
                  </div>
                </div>

                <div className="relative h-6 bg-gray-900/60 rounded-full overflow-hidden mt-6">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${tokenMatchPercentage}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="absolute h-full bg-gradient-to-r from-purple-600 to-blue-600"
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
                    {tokenMatchPercentage}% Token Match Rate
                  </div>
                </div>
              </div>

              {/* TOKEN SEQUENCE COMPARISON */}
              <TokenSequenceComparison
                predictedHash={guessData.actualHash}
                actualHash={realBlockHash}
                tokenSize={guessData.tokenSize}
              />

              {/* TOKEN COMPARISON WITH COLLAPSIBLE SECTIONS */}
              <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-gray-700">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 text-center flex items-center justify-center gap-2">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                  TOKEN COMPARISON
                </h3>

                {/* COLLAPSIBLE: Predicted Hammers */}
                <div className="mb-6">
                  <button
                    onClick={() => setIsHammersExpanded(!isHammersExpanded)}
                    className="w-full flex items-center justify-between p-4 bg-gray-900/60 rounded-lg border border-gray-700 hover:border-green-500/50 transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                      <h4 className="text-base sm:text-lg font-semibold text-gray-300">
                        YOUR PREDICTED HAMMERS
                      </h4>
                      <span className="text-xs sm:text-sm text-gray-500">
                        ({guessData.tokens.length} tokens)
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: isHammersExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {isHammersExpanded ? (
                        <ChevronUp className="w-5 h-5 text-green-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-green-400" />
                      )}
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isHammersExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-2 mt-4 p-4 bg-gray-900/20 rounded-lg">
                          {guessData.tokens.map((token, index) => {
                            const isMatched = checkTokenMatchesSequence(
                              token,
                              realBlockHash,
                              guessData.tokenSize,
                            );
                            return (
                              <RealisticHammer
                                key={`predicted-${index}`}
                                index={index}
                                token={token}
                                isMatched={isMatched}
                                isMismatch={!isMatched}
                              />
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* COLLAPSIBLE: Actual Treasure Boxes */}
                <div>
                  <button
                    onClick={() => setIsTreasureExpanded(!isTreasureExpanded)}
                    className="w-full flex items-center justify-between p-4 bg-gray-900/60 rounded-lg border border-gray-700 hover:border-amber-500/50 transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                      <h4 className="text-base sm:text-lg font-semibold text-gray-300">
                        ACTUAL BLOCK TREASURE BOXES
                      </h4>
                      <span className="text-xs sm:text-sm text-gray-500">
                        ({actualTokens.length} tokens)
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: isTreasureExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {isTreasureExpanded ? (
                        <ChevronUp className="w-5 h-5 text-amber-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-amber-400" />
                      )}
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isTreasureExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-2 mt-4 p-4 bg-gray-900/20 rounded-lg">
                          {actualTokens.map((token, index) => {
                            const isMatched = checkTokenMatchesSequence(
                              token,
                              guessData.actualHash,
                              guessData.tokenSize,
                            );
                            return (
                              <TreasureBox
                                key={`actual-${index}`}
                                index={index}
                                token={token}
                                isLarge={false}
                                isBroken={isMatched}
                              />
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Waiting State */}
        {!blockExists && !error && !isFetching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <p className="text-gray-400 text-base sm:text-lg mb-2">
              {isBlockReady
                ? "Block is ready! Click 'Fetch Result' to reveal."
                : `Waiting for ${blocksRemaining} more blocks to be mined...`}
            </p>
            {!isBlockReady && (
              <p className="text-gray-500 text-sm">
                Estimated time: {estimatedTime}
              </p>
            )}
          </motion.div>
        )}
      </motion.div>
    </>
  );
};
