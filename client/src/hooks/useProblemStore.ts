import { create } from "zustand";
import { fetchProblemsByTopic, fetchProblemById } from "../api/problemApi";

interface Problem {
  id: number;
  title: string;
  major_topic: string;
  mid_topic: string;
  sub_topic: string;
  difficulty: string;
  content: string;
}

interface ProblemState {
  problems: Problem[];
  selectedProblem: Problem | null;
  loading: boolean;
  error: string | null;
  fetchProblemsByTopic: (topic: string) => Promise<void>;
  fetchSingleProblem: (id: number) => Promise<void>;
  setSelectedProblem: (problem: Problem) => void;
}

// ✅ Zustand 전역 상태 관리
export const useProblemStore = create<ProblemState>((set) => ({
  problems: [],
  selectedProblem: null,
  loading: false,
  error: null,

  // ✅ 특정 topic의 문제 목록 가져오기
  fetchProblemsByTopic: async (topic) => {
    set({ loading: true, error: null });
    try {
      const problems = await fetchProblemsByTopic(topic);
      set({
        problems,
        selectedProblem: problems.length > 0 ? problems[0] : null,
      });
    } catch (error) {
      set({ error: `문제 목록을 불러오는 중 오류 발생 (${error})` });
    } finally {
      set({ loading: false });
    }
  },

  // ✅ 특정 문제 가져오기
  fetchSingleProblem: async (id) => {
    set({ loading: true, error: null });
    try {
      const problem = await fetchProblemById(id);
      set({ selectedProblem: problem });
    } catch (error) {
      set({ error: `문제 목록을 불러오는 중 오류 발생 (${error})` });
    } finally {
      set({ loading: false });
    }
  },

  setSelectedProblem: (problem) => set({ selectedProblem: problem }),
}));
