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
    <Header style={{ background: "#fff", fontWeight: 700, fontSize: "16px" }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* 로고 */}
        <div style={{ marginRight: 24 }}>
          <CircleLogo />
        </div>

        {/* 메뉴 */}
        <Menu mode="horizontal">
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
      </div>
    </Header>
  );
};

export default MainHeader;
