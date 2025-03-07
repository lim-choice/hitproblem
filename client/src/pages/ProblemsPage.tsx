import React, { useEffect, useState } from "react";

import { Alert, Button, Drawer, List, Tag, message } from "antd";
import {
  BookOutlined,
  PlayCircleOutlined,
  MenuOutlined,
  LeftOutlined,
  RightOutlined,
  CheckOutlined,
} from "@ant-design/icons";

import AppLayout from "../components/common/AppLayout";
import _ from "lodash";
import { useThemeStore } from "../hooks/useThemeStore";
import { useProblemStore } from "../hooks/useProblemStore";
import { jsonToMarkdown } from "../hooks/useMarkdown";
import { executeUserQuery } from "../api/executionApi";
import CodingProblem from "../components/problems/CodingProblem";
import MultipleChoiceProblem from "../components/problems/MultipleChoiceProblem";

export default function ProblemsPage() {
  const {
    problems,
    selectedProblem,
    setSelectedProblem,
    userCode,
    setExecutionResult,
  } = useProblemStore();

  const { theme } = useThemeStore();

  const [serverError, setServerError] = useState(false);
  const [api] = message.useMessage();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const [isExecuting, setIsExecuting] = useState(false); // 실행 중 여부
  const [executionColor, setExecutionColor] = useState("#ccc"); // 실행 결과 색상

  const handleSubmit = () => {
    api.success("TODO: 제출 구현...");
  };

  const handlePrevProblem = () => {
    console.log("handlePrevProblem problems", problems);
    console.log("handlePrevProblem", selectedProblem);
    if (!problems.length || !selectedProblem) return;

    const prevIndex = selectedProblem.index - 1; // ✅ 바로 이전 문제 index 계산
    const prevProblem = problems.find((p) => p.index === prevIndex);

    if (prevProblem) {
      setSelectedProblem(prevProblem);
    } else {
      api.warning("이전 문제가 없습니다.");
    }
  };

  const handleNextProblem = () => {
    console.log("handleNextProblem problems", problems);
    console.log("handleNextProblem", selectedProblem);
    if (!problems.length || !selectedProblem) return;

    const nextIndex = selectedProblem.index + 1; // ✅ 바로 다음 문제 index 계산
    const nextProblem = problems.find((p) => p.index === nextIndex);

    if (nextProblem) {
      setSelectedProblem(nextProblem);
    } else {
      api.warning("다음 문제가 없습니다.");
    }
  };

  // 코드 실행 함수
  const executeSQL = async () => {
    if (!selectedProblem) {
      api.warning("문제를 먼저 선택하세요.");
      return;
    }

    const code = userCode ?? "";
    if (!code.trim()) {
      api.warning("SQL 코드를 입력하세요.");
      return;
    }

    setIsExecuting(true);
    setExecutionResult(null);
    setExecutionColor("#ccc"); // 기본 상태

    //입력한 쿼리문 저장
    selectedProblem.answer = userCode;

    try {
      // API 요청
      const response = await executeUserQuery(
        selectedProblem.problem_id,
        "mysql",
        code
      );

      if (response.isCorrect) {
        setExecutionColor("green");
        api.success("정답입니다! 🎉");
      } else {
        setExecutionColor("red");
        api.error("오답입니다. 다시 시도하세요.");
      }
      console.log("0 >> ", response);
      console.log("1 >> ", response.userResult);
      const resultContent = jsonToMarkdown(response.userResult);
      console.log("2 >> ", resultContent);
      setExecutionResult(resultContent);
    } catch (error) {
      console.error("[executeSQL] SQL 실행 오류:", error);
      setExecutionColor("red");
      setExecutionResult(
        `SQL 실행 중 오류 발생: ${
          error.response?.data?.message ?? error.message
        }`
      );
      api.error(`SQL 실행 중 오류 발생: ${error.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  type DifficultyType = "쉬움" | "중간" | "어려움" | "Easy" | "Medium" | "Hard";
  const difficultyColors: Record<DifficultyType, string> = {
    쉬움: "green",
    중간: "orange",
    어려움: "red",
    Easy: "green",
    Medium: "orange",
    Hard: "red",
  };

  useEffect(() => {
    if (!_.isNil(selectedProblem)) {
      setDrawerVisible(false);
      setExecutionResult(null);
      setExecutionColor("#ccc");
      //console.log(`useEffect: selectedProblem`, selectedProblem);
    }
  }, [selectedProblem, setExecutionResult]);

  return (
    <AppLayout title="문제 풀이">
      {serverError && (
        <Alert
          message="서버 오류"
          description="서버가 연결되지 않았습니다. 관리자에게 문의하세요."
          type="error"
          showIcon
          style={{ marginBottom: "16px" }}
        />
      )}

      <div
        style={{
          display: "grid",
          gridTemplateRows: "60px auto",
          gap: "8px",
          flex: 1,
          padding: "8px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between", // 좌우 정렬
            padding: "10px",
            backgroundColor: theme === "dark" ? "#333" : "#f0f2f5",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            gap: "8px",
          }}
        >
          {/* 토픽 선택 Select 추가 */}
          {/* <Select
              defaultValue="SQL"
              style={{ width: 150 }}
              onChange={(topic) => fetchProblemsByTopic(topic)}
            >
              <Option value="SQL">SQL</Option>
              <Option value="알고리즘">알고리즘</Option>
              <Option value="자료구조">자료구조</Option>
            </Select> */}

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <MenuOutlined onClick={() => setDrawerVisible(true)} />
            <BookOutlined
              style={{
                fontSize: "24px",
                color: theme === "dark" ? "#1890ff" : "#4096ff",
              }}
            />
            <span style={{ color: theme === "dark" ? "#ddd" : "#000" }}>
              {selectedProblem
                ? `문제 ${selectedProblem?.index} (${selectedProblem?.index}/${problems.length})`
                : "문제 제목"}
            </span>
          </div>

          {/* 이전 문제 | 다음 문제 버튼 */}
          <div style={{ display: "flex", gap: "8px" }}>
            <Button
              type="default"
              icon={<LeftOutlined />}
              onClick={handlePrevProblem} // 이전 문제로 이동
              disabled={(selectedProblem?.index ?? 0) <= 1} // 첫 번째 문제에서 비활성화
            >
              이전 문제
            </Button>
            <Button
              type="default"
              onClick={handleNextProblem}
              disabled={
                (selectedProblem?.index ?? problems?.length) >= problems?.length
              }
            >
              다음 문제 <RightOutlined style={{ marginLeft: 4 }} />
            </Button>
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              loading={isExecuting} // 실행 중이면 로딩 표시
              onClick={executeSQL}
              disabled={selectedProblem?.problem_type !== "subjective"}
            >
              {isExecuting ? "실행 중..." : "코드 실행"}
            </Button>
            <Button
              type="primary"
              icon={<CheckOutlined />} // 체크 아이콘 추가
              onClick={handleSubmit} // 제출 로직
              disabled={selectedProblem?.index !== problems?.length}
            >
              제출
            </Button>
          </div>
        </div>

        {/* 문제 타입에 따라 다르게 뷰잉하도록 처리 */}
        {selectedProblem?.problem_type === "multiple-choice" ? (
          <MultipleChoiceProblem selectedProblem={selectedProblem} />
        ) : (
          <CodingProblem selectedProblem={selectedProblem} />
        )}

        {/* Drawer (문제 목록) */}
        <Drawer
          title="문제 목록"
          placement="left"
          closable={true}
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
        >
          <List
            dataSource={problems}
            renderItem={(item) => (
              <List.Item
                onClick={() => {
                  setSelectedProblem(item);
                  setDrawerVisible(false);
                }}
                style={{ cursor: "pointer" }}
              >
                <span>{item.title}</span>
                <Tag
                  color={
                    difficultyColors[item.difficulty as DifficultyType] ||
                    "default"
                  }
                >
                  {item.difficulty}
                </Tag>
              </List.Item>
            )}
          />
        </Drawer>
      </div>
    </AppLayout>
  );
}
