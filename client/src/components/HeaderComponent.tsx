import React from "react";
import {
  Layout,
  Breadcrumb,
  Switch,
  Avatar,
  Dropdown,
  Menu,
  message,
} from "antd";
import {
  HomeOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons";
import { useAuth } from "../hooks/useAuth";

const { Header } = Layout;

interface HeaderProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const HeaderComponent: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  const { user, logout } = useAuth(); // ✅ 로그인 정보 가져오기

  const handleLogout = async () => {
    await logout();
    message.success("로그아웃 되었습니다.");
  };

  const menu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <a href="/profile">내 프로필</a>
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        <a href="/settings">설정</a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        로그아웃
      </Menu.Item>
    </Menu>
  );

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

      {/* ✅ 우측: 다크모드/라이트모드 스위치 & 유저 프로필 */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* 다크모드 토글 */}
        <Switch
          checked={theme === "dark"}
          onChange={toggleTheme}
          checkedChildren={<MoonOutlined />}
          unCheckedChildren={<SunOutlined />}
        />

        {/* ✅ 로그인 상태에 따라 프로필 아이콘 */}
        {user ? (
          <Dropdown overlay={menu} trigger={["click"]}>
            <Avatar
              size={40}
              src={user?.profileImage || undefined} // 🔥 프로필 이미지 있으면 표시
              icon={!user.profileImage ? <UserOutlined /> : undefined} // 기본 아이콘
              style={{ cursor: "pointer", backgroundColor: "#1890ff" }}
            />
          </Dropdown>
        ) : (
          <a href="/login">
            <Avatar
              size={40}
              icon={<UserOutlined />}
              style={{ cursor: "pointer", backgroundColor: "#ccc" }}
            />
          </a>
        )}
      </div>
    </Header>
  );
};

export default HeaderComponent;
