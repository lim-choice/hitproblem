import { useState } from "react";
import { loginUser, logoutUser } from "../api/auth";
import { LoginResponse } from "../interfaces/auth";

export const useAuth = () => {
  const [user, setUser] = useState<LoginResponse | null>(null);

  const login = async (email: string, password: string) => {
    const response = await loginUser({ email, password });
    setUser(response.data);
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return { user, login };
};
