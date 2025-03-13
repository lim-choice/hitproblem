import api from "./axiosInstance"; // ✅ Axios 인스턴스 사용
import { ApiResponse } from "../interfaces/api";
import { StartTestRequest, StartTestResponse } from "../interfaces/test";

// ✅ 진행중인 시험 상태 가져오기
export const fetchDuringTest = async () => {
  try {
    const response = await api.get(`/test/isDuringTest`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("[fetchDuringTest] ", error);
    throw error;
  }
};

// 시험 시작 로직
export const fetchStartTest = async (
  data: StartTestRequest
): Promise<ApiResponse<StartTestResponse>> => {
  const apiUrl = "/test/startTest";
  console.log(`fetchStartTest -- apiUrl: ${apiUrl}, data: `, data);
  const response = await api.post(apiUrl, data);
  console.log(`fetchStartTest res: `, response);
  return response.data;
};

// 시험 취소 로직
export const fetchCancelTest = async () => {
  const apiUrl = `/test/cancelTest`;
  console.log(`fetchCancelTest -- apiUrl: ${apiUrl}`);
  const response = await api.get(apiUrl);
  console.log(`fetchCancelTest res: `, response);
  return response.data;
};

// 시험 제출 로직
export const fetchSubmitTest = async (sessionId: number) => {
  try {
    const response = await api.post(`/test/submit`, { session_id: sessionId });
    return response.data;
  } catch (error) {
    console.error("[fetchSubmitTest] 시험 제출 실패:", error);
    throw error;
  }
};
