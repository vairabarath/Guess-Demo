import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";

interface FailureScreenProps {
  onComplete: () => void;
  actualHash: string;
  realBlockHash: string;
}

export const FailureScreen: React.FC<FailureScreenProps> = ({
  onComplete,
  actualHash,
  realBlockHash,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 8000); // 8-second display
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="text-center"
      >
        <XCircle className="w-20 h-20 text-red-500 mx-auto" />
        <h1 className="text-4xl font-bold text-white mt-4">No Match Found</h1>
        <p className="text-lg text-gray-400 mt-2">Better luck next time!</p>

        <div className="mt-6 text-left text-xs font-mono max-w-2xl mx-auto space-y-4">
          <div className="bg-gray-800 p-3 rounded-lg">
            <p className="text-red-400 font-semibold">YOUR HASH:</p>
            <p className="text-gray-300 break-all">{actualHash}</p>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            <p className="text-green-400 font-semibold">REAL BLOCK HASH:</p>
            <p className="text-gray-300 break-all">{realBlockHash}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
