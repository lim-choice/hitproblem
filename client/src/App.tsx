import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import "./App.css";
import ProblemListPage from "./pages/ProblemListPage";
import ProblemsPage from "./pages/ProblemsPage";
import TestPage from "./pages/TestPage";
import TestCompletionPage from "./pages/TestCompletionPage";
import { HelmetProvider } from "react-helmet-async";
import TestStatistics from "./pages/TestStatistics";

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          {/* 메인 페이지 */}
          <Route path="/" element={<MainPage />} />
          <Route path="/problemList" element={<ProblemListPage />} />
          <Route path="/problems" element={<ProblemsPage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/completion" element={<TestCompletionPage />} />
          <Route path="/testStatistics" element={<TestStatistics />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
