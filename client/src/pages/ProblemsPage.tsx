import React, { useState, useEffect, useRef } from "react";
import LoginModal from "../components/auth/LoginModal";
import BugReportModal from "../components/report/BugReportModal";
import {
  Alert,
  Layout,
  Button,
  Breadcrumb,
  Typography,
  ConfigProvider,
  Switch,
  Drawer,
  List,
  Tag,
  message,
  Menu,
  Avatar,
  Dropdown,
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
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import _ from "lodash";
import { useAuthStore } from "../hooks/useAuthStore";
import { useProblemStore } from "../hooks/useProblemStore";
import { jsonToMarkdown } from "../hooks/useMarkdown";
import { executeUserQuery } from "../api/executionApi";
import CodingProblem from "../components/problems/CodingProblem";
import MultipleChoiceProblem from "../components/problems/MultipleChoiceProblem";

const { Header, Footer, Content } = Layout;
const { Text } = Typography;

// 😢 리팩토링은 언제 하냐 으악!! 인터페이스가 너무 많아 !!!

export default function ProblemsPage() {
  const {
    user,
    verifyLogin,
    checkLoginModal,
    openLoginModal,
    logout,
    isLoginModalOpen,
  } = useAuthStore(); // ✅ Zustand 상태 사용

  const {
    problems,
    selectedProblem,
    setSelectedProblem,
    fetchProblemsByTopic,
    userCode,
    setExecutionResult,
  } = useProblemStore();

  const [serverError, setServerError] = useState(false);
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);

  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const [isExecuting, setIsExecuting] = useState(false); // ✅ 실행 중 여부
  const [executionColor, setExecutionColor] = useState("#ccc"); // ✅ 실행 결과 색상

  const [api, contextHolder] = message.useMessage();

  //😀 샘플 데이터
  const problem = {
    id: 1,
    title: "다음 중 올바른 SQL 문장은?",
    content: "아래의 SQL 문장을 분석하고 올바른 문장을 선택하세요.",
    difficulty: "중간",
    choices: [
      "SELECT * FROM table;",
      "DELETE table;",
      "UPDATE FROM table SET name='test';",
      "INSERT INTO table (name) VALUES 'test';",
      "DROP DATABASE table;",
    ],
    answer: 1, // 정답: "SELECT * FROM table;"
  };

  // ✅ 로그인 성공 후 유저 정보 갱신
  const handleLoginSuccess = async () => {
    await verifyLogin(); // ✅ 로그인 성공 후 유저 정보 갱신
  };

  // ✅ 로그아웃 처리
  const handleLogout = async () => {
    await logout();
  };

  // ✅ 프로필 드롭다운 메뉴
  const menuItems = [
    {
      key: "user-info",
      label: (
        <span style={{ fontWeight: "bold", color: "#333" }}>
          {user?.nick} 님
        </span>
      ), // ✅ 닉네임 표시 (클릭 안 됨)
      disabled: true, // 클릭 방지
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "로그아웃",
      onClick: handleLogout,
    },
  ];

  const handleSubmit = () => {};

  const handlePrevProblem = () => {
    if (!problems.length || !selectedProblem) return;

    const currentIndex = problems.findIndex((p) => p.id === selectedProblem.id);
    if (currentIndex > 0) {
      setSelectedProblem(problems[currentIndex - 1]); // ✅ Zustand 상태 업데이트
      setCurrentIndex(currentIndex - 1);
    } else {
      api.warning("이전 문제가 없습니다.");
    }
  };

  const handleNextProblem = () => {
    if (!problems.length || !selectedProblem) return;

    const currentIndex = problems.findIndex((p) => p.id === selectedProblem.id);
    if (currentIndex < problems.length - 1) {
      setSelectedProblem(problems[currentIndex + 1]); // ✅ Zustand 상태 업데이트
      setCurrentIndex(currentIndex + 1);
    } else {
      api.warning("다음 문제가 없습니다.");
    }
  };

  // ✅ 코드 실행 함수
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

    try {
      // ✅ API 요청
      const response = await executeUserQuery(
        selectedProblem.id,
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

  // ✅ 다크모드 토글
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    if (!_.isNil(selectedProblem)) {
      setDrawerVisible(false);
      setExecutionResult(null);
      setExecutionColor("#ccc");
      //console.log(`useEffect: selectedProblem`, selectedProblem);
    }
  }, [selectedProblem]);

  // ✅ API에서 문제 목록 가져오기 (첫 로딩 시 실행)
  useEffect(() => {
    //페이지 로드 시 기본적으로 "SQL" 토픽 문제 불러오기
    fetchProblemsByTopic("SQL");

    //페이지 새로고침 시 로그인 상태 확인
    verifyLogin().then(() => checkLoginModal());
  }, []);

  // ✅ 토픽 변경 시 문제 목록 다시 불러오기
  const handleTopicChange = (topic: string) => {
    fetchProblemsByTopic(topic);
  };

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
      {/* ✅ 로그인 모달 */}
      <LoginModal
        open={isLoginModalOpen}
        onClose={openLoginModal}
        onSuccess={handleLoginSuccess}
      />
      {contextHolder} {/* ✅ message 사용을 위한 context */}
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
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* ✅ 다크모드/라이트모드 스위치 */}
            <Switch
              checked={theme === "dark"}
              onChange={toggleTheme}
              checkedChildren={<MoonOutlined />}
              unCheckedChildren={<SunOutlined />}
            />
            {/* ✅ 로그인 상태에 따라 프로필 아이콘 */}
            {user ? (
              <Dropdown
                menu={{ items: menuItems }} // ✅ `menu={{ items }}`로 변경
                trigger={["click"]}
                getPopupContainer={(triggerNode) =>
                  triggerNode.parentElement || document.body
                } // ✅ `findDOMNode` 경고 해결
              >
                <Avatar
                  size={40}
                  src={user?.profileImage || undefined} // 🔥 프로필 이미지 있으면 표시
                  icon={!user.profileImage ? <UserOutlined /> : undefined} // 기본 아이콘
                  style={{ cursor: "pointer", backgroundColor: "#1890ff" }}
                />
              </Dropdown>
            ) : (
              <Avatar
                size={40}
                icon={<UserOutlined />}
                style={{ cursor: "pointer", backgroundColor: "#ccc" }}
              />
            )}
          </div>
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
            {/* ✅ 토픽 선택 Select 추가 */}
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
                disabled={currentIndex === 0} // ✅ 첫 번째 문제에서 비활성화
              >
                이전 문제
              </Button>
              <Button type="default" onClick={handleNextProblem}>
                다음 문제 <RightOutlined style={{ marginLeft: 4 }} />
              </Button>
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                loading={isExecuting} // ✅ 실행 중이면 로딩 표시
                onClick={executeSQL}
              >
                {isExecuting ? "실행 중..." : "코드 실행"}
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

          {/* {selectedProblem?.type === "multiple-choice" ? (
            <MultipleChoiceProblem
              selectedProblem={selectedProblem}
              theme={theme}
            />
          ) : (
            <CodingProblem selectedProblem={selectedProblem} theme={theme} />
          )} */}

          <MultipleChoiceProblem selectedProblem={problem} theme={theme} />

          {/* {selectedProblem ? (
            <CodingProblem selectedProblem={selectedProblem} theme={theme} />
          ) : (
            <div>문제를 선택하세요.</div>
          )} */}
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
          <div>
            <Button
              type="text"
              icon={<PieChartOutlined />}
              style={{ marginRight: "8px" }}
            >
              문제 통계
            </Button>
            <Button
              type="text"
              icon={<BugOutlined />}
              onClick={() => setIsBugModalOpen(true)}
              danger
            >
              버그 신고
            </Button>
            <BugReportModal
              open={isBugModalOpen}
              onClose={() => setIsBugModalOpen(false)}
            />
          </div>
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}
