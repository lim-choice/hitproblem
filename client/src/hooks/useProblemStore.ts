import { create } from "zustand";
import {
  fetchProblemsByTopic,
  fetchProblemListByTestSheet,
  fetchProblemById,
  fetchTestSheetList,
} from "../api/problemApi";

import { TestSheet, Problem } from "../interfaces/problems";

interface ProblemState {
  testSheets: TestSheet[];
  problems: Problem[];
  selectedProblem: Problem | null;
  loading: boolean;
  error: string | null;
  fetchTestSheetList: () => Promise<void>;
  fetchProblemListByTestSheet: (id: number) => Promise<void>;
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
  testSheets: [],
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

  // 시험지 가져오는 API
  fetchTestSheetList: async () => {
    set({ loading: true, error: null });
    try {
      const testSheets = await fetchTestSheetList();
      console.log(testSheets);
      set({ testSheets: testSheets });
    } catch (error) {
      set({ error: `문제 목록을 불러오는 중 오류 발생 (${error})` });
    } finally {
      set({ loading: false });
    }
  },

  // 시험지 ID에 따른 문제 가져오는 API
  fetchProblemListByTestSheet: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const problems = await fetchProblemListByTestSheet(id);
      set({
        problems,
        selectedProblem: problems.length > 0 ? problems[0] : null,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      set({ error: `문제 목록을 불러오는 중 오류 발생 (${errorMessage})` });
    } finally {
      set({ loading: false });
    }
  },

  //Legacy
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
