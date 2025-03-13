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
  setRemainingTime: (update: number | ((prev: number) => number)) => void; // 함수형 업데이트 & 직접 값 할당 지원
}

export const useTestStore = create<TestState>((set, get) => ({
  testSession: null,
  remainingTime: (() => {
    const storedTime = sessionStorage.getItem("remainingTime");
    return storedTime ? Number(storedTime) : 99999; // 기본값
  })(),

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

  setRemainingTime: (update) => {
    set((state) => {
      console.log("setRemainingTime 호출됨!");
      console.log("현재 상태 >> ", state.remainingTime);
      console.log("update 값 >> ", update);

      // ✅ update가 undefined이면 기존 값을 유지
      if (update === undefined) {
        console.warn("🚨 setRemainingTime가 undefined로 호출됨!");
        return { remainingTime: state.remainingTime }; // 기존 값 유지
      }

      // ✅ update가 함수면 실행하여 새 값 계산
      const newTime =
        typeof update === "function" ? update(state.remainingTime) : update;

      console.log("계산된 newTime >> ", newTime);

      if (isNaN(newTime) || newTime < 0) {
        console.error("🚨 잘못된 값 감지:", newTime);
        return { remainingTime: 0 }; // ✅ NaN 방지
      }

      if (newTime > 0) {
        sessionStorage.setItem("remainingTime", String(newTime));
      } else {
        sessionStorage.removeItem("remainingTime");
      }

      return { remainingTime: newTime };
    });
  },
}));
