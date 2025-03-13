import { useState, useEffect, useCallback, useRef } from "react";
import { message } from "antd";
import {
  fetchDuringTest,
  fetchStartTest,
  fetchCancelTest,
} from "../api/testApi"; // ✅ API 호출 함수
import { useNavigate } from "react-router-dom";
import { useProblemStore } from "../hooks/useProblemStore";
import { useAuthStore } from "../hooks/useAuthStore";

interface TestSession {
  session_id: number;
  test_sheet_id: number;
  remaining_time: number; // 남은 시간 (초 단위)
}

export const useTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testSession, setTestSession] = useState<TestSession | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(() => {
    return Number(sessionStorage.getItem("remainingTime")) || 0;
  });

  const user = useAuthStore((state) => state.user);
  const timerRef = useRef<NodeJS.Timeout | null>(null); // ✅ 타이머 저장

  const { fetchProblemListByTestSheet } = useProblemStore();
  const navigate = useNavigate();

  // ✅ 진행 중인 시험 확인
  const checkOngoingTest = useCallback(async () => {
    setIsLoading(true);
    console.log("checkOngoingTest");
    try {
      if (user) {
        const response = await fetchDuringTest();
        if (response.status === "success" && response.testList.length > 0) {
          const activeTest = response.testList[0]; // ✅ 첫 번째 진행 중인 시험 가져오기
          setTestSession(activeTest);
          setRemainingTime(activeTest.remaining_time);
          sessionStorage.setItem(
            "remainingTime",
            String(activeTest.remaining_time)
          ); // ✅ 페이지 새로고침 대비
        } else {
          setTestSession(null);
          setRemainingTime(0);
          sessionStorage.removeItem("remainingTime");
        }
      } else {
        console.log("로그인이 되어 있지 않은 유저");
      }
    } catch (error) {
      console.error("[useTest] 진행 중인 시험 확인 실패:", error);
      message.error("진행 중인 시험 확인 중 오류 발생");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // ✅ 시험 시작
  const startTest = useCallback(
    async (testSheetId: number) => {
      setIsLoading(true);
      try {
        const response = await fetchStartTest({ testSheetId });

        if (response.success) {
          const newTestSession: TestSession = {
            session_id: response.session_id,
            test_sheet_id: testSheetId,
            remaining_time: response.remaining_time * 60,
          };

          setTestSession(newTestSession);
          setRemainingTime(newTestSession.remaining_time);
          sessionStorage.setItem(
            "remainingTime",
            String(newTestSession.remaining_time)
          );

          await fetchProblemListByTestSheet(testSheetId);
          message.success("시험이 시작되었습니다!");
          navigate("/problems");
        } else {
          throw new Error("시험 시작 실패");
        }
      } catch (error) {
        console.error("[startTest] 시험 시작 실패:", error);
        message.error("시험을 시작하는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    },
    [fetchProblemListByTestSheet, navigate]
  );

  // ✅ 시험 취소
  const cancelTest = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetchCancelTest();
      setTestSession(null);
      setRemainingTime(0);
      sessionStorage.removeItem("remainingTime");
      message.success("시험이 취소되었습니다!");
      navigate("/test");
    } catch (error) {
      console.error("[cancelTest] 시험 취소 실패:", error);
      message.error("시험을 취소하는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // ✅ 훅이 마운트 될 때 최초 한번 시험 확인
  useEffect(() => {
    console.log("useEffect >> checkOngoingTest");
    checkOngoingTest();
  }, []);

  return {
    isLoading,
    testSession,
    remainingTime,
    checkOngoingTest,
    startTest,
    cancelTest,
  };
};

export default useTest;
