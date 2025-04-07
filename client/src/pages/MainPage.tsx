import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Modal, Row, Typography } from "antd";
import AppLayout from "../components/common/AppLayout";
import MainHeader from "../components/main/MainHeader";
import MainCarousel from "../components/main/MainCarousel";

export default function MainPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const { Title, Paragraph, Text } = Typography;

  return (
    // <AppLayout title="메인 페이지" header={<MainHeader />} footer={<></>}>
    //   {/* 세로 카드 리스트 */}
    //   <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
    //     <Card hoverable>
    //       <Title level={4}>SQL 연습 문제</Title>
    //       <Paragraph>
    //         데이터베이스 테이블을 다루는 기본 SELECT 문부터 JOIN, GROUP BY 등
    //         다양한 쿼리 스킬을 연습하세요.
    //       </Paragraph>
    //     </Card>

    //     <Card hoverable>
    //       <Title level={4}>Python 기초 문제</Title>
    //       <Paragraph>
    //         파이썬 문법을 복습하고, 기본 문법을 테스트할 수 있는 문제들입니다.
    //         조건문, 반복문, 함수 작성까지.
    //       </Paragraph>
    //     </Card>
    //   </div>
    // </AppLayout>

    <AppLayout title="메인 페이지" header={<MainHeader />} footer={<></>}>
      {/* 상단 Carousel */}
      <MainCarousel />

      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <Title level={2}>문제 해결, 지금 시작하세요</Title>
        <Paragraph type="secondary">
          원하는 메뉴를 선택해 문제를 풀어보세요.
        </Paragraph>
      </div>

      <Row gutter={[32, 32]} justify="center">
        <Col xs={24} sm={12} md={8}>
          <Card
            hoverable
            onClick={() => navigate("/test")}
            style={{ borderRadius: 16 }}
          >
            <Title level={4}>시험 목록 보기</Title>
            <Paragraph type="secondary">
              시험에 응시하고 성적을 확인하세요.
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            hoverable
            onClick={() => navigate("/problemList")}
            style={{ borderRadius: 16 }}
          >
            <Title level={4}>문제 목록</Title>
            <Paragraph type="secondary">
              전체 문제를 확인하고 연습해보세요.
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            hoverable
            onClick={() => setIsModalOpen(true)}
            style={{ borderRadius: 16 }}
          >
            <Title level={4}>랜덤 문제</Title>
            <Paragraph type="secondary">
              랜덤으로 문제를 추천받고 풀어보세요.
            </Paragraph>
          </Card>
        </Col>
      </Row>

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => setIsModalOpen(false)}
      >
        <p>랜덤 문제 내용</p>
      </Modal>
    </AppLayout>
  );
}
