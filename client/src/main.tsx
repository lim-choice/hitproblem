import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "antd/dist/reset.css"; // ✅ Ant Design 스타일 추가
import "./index.css"; // 기존 CSS 유지

createRoot(document.getElementById("root")!).render(
  //StrictMode는 useEffect을 두번씩 호출함 (over react 18)
  //<StrictMode>
  <App />
  //</StrictMode>
);
