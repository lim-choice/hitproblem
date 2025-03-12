import React from "react";
import { Modal } from "antd";
import { TestSheet } from "../../interfaces/problems";

interface ExamStartModalProps {
  visible: boolean;
  selectedTest: TestSheet | null;
  onStart: () => void;
  onCancel: () => void;
}

const ExamStartModal: React.FC<ExamStartModalProps> = ({
  visible,
  selectedTest,
  onStart,
  onCancel,
}) => {
  return (
    <Modal
      title="시험 시작"
      open={visible}
      onOk={onStart}
      onCancel={onCancel}
      okText="시험 시작"
      cancelText="취소"
      centered
    >
      {selectedTest && (
        <>
          <p>
            <strong>시험명:</strong> {selectedTest.title}
          </p>
          <p>
            <strong>대분류:</strong> {selectedTest.type} /{" "}
            <strong>소분류:</strong> {selectedTest.sub_type}
          </p>
          <p>
            <strong>문항 수:</strong> {selectedTest.question_count}문항
          </p>
          <p>
            <strong>제한 시간:</strong>{" "}
            {selectedTest.time === 0 ? "제한 없음" : `${selectedTest.time}분`}
          </p>
          <p>시험을 시작하시겠습니까?</p>
        </>
      )}
    </Modal>
  );
};

export default ExamStartModal;
