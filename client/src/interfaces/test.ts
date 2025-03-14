import { Problem } from "./problems";

export interface StartTestRequest {
  testSheetId: number;
}

export interface StartTestResponse {
  success: boolean;
  message: string;
  session_id: number;
  test_sheet_id: number;
  remaining_time: number;
}

export interface LoadSavedTestResponse {
  success: boolean;
  message: string;
  testSession: TestSession;
  problems: Problem[];
}

export interface TestSession {
  session_id: number;
  test_sheet_id: number;
  remaining_time: number; // 남은 시간 (초 단위)
}
