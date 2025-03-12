import React, { useEffect, useState, useCallback } from "react";
import { Table, Button, Alert, message } from "antd";
import { useProblemStore } from "../hooks/useProblemStore";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/common/AppLayout";
import { TestSheet } from "../interfaces/problems";

const TestPage: React.FC = () => {
  const {
    problems,
    selectedProblem,
    testSheets,
    fetchTestSheetList,
    fetchProblemListByTestSheet,
  } = useProblemStore();
  const [serverError, setServerError] = useState(false);
  const [isFetching, setIsFetching] = useState(false); // API 요청 중인지 확인
  const navigate = useNavigate();

  // 시험 목록 가져오기 (최초 로딩 시)
  useEffect(() => {
    fetchTestSheetList().catch(() => setServerError(true));
  }, []);

  // 문제 가져온 후 자동으로 페이지 이동
  useEffect(() => {
    if (isFetching && Array.isArray(problems) && problems.length > 0) {
      console.log("problem", problems);
      console.log("selectedProblem", selectedProblem);

      navigate("/problems");
      setIsFetching(false);
    }
  }, [problems, isFetching, navigate]);

  // 시험지 선택 시 문제 목록 가져오기
  const handleSelectProblem = useCallback(
    async (record: TestSheet) => {
      setIsFetching(true);
      await fetchProblemListByTestSheet(record.id);
    },
    [fetchProblemListByTestSheet]
  );

  const columns = [
    { title: "대분류", dataIndex: "type", key: "type" },
    { title: "소분류", dataIndex: "sub_type", key: "sub_type" },
    { title: "시험명", dataIndex: "title", key: "title" },
    {
      title: "제한 시간",
      dataIndex: "time",
      key: "time",
      render: (time: number) => (time === 0 ? "제한 없음" : `${time}분`),
    },
    {
      title: "문항 수",
      dataIndex: "question_count",
      key: "question_count",
      render: (question_count: number) =>
        question_count === 0 ? "문제 없음" : `${question_count}개`,
    },
    {
      title: "내용",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "액션",
      key: "action",
      render: (_: unknown, record: TestSheet) => (
        <Button type="primary" onClick={() => handleSelectProblem(record)}>
          시험 보기
        </Button>
      ),
    },
  ];

  return (
    <AppLayout title="테스트">
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
          width: "80%",
          background: "#fff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
          margin: "auto",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          📚 어느 시험을 풀어보실래요?
        </h2>
        <Table
          dataSource={testSheets}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </div>
    </AppLayout>
  );
};

export default TestPage;
