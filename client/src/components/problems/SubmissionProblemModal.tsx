import React from "react";
import { Modal, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import "../../styles/problems.css";

interface Problem {
  index: number;
  answer: string;
}

interface Props {
  problems: Problem[]; // 문제 리스트
  visible: boolean; // 모달 표시 여부
  onCancel: () => void; // 모달 취소 핸들러
  onConfirm: () => void; // 최종 제출 핸들러
}

const SubmissionModal: React.FC<Props> = ({
  problems,
  visible,
  onCancel,
  onConfirm,
}) => {
  const columns: ColumnsType<Problem> = [
    {
      title: "문제 번호",
      dataIndex: "index",
      key: "index",
      align: "center", // ✅ string 타입이 아닌 리터럴 값으로 설정
    },
    {
      title: "입력한 답",
      dataIndex: "answer",
      key: "answer",
      align: "center", // ✅ string 대신 'center' | 'left' | 'right' 중 하나 사용
    },
  ];

  return (
    <Modal
      title="정말로 제출하시겠습니까?"
      open={visible}
      onCancel={onCancel}
      onOk={onConfirm}
      okText="제출"
      cancelText="취소"
    >
      <Table
        columns={columns}
        dataSource={problems}
        rowKey="index"
        pagination={false} // 페이징 제거
        bordered
        rowClassName={(record) =>
          !record.answer?.trim() ? "submission-highlight-row" : ""
        }
      />
    </Modal>
  );
};

export default SubmissionModal;
