import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Modal, Row, Typography } from "antd";
import AppLayout from "../components/common/AppLayout";
import MainHeader from "../components/main/MainHeader";
import MainCarousel from "../components/main/MainCarousel";

const MyPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const { Title, Paragraph, Text } = Typography;

  return (
    <AppLayout title="마이 페이지" footer={<></>}>
      {/* 상단 Carousel */}
      <p>마이마이마이</p>
      <div style={{ height: 48 }} />
    </AppLayout>
  );
};

export default MyPage;
