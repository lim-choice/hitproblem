import { create } from "zustand";

interface UIStore {
  isBugModalOpen: boolean;
  toggleBugModal: () => void;
  setIsBugModalOpen: (flag: boolean) => void;
  showProblemStats: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isBugModalOpen: false,
  toggleBugModal: () =>
    set((state) => ({ isBugModalOpen: !state.isBugModalOpen })),
  setIsBugModalOpen: (flag) => set({ isBugModalOpen: flag }),
  showProblemStats: () => {
    console.log("문제 통계 보기 클릭!");
  },
}));
