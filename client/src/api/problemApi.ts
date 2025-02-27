import api from "./axiosInstance"; // ✅ Axios 인스턴스 사용

// ✅ 전체 문제 목록 가져오기
export const fetchProblems = async () => {
  try {
    const response = await api.get(`/problems`); // ✅ 모든 문제 가져오기
    return response.data.data;
  } catch (error) {
    console.error("[fetchProblems] 문제 목록 가져오기 실패:", error);
    throw error;
  }
};

// ✅ 특정 토픽의 문제 목록 가져오기
export const fetchProblemsByTopic = async (topic: string) => {
  try {
    const response = await api.get(`/problem`, {
      params: { topic }, // ✅ GET 요청에 `?topic=SQL` 형태로 전달
    });
    return response.data.data;
  } catch (error) {
    console.error("[fetchProblemsByTopic] 문제 목록 가져오기 실패:", error);
    throw error;
  }
};

// ✅ 특정 문제 가져오기 (ID 기반)
export const fetchProblemById = async (id: number) => {
  try {
    const response = await api.get(`/problem/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("[fetchProblemById] 문제 가져오기 실패:", error);
    throw error;
  }
};
