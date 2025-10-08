import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import ReactConfetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";

interface RewardScreenProps {
  onComplete: () => void;
  realBlockHash: string;
}

export const RewardScreen: React.FC<RewardScreenProps> = ({
  onComplete,
  realBlockHash,
}) => {
  const { width, height } = useWindowSize();

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 7000); // 7-second display
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gray-950 flex flex-col items-center justify-center overflow-hidden">
      <ReactConfetti width={width} height={height} numberOfPieces={300} />
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="text-center"
      >
        <Trophy className="w-24 h-24 text-yellow-400 mx-auto" />
        <h1 className="text-4xl font-bold text-white mt-4">Congratulations!</h1>
        <p className="text-lg text-gray-300 mt-2">You found a perfect match!</p>
        <div className="mt-4 text-xs font-mono text-green-400 bg-black/30 p-3 rounded-lg max-w-lg mx-auto break-all">
          <p>MATCHING HASH:</p>
          <p>{realBlockHash}</p>
        </div>
      </motion.div>
    </div>
  );
};
