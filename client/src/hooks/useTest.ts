import { useState, useEffect, useCallback, useRef } from "react";
import { message } from "antd";
import {
  fetchDuringTest,
  fetchStartTest,
  fetchCancelTest,
  finishTest,
  postTestAnswer,
} from "../api/testApi"; // ✅ API 호출 함수
import { useNavigate } from "react-router-dom";
import { useProblemStore } from "../hooks/useProblemStore";
import { useAuthStore } from "../hooks/useAuthStore";
import { useTestStore } from "../hooks/useTestStore"; // ✅ Zustand 전역 상태 관리 추가
import { TestSession } from "../interfaces/test";
import { Problem } from "../interfaces/problems";

export const useTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null); // ✅ 타이머 저장

  // ✅ Zustand에서 전역 상태 관리
  const { testSession, setTestSession, remainingTime, setRemainingTime } =
    useTestStore();

  const user = useAuthStore((state) => state.user);
  const { fetchProblemListByTestSheet } = useProblemStore();
  const navigate = useNavigate();

  // ✅ 진행 중인 시험 확인
  const checkOngoingTest = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await fetchDuringTest();
      if (response.status === "success" && response.testList.length > 0) {
        const activeTest = response.testList[0];
        setTestSession(activeTest);
        setRemainingTime(activeTest.remaining_time);
        sessionStorage.setItem(
          "remainingTime",
          String(activeTest.remaining_time)
        );
      } else {
        console.log("???????????");
        setTestSession(null);
        setRemainingTime(0);
        sessionStorage.removeItem("remainingTime");
        stopTimer();
      }
    } catch (error) {
      console.error("[useTest] 진행 중인 시험 확인 실패:", error);
      message.error("진행 중인 시험 확인 중 오류 발생");
    } finally {
      setIsLoading(false);
    }
  }, [user, setTestSession, setRemainingTime]);

  // ✅ 타이머 시작 (1초마다 감소)
  const startTimer = useCallback(() => {
    console.log("⏳ 타이머 시작! <startTimer> 초기 남은 시간:", remainingTime);

    if (timerRef.current) return; // ✅ 중복 실행 방지
    console.log("⏳ 타이머 시작! 초기 남은 시간:", remainingTime);
    timerRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        console.log("⏳ 현재 남은 시간:", prev);
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          message.warning("시험 시간이 종료되었습니다.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [setRemainingTime]); // ✅ `remainingTime`을 의존성에서 제거

  // ✅ 타이머 정지
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      console.log("🛑 타이머 중지됨");
    }
  }, []);

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

          navigate("/problems");
          await fetchProblemListByTestSheet(testSheetId);
          message.success("시험이 시작되었습니다!");

          startTimer(); // ✅ 시험 시작 후 타이머 실행
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
    [fetchProblemListByTestSheet, navigate, startTimer]
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

      stopTimer();
    } catch (error) {
      console.error("[cancelTest] 시험 취소 실패:", error);
      message.error("시험을 취소하는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [navigate, stopTimer]);

  // ✅ 시험 제출
  const submitTest = useCallback(
    async (problem: Problem[]) => {
      if (!testSession) return;

      setIsLoading(true);
      try {
        const responseAnswer = await postTestAnswer(testSession, problem);
        const responseTest = await finishTest(testSession);

        if (responseTest?.status == "success") {
          setTestSession(null);
          setRemainingTime(0);
          sessionStorage.removeItem("remainingTime");

          stopTimer(); // ✅ 타이머 정지
          message.success("시험이 제출되었습니다!");

          navigate("/completion"); // ✅ 결과 페이지로 이동
        } else {
          throw new Error("시험 제출 실패");
        }
      } catch (error) {
        console.error("[submitTest] 시험 제출 실패:", error);
        message.error("시험을 제출하는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    },
    [testSession, stopTimer, navigate]
  );

  // ✅ 페이지 이동 후에도 진행 중인 시험 유지
  useEffect(() => {
    checkOngoingTest();
  }, [checkOngoingTest]);

  return {
    isLoading,
    testSession,
    remainingTime,
    checkOngoingTest,
    startTest,
    stopTimer,
    cancelTest,
    submitTest,
  };
};

export default useTest;
