import { create } from "zustand";

interface TestSession {
  session_id: number;
  test_sheet_id: number;
  remaining_time: number;
}

interface TestState {
  testSession: TestSession | null;
  remainingTime: number;
  setTestSession: (session: TestSession | null) => void;
  setRemainingTime: (time: number) => void;
}

export const useTestStore = create<TestState>((set) => ({
  testSession: null,
  remainingTime:
    (() => {
      const storedTime = sessionStorage.getItem("remainingTime");
      return storedTime ? Number(storedTime) : null; // ❌ 0으로 초기화하면 안됨
    })() || 3600, // ✅ 기본값: 1시간 (초 단위)

  setTestSession: (session) => {
    set({ testSession: session });

    if (session) {
      sessionStorage.setItem("testSession", JSON.stringify(session));
      sessionStorage.setItem("remainingTime", String(session.remaining_time));
    } else {
      sessionStorage.removeItem("testSession");
      sessionStorage.removeItem("remainingTime");
    }
  },

  setRemainingTime: (time) => {
    if (time > 0) {
      // ✅ 0 이하 값이 저장되지 않도록 방어 코드 추가
      set({ remainingTime: time });
      sessionStorage.setItem("remainingTime", String(time));
    }
  },
}));
