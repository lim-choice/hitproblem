import axios from "axios";
import { API_BASE_URL } from "../config";

const api = axios.create({
  baseURL: API_BASE_URL, // ✅ API 서버 주소 적용
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ 쿠키(세션) 인증이 필요하면 추가
});

export default api;
