import React, { useEffect, useState, useCallback } from "react";
import { Table, Button, Alert, message, Tooltip, Tag, Modal } from "antd";
import { useProblemStore } from "../hooks/useProblemStore";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/common/AppLayout";
import { TestSheet } from "../interfaces/problems";
import { difficultyColors } from "../utils/constatns";
import type { ColumnsType } from "antd/es/table";

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

  const [selectedTest, setSelectedTest] = useState<TestSheet | null>(null); // ✅ 선택한 시험 저장
  const [isModalVisible, setIsModalVisible] = useState(false); // ✅ 모달 상태 관리

  const navigate = useNavigate();

  // TestSheet 타입 확장 (난이도별 문제 개수 추가)
  interface ExtendedTestSheet extends TestSheet {
    easy_count: number;
    medium_count: number;
    hard_count: number;
  }

  // 시험 목록 가져오기 (최초 로딩 시)
  useEffect(() => {
    sessionStorage.removeItem("preventRefresh");
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
  // const handleSelectProblem = useCallback(
  //   async (record: TestSheet) => {
  //     setIsFetching(true);
  //     await fetchProblemListByTestSheet(record.id);
  //   },
  //   [fetchProblemListByTestSheet]
  // );

  const handleSelectProblem = useCallback((record: TestSheet) => {
    setSelectedTest(record);
    setIsModalVisible(true); // 모달 열기
  }, []);

  const handleStartExam = async () => {
    if (!selectedTest) return;
    await fetchProblemListByTestSheet(selectedTest.id);
    setIsFetching(true);
    setIsModalVisible(false);
  };

  // 툴팁 렌더링 함수
  const renderQuestionCountTooltip = (record: ExtendedTestSheet) => {
    const difficultyLevels = ["Easy", "Medium", "Hard"] as const;

    return (
      <Tooltip
        title={
          <div style={{ padding: "5px" }}>
            {difficultyLevels.map((level) => {
              const key =
                `${level.toLowerCase()}_count` as keyof ExtendedTestSheet;
              return (
                <div
                  key={level}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Tag color={difficultyColors[level] || "default"}>
                    {level}
                  </Tag>
                  {record[key] || 0}개
                </div>
              );
            })}
          </div>
        }
        overlayInnerStyle={{ backgroundColor: "#fff", color: "#000" }} // ✅ 툴팁 배경 하얀색
      >
        {record.question_count === 0 ? "-" : `${record.question_count}개`}
      </Tooltip>
    );
  };

  // 제한 시간 렌더링 함수
  const renderTime = (time: number) => (time === 0 ? "-" : `${time}분`);

  // 컬럼 정의
  const columns: ColumnsType<TestSheet> = [
    { title: "대분류", dataIndex: "type", key: "type" },
    { title: "소분류", dataIndex: "sub_type", key: "sub_type" },
    { title: "시험명", dataIndex: "title", key: "title" },
    {
      title: "문항 수",
      dataIndex: "question_count",
      key: "question_count",
      align: "center",
      render: (_, record) => renderQuestionCountTooltip(record),
    },
    {
      title: "제한 시간",
      dataIndex: "time",
      key: "time",
      align: "center",
      render: renderTime,
    },
    { title: "내용", dataIndex: "description", key: "description" },
    {
      title: "액션",
      key: "action",
      render: (_, record) => (
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
      {/* ✅ 시험 시작 모달 */}
      <Modal
        title="시험 시작"
        open={isModalVisible}
        onOk={handleStartExam}
        onCancel={() => setIsModalVisible(false)}
        okText="시험 시작"
        cancelText="취소"
        centered
      >
        {selectedTest && (
          <>
            <p>
              <strong>시험명:</strong> {selectedTest.title}
            </p>
            <p>
              <strong>대분류:</strong> {selectedTest.type} /{" "}
              <strong>소분류:</strong> {selectedTest.sub_type}
            </p>
            <p>
              <strong>문항 수:</strong> {selectedTest.question_count}문항
            </p>
            <p>
              <strong>제한 시간:</strong>{" "}
              {selectedTest.time === 0 ? "제한 없음" : `${selectedTest.time}분`}
            </p>
            <p>시험을 시작하시겠습니까?</p>
          </>
        )}
      </Modal>
    </AppLayout>
  );
};

export default TestPage;
