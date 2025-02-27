import { useState, useEffect } from "react";
import { loginUser, logoutUser, checkAuth } from "../api/auth";
import { LoginResponse } from "../interfaces/auth";

export const useAuth = () => {
  const [user, setUser] = useState<LoginResponse | null>(null);

  //로그인 상태확인 함수
  const verifyLogin = async () => {
    try {
      const response = await checkAuth(); // ✅ 백엔드에서 로그인 상태 확인
      console.log(response);
      setUser(response.data);
    } catch {
      setUser(null); // 로그인 안 되어 있으면 초기화
    }
  };

  useEffect(() => {
    verifyLogin(); // ✅ 페이지 새로고침해도 로그인 유지
  }, []);

  //로그인 함수
  const login = async (email: string, password: string) => {
    const response = await loginUser({ email, password });
    setUser(response.data);
    return response.data; // ✅ 로그인 결과를 반환
  };

  //로그아웃 함수
  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return { user, login, logout, verifyLogin };
};
