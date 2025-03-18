import React from "react";
import { Layout, ConfigProvider } from "antd";
import { Helmet } from "react-helmet-async";
import { SITE_TITLE } from "../../config";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";

import { useThemeStore } from "../../hooks/useThemeStore";
import { useUIStore } from "../../hooks/useUIStore";

import BugReportModal from "../report/BugReportModal";

const { Content } = Layout;

interface AppLayoutProps {
  title: string;
  children: React.ReactNode;
  header?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ title, children, header }) => {
  const { theme } = useThemeStore(); //  Zustand에서 테마 관리
  const { isBugModalOpen, toggleBugModal } = useUIStore(); //  Zustand에서 UI 관리

  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: theme === "dark" ? "#1890ff" : "#4096ff" },
      }}
    >
      <Helmet>
        <title>
          {SITE_TITLE} {title ? `- ${title}` : ""}
        </title>
      </Helmet>
      <Layout
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          background: theme === "dark" ? "#141414" : "#fff",
        }}
      >
        {/* 공통 헤더 */}
        {header ? header : <AppHeader />}

        {/* 페이지 컨텐츠 영역 */}
        <Content
          style={{
            flex: 1,
            minHeight: "80%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </Content>

        {/* 공통 푸터 */}
        <AppFooter />

        {/* 버그 신고 모달 */}
        <BugReportModal open={isBugModalOpen} onClose={toggleBugModal} />
      </Layout>
    </ConfigProvider>
  );
};

export default AppLayout;
