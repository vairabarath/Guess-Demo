import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();

  // For this demo, we always navigate to Guess ID 1
  const startGuess = () => {
    navigate("/guess/1");
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-center p-4">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="text-5xl md:text-7xl font-bold text-white mb-4"
      >
        Guess Protocol
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7, type: "spring" }}
        className="text-lg md:text-xl text-purple-300 mb-8 max-w-2xl"
      >
        A decentralized application for predicting blockchain data. Press the
        button below to start your guess.
      </motion.p>
      <motion.button
        onClick={startGuess}
        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-lg transition-all transform flex items-center gap-3 shadow-2xl shadow-purple-600/30"
        whileHover={{
          scale: 1.1,
          boxShadow: "0 0 30px rgba(168, 85, 247, 0.6)",
        }}
        whileTap={{ scale: 0.95 }}
      >
        Start Guess
        <ArrowRight className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default HomePage;
