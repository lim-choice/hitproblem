import api from "./axiosInstance";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "../interfaces/auth";
import { ApiResponse } from "../interfaces/api";

//로그인 API
export const loginUser = async (
  data: LoginRequest
): Promise<ApiResponse<LoginResponse>> => {
  const apiUrl = "/auth/login";
  console.log(`loginUser -- apiUrl: ${apiUrl}, data: `, data);
  const response = await api.post(apiUrl, data);
  return response.data;
};

//회원가입 API
export const registerUser = async (
  data: RegisterRequest
): Promise<ApiResponse<RegisterResponse>> => {
  const apiUrl = "/auth/register";
  console.log(`useRegister -- apiUrl: ${apiUrl}, data: `, data);
  const response = await api.post(apiUrl, data);
  return response.data;
};

// 로그아웃 API
export const logoutUser = async (): Promise<void> => {
  console.log(`logoutUser`);
  await api.post("/auth/logout");
};
