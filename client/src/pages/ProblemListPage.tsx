import React, { useEffect, useState } from "react";
import { Layout, Table, Tag, Button, ConfigProvider, Alert } from "antd";
import { useProblemStore } from "../hooks/useProblemStore";
import AppHeader from "../components/common/AppHeader";
import AppFooter from "../components/common/AppFooter";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;

const ProblemListPage: React.FC = () => {
  const { problems, fetchProblemsByTopic, setSelectedProblem } =
    useProblemStore();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [serverError, setServerError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProblemsByTopic("SQL").catch(() => setServerError(true)); // ✅ SQL 기본 문제 로딩
  }, [fetchProblemsByTopic]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  const handleSelectProblem = (record: any) => {
    setSelectedProblem(record);
    navigate(`/problems/${record.id}`); // ✅ 문제 상세 페이지로 이동
  };

  const columns = [
    { title: "번호", dataIndex: "id", key: "id", width: 80 },
    { title: "제목", dataIndex: "title", key: "title" },
    {
      title: "난이도",
      dataIndex: "difficulty",
      key: "difficulty",
      render: (difficulty: string) => (
        <Tag
          color={
            difficulty === "Hard"
              ? "red"
              : difficulty === "Medium"
                ? "orange"
                : "green"
          }
        >
          {difficulty}
        </Tag>
      ),
    },
    {
      title: "문제 유형",
      dataIndex: "type",
      key: "type",
      render: (type: string) =>
        type === "multiple-choice" ? "객관식" : "주관식",
    },
    {
      title: "액션",
      key: "action",
      render: (_: any, record: any) => (
        <Button type="primary" onClick={() => handleSelectProblem(record)}>
          문제 풀기
        </Button>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: theme === "dark" ? "#1890ff" : "#4096ff" },
      }}
    >
      {serverError && (
        <Alert
          message="서버 오류"
          description="서버가 연결되지 않았습니다. 관리자에게 문의하세요."
          type="error"
          showIcon
        />
      )}
      <Layout
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          background: theme === "dark" ? "#141414" : "#fff",
        }}
      >
        <AppHeader theme={theme} toggleTheme={toggleTheme} />
        <Content
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "80%",
              background: theme === "dark" ? "#222" : "#fff",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h2
              style={{
                textAlign: "center",
                marginBottom: "20px",
                color: theme === "dark" ? "#ddd" : "#000",
              }}
            >
              📚 문제 목록
            </h2>
            <Table
              dataSource={problems}
              columns={columns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </div>
        </Content>
        <AppFooter openBugReport={() => console.log("버그 신고")} />
      </Layout>
    </ConfigProvider>
  );
};

export default ProblemListPage;
