import React, { useState } from "react";
import { Modal, Form, Input, Upload, Button, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import axios from "axios";
import api from "../../api/axiosInstance";

interface BugReportModalProps {
  open: boolean;
  onClose: () => void;
}

const BugReportModal: React.FC<BugReportModalProps> = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // ✅ API 호출 및 버그 신고 제출
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const response = await api.post(`/report/bug`, {
        content: values.description,
      });

      message.success("버그 신고가 접수되었습니다.");
      form.resetFields();
      onClose();
    } catch (error) {
      console.error("버그 신고 오류:", error);
      message.error("버그 신고 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit2 = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);

      // ✅ 스크린샷 파일이 있을 경우 추가
      if (values.screenshot && values.screenshot.file) {
        formData.append("screenshot", values.screenshot.file);
      }

      // ✅ API 요청 (버그 신고 제출)
      await axios.post("http://localhost:5000/api/bug-report", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      message.success("버그 신고가 접수되었습니다.");
      form.resetFields();
      onClose();
    } catch (error) {
      console.error("버그 신고 오류:", error);
      message.error("버그 신고 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="버그 신고"
      open={open}
      onOk={handleSubmit} // ✅ 직접 API 호출
      confirmLoading={loading}
      onCancel={onClose}
      okText="제출"
      cancelText="취소"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="description"
          label="버그 설명"
          rules={[{ required: true, message: "버그 내용을 입력하세요." }]}
        >
          <Input.TextArea
            rows={8}
            placeholder="버그 내용을 자세히 입력해주세요."
          />
        </Form.Item>
        <Form.Item name="screenshot" label="스크린샷 (선택)">
          <Upload.Dragger beforeUpload={() => false}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              여기에 파일을 드래그하거나 클릭하여 업로드하세요.
            </p>
            <p className="ant-upload-hint">
              최대 5MB의 PNG/JPG 파일을 업로드할 수 있습니다.
            </p>
          </Upload.Dragger>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BugReportModal;
