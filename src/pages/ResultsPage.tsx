import { useLocation, useNavigate } from "react-router-dom";
import { RewardScreen } from "../components/animations/RewardScreen";
import { FailureScreen } from "../components/animations/FailureScreen";

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Data passed via router state from GuessPage
  const { success, actualHash, realBlockHash } = location.state || {
    success: false,
    actualHash: "",
    realBlockHash: "",
  };

  // This function is called by the animation screens when they finish
  const handleComplete = () => {
    localStorage.clear(); // Clear all localStorage data
    navigate("/"); // Redirect back to the home page
  };

  if (success) {
    return (
      <RewardScreen onComplete={handleComplete} realBlockHash={realBlockHash} />
    );
  }

  return (
    <FailureScreen
      onComplete={handleComplete}
      actualHash={actualHash}
      realBlockHash={realBlockHash}
    />
  );
};

export default ResultsPage;
