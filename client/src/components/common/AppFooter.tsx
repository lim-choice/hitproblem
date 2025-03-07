import React from "react";
import { Layout, Button } from "antd";
import { useUIStore } from "../../hooks/useUIStore"; // ✅ Zustand 상태 사용
import { PieChartOutlined, BugOutlined } from "@ant-design/icons";
import BugReportModal from "../../components/report/BugReportModal";

const { Footer } = Layout;

const AppFooter: React.FC = () => {
  const {
    isBugModalOpen,
    toggleBugModal,
    setIsBugModalOpen,
    showProblemStats,
  } = useUIStore();

  return (
    <Footer
      style={{
        backgroundColor: "#f8f9fa",
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderTop: "1px solid #ddd",
      }}
    >
      <div>
        <Button
          type="text"
          icon={<PieChartOutlined />}
          style={{ marginRight: "8px" }}
          onClick={showProblemStats}
        >
          문제 통계
        </Button>
        <Button
          type="text"
          icon={<BugOutlined />}
          onClick={toggleBugModal}
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
  );
};

export default AppFooter;
