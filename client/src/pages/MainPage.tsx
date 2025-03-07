import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "antd";

export default function MainPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div>
      <h1>SQL 문제 풀어보자</h1>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        랜덤 문제 풀기
      </Button>
      <Button type="primary" onClick={() => navigate("/problemList")}>
        문제 목록 보기
      </Button>
      <Button type="primary" onClick={() => navigate("/test")}>
        시험 목록 보기
      </Button>
      <Button type="primary" onClick={() => navigate("/problems")}>
        테스트 페이지
      </Button>
      <Modal
        title="랜덤 문제"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
      >
        <p>이곳에 랜덤 문제를 표시합니다.</p>
      </Modal>
    </div>
  );
}
