import React, { useEffect } from "react";
import { Layout, Breadcrumb, Switch, Avatar, Dropdown } from "antd";
import {
  HomeOutlined,
  MoonOutlined,
  SunOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import LoginModal from "../../components/auth/LoginModal";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useAuthStore } from "../../hooks/useAuthStore";

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();
  const { user, verifyLogin, checkLoginModal, logout } = useAuthStore();

  // 프로필 드롭다운 메뉴
  const menuItems = [
    {
      key: "user-info",
      label: (
        <span style={{ fontWeight: "bold", color: "#333" }}>
          {user?.nick} 님
        </span>
      ), // 닉네임 표시 (클릭 안 됨)
      disabled: true, // 클릭 방지
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "로그아웃",
      onClick: () => {
        logout();
      },
    },
  ];

  // API에서 문제 목록 가져오기 (첫 로딩 시 실행)
  useEffect(() => {
    //페이지 새로고침 시 로그인 상태 확인
    verifyLogin().then(() => checkLoginModal());
  }, [verifyLogin, checkLoginModal]);

  return (
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
      {/* 로그인 모달 */}
      <LoginModal />

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
          items={[{ title: <a href="/">{document.title}</a> }]}
        />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* 다크모드/라이트모드 스위치 */}
        <Switch
          checked={theme === "dark"}
          onChange={toggleTheme}
          checkedChildren={<MoonOutlined />}
          unCheckedChildren={<SunOutlined />}
        />
        {/* 로그인 상태에 따라 프로필 아이콘 */}
        {user ? (
          <Dropdown
            menu={{ items: menuItems }}
            trigger={["click"]}
            getPopupContainer={(triggerNode) =>
              triggerNode.parentElement || document.body
            }
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
  );
};

export default AppHeader;
