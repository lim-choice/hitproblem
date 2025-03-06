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

  // ✅ SQL 실행 관련 상태
  isExecuting: boolean;
  executionResult: object | string | null;
  executionColor: string;
  setIsExecuting: (isExecuting: boolean) => void;
  setExecutionResult: (result: object | string | null) => void;
  setExecutionColor: (color: string) => void;

  // ✅ Monaco Editor의 입력된 코드 상태 추가
  userCode: string;
  setUserCode: (code: string) => void;
}

// ✅ Zustand store 수정
export const useProblemStore = create<ProblemState>((set) => ({
  problems: [],
  selectedProblem: null,
  loading: false,
  error: null,

  isExecuting: false,
  executionResult: null,
  executionColor: "#ccc",

  setIsExecuting: (isExecuting) => set({ isExecuting }),
  setExecutionResult: (result) => set({ executionResult: result }),
  setExecutionColor: (color) => set({ executionColor: color }),

  // ✅ 기본 코드값 추가 (예제 SQL)
  userCode: "SELECT * FROM users;",
  setUserCode: (code) => set({ userCode: code }),

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
