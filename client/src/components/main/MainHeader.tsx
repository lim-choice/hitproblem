import React, { useEffect } from "react";
import { Layout, Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";
import logoWebp from "../../assets/logo.webp";

import { useThemeStore } from "../../hooks/useThemeStore";
import { useAuthStore } from "../../hooks/useAuthStore";

const { Header } = Layout;

const MainHeader: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();
  const { user, verifyLogin, checkLoginModal, logout } = useAuthStore();

  const navigate = useNavigate();

  useEffect(() => {
    // 페이지 새로고침 시 로그인 상태 확인
    verifyLogin().then(() => checkLoginModal());
  }, [verifyLogin, checkLoginModal]);

  const CircleLogo = () => {
    return (
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          overflow: "hidden",
        }}
      >
        <img
          src={logoWebp}
          alt="Logo"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover", // 로고 크기 맞추기
          }}
        />
      </div>
    );
  };

  return (
    <Header
      style={{
        background: "#fff",
        display: "flex", // flex 레이아웃 적용
        alignItems: "center", // 수직 가운데 정렬
      }}
    >
      {/* 로고 배치 (왼쪽) */}
      <div style={{ marginRight: 24 }}>
        <CircleLogo />
      </div>

      {/* 상단 수평 메뉴 */}
      <Menu
        mode="horizontal"
        defaultSelectedKeys={["exam"]}
        // 메뉴가 남는 공간을 차지하고 오른쪽으로 정렬하고 싶으면 아래처럼 flex 속성 활용 가능
        // style={{ flex: 1, justifyContent: "flex-end" }}
      >
        <Menu.Item key="exam">
          <Link to="/test">시험 목록 보기</Link>
        </Menu.Item>
        <Menu.Item key="stats">
          <Link to="/testStatistics">통계</Link>
        </Menu.Item>
        <Menu.Item key="mypage">
          <Link to="/mypage">마이페이지</Link>
        </Menu.Item>
      </Menu>
    </Header>
  );
};

export default MainHeader;
