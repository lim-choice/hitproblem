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
