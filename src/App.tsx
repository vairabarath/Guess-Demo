import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GuessPage from "./pages/GuessPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/guess/:id" element={<GuessPage />} />
      </Routes>
    </Router>
  );
}

export default App;
