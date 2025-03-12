import React from "react";
import { Modal } from "antd";

interface ExamContinueModalProps {
  visible: boolean;
  onContinue: () => void;
  onCancel: () => void;
}

const ExamContinueModal: React.FC<ExamContinueModalProps> = ({
  visible,
  onContinue,
  onCancel,
}) => {
  return (
    <Modal
      title="진행 중인 시험 발견"
      open={visible}
      onOk={onContinue}
      onCancel={onCancel}
      okText="시험 이어서 하기"
      cancelText="새로 시작"
      centered
    >
      <p>진행 중인 시험이 있습니다. 이어서 진행하시겠습니까?</p>
    </Modal>
  );
};

export default ExamContinueModal;
