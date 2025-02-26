import React, { useState, useEffect, useRef } from "react";
import QueryResultTable from "../components/QueryResultTable";
import LoginModal from "../components/LoginModal";
import {
  Alert,
  Layout,
  Splitter,
  Card,
  Button,
  Breadcrumb,
  Typography,
  ConfigProvider,
  Switch,
  Drawer,
  List,
  Tag,
  message,
} from "antd";
import {
  BookOutlined,
  PlayCircleOutlined,
  HomeOutlined,
  PieChartOutlined,
  BugOutlined,
  MoonOutlined,
  SunOutlined,
  MenuOutlined,
  LeftOutlined,
  RightOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import MonacoEditor, { OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import _ from "lodash";

const { Header, Footer, Content } = Layout;
const { Text } = Typography;

export default function ProblemsPage() {
  const [isLoginVisible, setLoginVisible] = useState(false); // ✅ API에서 가져올 문제 목록

  const [serverError, setServerError] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [problems, setProblems] = useState<Problem | null>(); // ✅ API에서 가져올 문제 목록
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  const [isExecuting, setIsExecuting] = useState(false); // ✅ 실행 중 여부
  const [executionResult, setExecutionResult] = useState<
    object | string | null
  >(null); // ✅ 실행 결과
  const [executionColor, setExecutionColor] = useState("#ccc"); // ✅ 실행 결과 색상

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const [api, contextHolder] = message.useMessage();

  type Problem = {
    id: number;
    title: string;
    description: string;
    difficulty: "쉬움" | "중간" | "어려움";
  };

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor; // ✅ TypeScript에서 문제없이 작동
  };

  const handleChartProblem = async () => {
    api.info("TODO..");

    setExecutionResult([
      { id: 1, name: "Alice", age: 25 },
      { id: 2, name: "Bob", age: 30 },
    ]);
  };

  const handleBugReport = async () => {
    api.info("TODO..");
  };

  const handleSubmit = () => {};

  const handlePrevProblem = () => {
    if (!problems || problems.length === 0 || !selectedProblem) return;

    const currentIndex = problems.findIndex((p) => p.id === selectedProblem.id);
    if (currentIndex > 0) {
      setSelectedProblem(problems[currentIndex - 1]);
      setCurrentIndex(currentIndex - 1);
    } else {
      api.warning("이전 문제가 없습니다.");
    }
  };

  const handleNextProblem = () => {
    if (!problems || problems.length === 0 || !selectedProblem) return;

    const currentIndex = problems.findIndex((p) => p.id === selectedProblem.id);
    if (currentIndex < problems.length - 1) {
      setSelectedProblem(problems[currentIndex + 1]);
      setCurrentIndex(currentIndex + 1);
    } else {
      api.warning("다음 문제가 없습니다.");
    }
  };

  // ✅ 코드 실행 함수
  const executeSQL = async () => {
    console.log("executeSQL!");

    if (!selectedProblem) {
      api.warning("문제를 먼저 선택하세요.");
      return;
    }

    const code = editorRef.current ? editorRef.current.getValue() : ""; // Monaco Editor에서 코드 가져오기
    console.log(`code: ${code}`);
    if (!code.trim()) {
      api.warning("SQL 코드를 입력하세요.");
      return;
    }

    setIsExecuting(true); // ✅ 로딩 시작
    setExecutionResult(null);
    setExecutionColor("#ccc"); // 기본 색상

    try {
      const response = await fetch("http://localhost:5000/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: selectedProblem.id,
          userQuery: code,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `서버 오류 (${response.status}): ${response.statusText}`
        );
      }

      const data = await response.json();
      if (data.isCorrect) {
        setExecutionColor("green"); // ✅ 정답이면 초록색
        api.success("정답입니다! 🎉");
      } else {
        setExecutionColor("red"); // ❌ 오답이면 빨간색
        setExecutionResult(data);
        api.error("오답입니다. 다시 시도하세요.");
      }
      setExecutionResult(data.message);
    } catch (error) {
      console.log(error);
      setExecutionColor("red");
      setExecutionResult(`SQL 실행 중 오류가 발생했습니다. (${error})`);
      api.error(`SQL 실행 중 오류가 발생했습니다. (${error})`);
    } finally {
      setIsExecuting(false); // ✅ 로딩 종료
    }
  };

  type DifficultyType = "쉬움" | "중간" | "어려움";
  const difficultyColors: Record<DifficultyType, string> = {
    쉬움: "green",
    중간: "orange",
    어려움: "red",
  };

  // ✅ 다크모드 토글
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    if (!_.isNil(selectedProblem)) {
      setDrawerVisible(false);
      setExecutionResult(null);
      setExecutionColor("#ccc");
      console.log(`useEffect: selectedProblem - ${selectedProblem}`);
    }
  }, [selectedProblem]);

  // ✅ API에서 문제 목록 가져오기 (첫 로딩 시 실행)
  useEffect(() => {
    fetch("http://localhost:5000/api/problems")
      .then((res) => res.json())
      .then((data) => {
        setProblems(data);
        if (data.length > 0) {
          setSelectedProblem(data[0]); // 첫 번째 문제를 기본 선택
        }
      })
      .catch((error) => {
        setServerError(true);
        console.error("문제 목록 불러오기 실패:", error);
      });

    const token = sessionStorage.getItem("token");
    if (_.isEmpty(token)) {
      setLoginVisible(true);
    }
  }, []);

  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: theme === "dark" ? "#1890ff" : "#4096ff" },
      }}
    >
      {serverError && (
        <Alert
          message="서버 오류"
          description="서버가 연결중이지 않습니다. 관리자에게 문의해주세요."
          type="error"
          showIcon
        />
      )}
      {contextHolder} {/* ✅ message 사용을 위한 context */}
      <LoginModal
        open={isLoginVisible}
        onClose={() => {
          const token = sessionStorage.getItem("token");
          if (!_.isEmpty(token)) {
            setLoginVisible(false);
          } else {
            api.warning(`로그인 한 사람만 이용 가능합니다.`);
          }
        }}
        onSuccess={(token: string) => {
          api.info(`로그인 성공! 토큰: ${token}`);
          sessionStorage.setItem("token", token); // 토큰 저장
        }}
      />
      <Layout
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          background: theme === "dark" ? "#141414" : "#fff",
        }}
      >
        {/* ✅ 헤더 영역 */}
        <Header
          style={{
            backgroundColor: theme === "dark" ? "#1f1f1f" : "#fff",
            padding: "12px 24px",
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid #ddd",
            justifyContent: "space-between",
          }}
        >
          {/* 왼쪽 로고 & 네비게이션 */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <HomeOutlined
              style={{
                fontSize: "24px",
                color: theme === "dark" ? "#1890ff" : "#4096ff",
                marginRight: "12px",
              }}
            />
            <Breadcrumb
              separator=">"
              style={{
                fontSize: "16px",
                color: theme === "dark" ? "#ccc" : "#000",
              }}
              items={[
                { title: <a href="#">대단원</a> },
                { title: "중단원" },
                { title: "소단원" },
              ]}
            />
          </div>

          {/* ✅ 다크모드/라이트모드 스위치 */}
          <Switch
            checked={theme === "dark"}
            onChange={toggleTheme}
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
          />
        </Header>

        <Content
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
              justifyContent: "space-between", // ✅ 좌우 정렬
              padding: "10px",
              backgroundColor: theme === "dark" ? "#333" : "#f0f2f5",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              gap: "8px",
            }}
          >
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
                  ? `${selectedProblem.title} (${currentIndex + 1}/${problems.length})`
                  : "문제 제목"}
              </span>
            </div>
            {/* ⬅️ 이전 문제 | 다음 문제 ➡️ 버튼 */}
            <div style={{ display: "flex", gap: "8px" }}>
              <Button
                type="default"
                icon={<LeftOutlined />}
                onClick={handlePrevProblem} // ✅ 이전 문제로 이동
              >
                이전 문제
              </Button>
              <Button type="default" onClick={handleNextProblem}>
                다음 문제 <RightOutlined style={{ marginLeft: 4 }} />
                {/* ✅ 아이콘이 버튼 내부에 위치 */}
              </Button>
              <Button
                type="primary"
                icon={<CheckOutlined />} // ✅ 체크 아이콘 추가
                onClick={handleSubmit} // ✅ 제출 로직
              >
                제출
              </Button>
            </div>
          </div>
          <Splitter
            style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", height: "100%" }}
          >
            <Splitter.Panel
              style={{ boxSizing: "border-box", position: "relative" }}
              min={"20%"}
            >
              <Card
                title={
                  selectedProblem ? (
                    <>
                      <Tag
                        color={
                          difficultyColors[
                            selectedProblem.difficulty as DifficultyType
                          ] || "default"
                        }
                      >
                        {selectedProblem.difficulty}
                      </Tag>{" "}
                      {selectedProblem.title}
                    </>
                  ) : (
                    "문제 제목"
                  )
                }
                extra={
                  <Button
                    type="primary"
                    icon={<PlayCircleOutlined />}
                    loading={isExecuting} // ✅ 실행 중이면 로딩 표시
                    onClick={executeSQL}
                  >
                    {isExecuting ? "실행 중..." : "코드 실행"}
                  </Button>
                }
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  background: theme === "dark" ? "#222" : "#fff",
                  color: theme === "dark" ? "#ddd" : "#000",
                }}
                styles={{
                  header: {
                    backgroundColor: theme === "dark" ? "#333" : "#f5f5f5",
                    fontSize: "16px",
                    padding: "12px",
                    color: theme === "dark" ? "#ddd" : "#000",
                  },
                }}
              >
                {selectedProblem ? selectedProblem.description : "문제 설명"}
              </Card>
            </Splitter.Panel>

            <Splitter.Panel
              style={{ boxSizing: "border-box", height: "100%" }}
              min={"20%"}
            >
              <Splitter layout="vertical" style={{ height: "100%" }}>
                {/* ✅ Monaco Editor 적용 */}
                <Splitter.Panel
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "60%",
                    boxSizing: "border-box",
                  }}
                  min={"20%"}
                >
                  <MonacoEditor
                    height="100%"
                    width="100%"
                    defaultLanguage="sql"
                    theme={theme === "dark" ? "vs-dark" : "light"}
                    value={"SELECT * FROM users;"}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                    }}
                    onMount={handleEditorMount}
                  />
                </Splitter.Panel>

                {/* ✅ 실행 결과 카드 추가 */}
                <Splitter.Panel
                  style={{ height: "40%", boxSizing: "border-box" }}
                  min={"20%"}
                >
                  <Card
                    title="실행 결과"
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      background: theme === "dark" ? "#222" : "#fff",
                      color: theme === "dark" ? "#ddd" : "#000",
                      border: `1px solid ${executionColor}`, // ✅ 실행 결과에 따라 색상 변경
                    }}
                    styles={{
                      header: {
                        backgroundColor: theme === "dark" ? "#333" : "#f5f5f5",
                        fontSize: "16px",
                        padding: "12px",
                        color: theme === "dark" ? "#ddd" : "#000",
                      },
                    }}
                  >
                    {isExecuting ? (
                      <div style={{ textAlign: "center", color: "#aaa" }}>
                        ⏳ 실행 중...
                      </div>
                    ) : (
                      <div style={{ color: executionColor }}>
                        {Array.isArray(executionResult) ? (
                          <QueryResultTable data={executionResult} />
                        ) : (
                          <div>
                            {executionResult ||
                              "SQL 실행 결과가 여기에 표시됩니다."}
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                </Splitter.Panel>
              </Splitter>
            </Splitter.Panel>
          </Splitter>
        </Content>

        {/* ✅ Drawer (문제 목록) */}
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
                  const currentIndex = problems.findIndex(
                    (p) => p.id === item.id
                  );
                  setSelectedProblem(item);
                  setDrawerVisible(false);
                  setCurrentIndex(currentIndex);
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

        <Footer
          style={{
            backgroundColor: theme === "dark" ? "#1f1f1f" : "#f8f9fa",
            padding: "12px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #ddd",
            color: theme === "dark" ? "#ccc" : "#000",
          }}
        >
          {/* <div>
            <Button
              type="default"
              icon={<MenuOutlined />}
              style={{
                position: "absolute",
                bottom: "10px",
                left: "10px",
              }}
              onClick={() => setDrawerVisible(true)}
            >
              문제 목록
            </Button>
          </div> */}
          <div>
            <Button
              type="text"
              icon={<PieChartOutlined />}
              style={{ marginRight: "8px" }}
              onClick={handleChartProblem}
            >
              문제 통계
            </Button>
            <Button
              type="text"
              icon={<BugOutlined />}
              onClick={handleBugReport}
              danger
            >
              버그 신고
            </Button>
          </div>
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}
