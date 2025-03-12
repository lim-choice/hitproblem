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
      cancelText="진행중인 시험 취소"
      maskClosable={false} //모달 바깥쪽을 클릭해도 닫히지 않는 프로퍼티
      keyboard={false} //esc키 (X)키를 눌러도 닫히지 않는 프로퍼티
      closable={false} //우측상단 X키를 숨기는 프로퍼티
      centered
    >
      <p>진행 중인 시험이 있습니다. 이어서 진행하시겠습니까?</p>
    </Modal>
  );
};

export default ExamContinueModal;
