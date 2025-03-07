import { create } from "zustand";
import { loginUser, logoutUser, checkAuth } from "../api/auth";
import { User } from "../interfaces/user";

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyLogin: () => Promise<void>;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  checkLoginModal: () => void;
}

// ✅ Zustand 전역 상태 저장소
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoginModalOpen: false, // 로그인 모달 상태 추가
  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),
  checkLoginModal: () => {
    const { user } = get();
    set({ isLoginModalOpen: !user });
  },

  verifyLogin: async () => {
    try {
      const response = await checkAuth();
      set({ user: response.data.user, isLoginModalOpen: false });
    } catch (error) {
      console.log(error);
      set({ user: null, isLoginModalOpen: true });
    }
  },

  login: async (email, password) => {
    const response = await loginUser({ email, password });
    set({ user: response.data.user, isLoginModalOpen: false });
  },

  logout: async () => {
    await logoutUser();
    set({ user: null, isLoginModalOpen: true });
  },
}));
