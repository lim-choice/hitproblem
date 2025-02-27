import { User } from "./user";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: User;
}

export interface LoginCheckResponse {
  message: string;
  token: string;
}

export interface RegisterRequest {
  user: User;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}
