import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { fetchDuringTest, fetchStartTest } from "../api/testApi"; // ✅ API 호출 함수
import { useNavigate } from "react-router-dom";
import { useProblemStore } from "../hooks/useProblemStore";

interface TestStatus {
  testCount: number;
  testList: any[];
  status: string;
}

export const useTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isTestOngoing, setIsTestOngoing] = useState(false);
  const [testData, setTestData] = useState<TestStatus | null>(null);
  const { fetchProblemListByTestSheet } = useProblemStore();
  const navigate = useNavigate();

  // 진행 중인 시험 확인
  const checkOngoingTest = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchDuringTest();
      if (response.status === "success" && response.testCount > 0) {
        setIsTestOngoing(true);
        setTestData(response);
      } else {
        setIsTestOngoing(false);
        setTestData(null);
      }
    } catch (error) {
      console.error("[useTest] 진행 중인 시험 확인 실패:", error);
      message.error("진행 중인 시험 확인 중 오류 발생");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ 시험 시작
  const startTest = useCallback(
    async (testSheetId: number) => {
      setIsLoading(true);
      try {
        await fetchStartTest({ testSheetId });
        await fetchProblemListByTestSheet(testSheetId);
        message.success("시험이 시작되었습니다!");
        navigate("/problems");
      } catch (error) {
        console.error("[useTest] 시험 시작 실패:", error);
        message.error("시험을 시작하는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    },
    [fetchProblemListByTestSheet, navigate]
  );

  // ✅ 훅이 실행될 때 자동으로 진행 중인 시험 확인
  useEffect(() => {
    checkOngoingTest();
  }, [checkOngoingTest]);

  return {
    isLoading,
    isTestOngoing,
    testData,
    checkOngoingTest,
    startTest,
  };
};

export default useTest;
