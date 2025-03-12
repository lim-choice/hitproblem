import React from "react";
import { Modal, Button } from "antd";

interface ExamCancelModalProps {
  visible: boolean;
  onCancelConfirm: () => void;
  onCancel: () => void;
}

const ExamCancelModal: React.FC<ExamCancelModalProps> = ({
  visible,
  onCancelConfirm,
  onCancel,
}) => {
  return (
    <Modal
      title="시험 취소 확인"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          닫기
        </Button>,
        <Button key="submit" type="primary" danger onClick={onCancelConfirm}>
          시험 취소
        </Button>,
      ]}
      centered
    >
      <p>현재 진행 중인 시험을 취소하시겠습니까?</p>
      <p>시험을 취소하면 다시 시작해야 합니다.</p>
    </Modal>
  );
};

export default ExamCancelModal;
