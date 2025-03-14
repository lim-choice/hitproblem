import api from "./axiosInstance"; // ✅ Axios 인스턴스 사용
import { ApiResponse } from "../interfaces/api";
import {
  StartTestRequest,
  StartTestResponse,
  LoadSavedTestResponse,
  TestSession,
} from "../interfaces/test";
import { Problem } from "../interfaces/problems";

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
export const finishTest = async (testSession: TestSession) => {
  try {
    const response = await api.post(`/test/finishTest`, {
      testSession,
    });
    return response.data;
  } catch (error) {
    console.error("[finishTest] 시험 제출 실패:", error);
    throw error;
  }
};

//시험 문제 저장
export const postTestAnswer = async (
  testSession: TestSession,
  problem: Problem[]
) => {
  try {
    const response = await api.post(`/test/postTestAnswer`, {
      testSession,
      problem,
    });
    return response.data;
  } catch (error) {
    console.error("[postTestAnswer] 시험 제출 실패:", error);
    throw error;
  }
};

//시험 불러오기
export const fetchLoadSavedTest = async (
  testSession: TestSession
): Promise<ApiResponse<LoadSavedTestResponse>> => {
  const apiUrl = "/test/fetchLoadSavedTest";
  console.log(`fetchLoadSavedTest -- apiUrl: ${apiUrl}, data: `, testSession);
  const response = await api.post(apiUrl, testSession);
  console.log(`fetchLoadSavedTest res: `, response);
  return response.data;
};
