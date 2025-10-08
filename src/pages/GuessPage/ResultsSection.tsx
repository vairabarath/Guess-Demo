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
} from "lucide-react";
import { getBlockByNumber } from "../../services/service";
import { TreasureBox } from "../../components/ui/TreasureBox";
import { tokenize } from "../../utils/hashUtils";
import { TreasureTokenGrid } from "../../components/ui/TreasureTokenGrid";

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
  const [matchCount, setMatchCount] = useState(0);
  const [error, setError] = useState<string>("");

  const [targetBlockNumber, setTargetBlockNumber] = useState<number>(0);
  const [blocksRemaining, setBlocksRemaining] = useState<number>(0);
  const [estimatedTime, setEstimatedTime] = useState<string>("");

  // Use ref to track if we've set the initial target block
  const initialTargetSet = useRef(false);

  // Set target block number ONCE on mount
  useEffect(() => {
    if (!initialTargetSet.current && currentBlockNumber) {
      const target = currentBlockNumber + guessData.blockIncrement;
      setTargetBlockNumber(target);
      initialTargetSet.current = true;
    }
  }, [currentBlockNumber, guessData.blockIncrement]);

  // Update blocks remaining and estimated time when current block or target changes
  useEffect(() => {
    if (!currentBlockNumber || targetBlockNumber === 0) return;

    // Calculate remaining blocks
    const remaining = targetBlockNumber - currentBlockNumber;
    setBlocksRemaining(Math.max(0, remaining));

    // Estimate time (approximately 12 seconds per block on Ethereum)
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

  const handleFetchResult = async () => {
    if (blocksRemaining > 0) {
      setError(
        `Block #${targetBlockNumber.toLocaleString()} hasn't been mined yet. Please wait for ${blocksRemaining} more blocks (~${estimatedTime}).`,
      );
      return;
    }

    setIsFetching(true);
    setError("");

    try {
      const block = await getBlockByNumber(targetBlockNumber);
      const fetchedHash = String(block.hash);

      setRealBlockHash(fetchedHash);
      setBlockExists(true);

      const matches = calculateMatches(guessData.actualHash, fetchedHash);
      setMatchCount(matches);
    } catch (err: any) {
      if (err.message.includes("not found") || err.message.includes("null")) {
        setError(
          `Block #${targetBlockNumber.toLocaleString()} is not available yet. Current block: #${(currentBlockNumber || 0).toLocaleString()}. Waiting for ${blocksRemaining} more blocks.`,
        );
      } else {
        setError(`Failed to fetch block data: ${err.message}`);
      }
      setBlockExists(false);
    } finally {
      setIsFetching(false);
    }
  };

  const isBlockReady = blocksRemaining <= 0 && targetBlockNumber > 0;
  const matchPercentage = realBlockHash
    ? ((matchCount / 64) * 100).toFixed(2)
    : 0;

  // Show loading state while initializing
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
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mt-8 bg-gray-800/60 backdrop-blur-lg rounded-xl p-6 border border-gray-700 shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Target className="w-7 h-7 text-purple-400" />
          GUESS RESULTS OVERVIEW
        </h2>
        <div className="px-4 py-2 bg-purple-600/20 rounded-lg border border-purple-500/30">
          <span className="text-purple-300 font-semibold">
            ID: #{guessData.guessId}
          </span>
        </div>
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

        {/* Progress Bar */}
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

      {/* Fetch Button */}
      <div className="flex justify-center mb-6">
        <motion.button
          onClick={handleFetchResult}
          disabled={isFetching}
          className={`px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-3 transition-all ${
            isBlockReady
              ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-600/30"
              : "bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isFetching ? (
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
            className="space-y-6"
          >
            {/* Match Statistics */}
            <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 p-6 rounded-xl border border-purple-500/30">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                {matchCount > 30 ? (
                  <CheckCircle className="w-8 h-8 text-green-400" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-400" />
                )}
                MATCH ANALYSIS
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-900/60 p-4 rounded-lg text-center">
                  <div className="text-4xl font-bold text-purple-400">
                    {matchCount}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Matching Characters
                  </div>
                </div>

                <div className="bg-gray-900/60 p-4 rounded-lg text-center">
                  <div className="text-4xl font-bold text-blue-400">
                    {matchPercentage}%
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Match Percentage
                  </div>
                </div>

                <div className="bg-gray-900/60 p-4 rounded-lg text-center">
                  <div className="text-4xl font-bold text-green-400">
                    {64 - matchCount}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">Mismatches</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-6 bg-gray-900/60 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${matchPercentage}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="absolute h-full bg-gradient-to-r from-purple-600 to-blue-600"
                />
                <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
                  {matchPercentage}% Match
                </div>
              </div>
            </div>

            {/* Treasure Boxes */}
            {blockExists && realBlockHash && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Match Statistics */}
                <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 p-6 rounded-xl border border-purple-500/30">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    {matchCount > 30 ? (
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    ) : (
                      <XCircle className="w-8 h-8 text-red-400" />
                    )}
                    MATCH ANALYSIS
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-900/60 p-4 rounded-lg text-center">
                      <div className="text-4xl font-bold text-purple-400">
                        {matchCount}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        Matching Characters
                      </div>
                    </div>

                    <div className="bg-gray-900/60 p-4 rounded-lg text-center">
                      <div className="text-4xl font-bold text-blue-400">
                        {matchPercentage}%
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        Match Percentage
                      </div>
                    </div>

                    <div className="bg-gray-900/60 p-4 rounded-lg text-center">
                      <div className="text-4xl font-bold text-green-400">
                        {64 - matchCount}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        Mismatches
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative h-6 bg-gray-900/60 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${matchPercentage}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="absolute h-full bg-gradient-to-r from-purple-600 to-blue-600"
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
                      {matchPercentage}% Match
                    </div>
                  </div>
                </div>

                {/* Treasure Box Comparison - Full Hashes */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 text-center">
                    FULL HASH TREASURE COMPARISON
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TreasureBox
                      hash={guessData.actualHash}
                      label="YOUR PREDICTION"
                      isLocked={false}
                      index={0}
                    />
                    <TreasureBox
                      hash={realBlockHash}
                      label={`ACTUAL BLOCK #${targetBlockNumber.toLocaleString()}`}
                      isLocked={false}
                      index={1}
                    />
                  </div>
                </div>

                {/* Tokenized Treasure Comparison */}
                <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
                  <TreasureTokenGrid
                    predictedTokens={guessData.tokens}
                    actualTokens={tokenize(realBlockHash, guessData.tokenSize)}
                    label="TOKENIZED TREASURE HUNT"
                  />
                </div>

                {/* Final Verdict */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className={`p-6 rounded-xl border-2 ${
                    matchCount === 64
                      ? "bg-green-900/40 border-green-500"
                      : matchCount > 50
                        ? "bg-yellow-900/40 border-yellow-500"
                        : "bg-red-900/40 border-red-500"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">
                      {matchCount === 64
                        ? "🎉 PERFECT PREDICTION!"
                        : matchCount > 50
                          ? "⚡ INCREDIBLE GUESS!"
                          : matchCount > 30
                            ? "👍 SOLID ATTEMPT!"
                            : "💪 KEEP TRYING!"}
                    </div>
                    <div className="text-lg text-gray-300">
                      {matchCount === 64
                        ? `Unbelievable! You predicted the exact hash for block #${targetBlockNumber.toLocaleString()}!`
                        : matchCount > 50
                          ? `Amazing! Your prediction was remarkably close to block #${targetBlockNumber.toLocaleString()}.`
                          : matchCount > 30
                            ? `Good effort! You matched ${matchCount} characters in block #${targetBlockNumber.toLocaleString()}.`
                            : `Keep practicing! Block #${targetBlockNumber.toLocaleString()} had a different hash pattern.`}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
            {/* Final Verdict */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`p-6 rounded-xl border-2 ${
                matchCount === 64
                  ? "bg-green-900/40 border-green-500"
                  : matchCount > 50
                    ? "bg-yellow-900/40 border-yellow-500"
                    : "bg-red-900/40 border-red-500"
              }`}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {matchCount === 64
                    ? "🎉 PERFECT PREDICTION!"
                    : matchCount > 50
                      ? "⚡ INCREDIBLE GUESS!"
                      : matchCount > 30
                        ? "👍 SOLID ATTEMPT!"
                        : "💪 KEEP TRYING!"}
                </div>
                <div className="text-lg text-gray-300">
                  {matchCount === 64
                    ? `Unbelievable! You predicted the exact hash for block #${targetBlockNumber.toLocaleString()}!`
                    : matchCount > 50
                      ? `Amazing! Your prediction was remarkably close to block #${targetBlockNumber.toLocaleString()}.`
                      : matchCount > 30
                        ? `Good effort! You matched ${matchCount} characters in block #${targetBlockNumber.toLocaleString()}.`
                        : `Keep practicing! Block #${targetBlockNumber.toLocaleString()} had a different hash pattern.`}
                </div>
              </div>
            </motion.div>
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
          <div className="mb-4">
            <TreasureBox
              hash=""
              label={`BLOCK #${targetBlockNumber.toLocaleString()}`}
              isLocked={true}
              index={0}
            />
          </div>
          <p className="text-gray-400 text-lg mb-2">
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
  );
};
