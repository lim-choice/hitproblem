import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Result } from "antd";
import AppLayout from "../components/common/AppLayout";

const TestCompletionPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleViewResults = () => {
    navigate("/test-results");
  };

  return (
    <AppLayout title="테스트 완료">
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
      >
        <Card
          style={{
            width: "50%",
            textAlign: "center",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <Result
            status="success"
            title="🎉 시험이 완료되었습니다!"
            subTitle="시험을 완료하셨습니다. 결과를 확인하거나 홈으로 이동하세요."
          />
          <div style={{ marginTop: "20px" }}>
            <Button
              type="primary"
              onClick={handleViewResults}
              style={{ marginRight: "10px" }}
            >
              결과 보기
            </Button>
            <Button onClick={handleGoHome}>홈으로 이동</Button>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default TestCompletionPage;
