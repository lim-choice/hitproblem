import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import "./App.css";
import ProblemsPage from "./pages/ProblemsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 메인 페이지 */}
        <Route path="/" element={<MainPage />} />
        <Route path="/problems" element={<ProblemsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
