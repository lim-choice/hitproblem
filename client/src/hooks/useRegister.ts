import { registerUser } from "../api/auth";
import { RegisterRequest } from "../interfaces/auth";

export const useRegister = () => {
  const register = async (data: RegisterRequest) => {
    const response = await registerUser(data);
    return response.data; // 회원가입 후 응답 반환 (ex: 성공 메시지)
  };

  return { register };
};
