import React, { useState } from "react";
import { Modal, Form, Input, Button, message, Flex, Space } from "antd";
import axios from "axios";
import SignupModal from "./SignupModal"; // 회원가입 모달 import

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (token: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [isSignupOpen, setIsSignupOpen] = useState(false); // 회원가입 모달 상태

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/login",
        values
      );
      message.success("로그인 성공!");
      onSuccess(response.data.token);
      onClose();
    } catch (error) {
      message.error(
        `로그인 실패. 이메일 또는 비밀번호를 확인하세요. (${error})`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal title="로그인" open={open} onCancel={onClose} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleLogin}>
          <Form.Item
            name="email"
            label="이메일"
            rules={[
              { required: true, message: "이메일을 입력하세요!" },
              { type: "email", message: "올바른 이메일 형식이 아닙니다!" },
            ]}
          >
            <Input placeholder="example@email.com" />
          </Form.Item>
          <Form.Item
            name="password"
            label="비밀번호"
            rules={[{ required: true, message: "비밀번호를 입력하세요!" }]}
          >
            <Input.Password placeholder="비밀번호 입력" />
          </Form.Item>
          {/* 로그인 & 회원가입 버튼 한 줄 정렬 */}
          <Form.Item>
            <Flex justify="space-between">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ width: "48%" }}
              >
                로그인
              </Button>
              <Button
                type="default"
                onClick={() => setIsSignupOpen(true)}
                style={{
                  width: "48%",
                  border: "1px solid #1890ff", // 테두리 색상 (Ant Design primary color)
                  color: "#1890ff",
                  backgroundColor: "white",
                }}
              >
                회원가입
              </Button>
            </Flex>
          </Form.Item>
          {/* 테스트 코드 */}
          <>
            <Form.Item>
              <Button
                type="default"
                onClick={() => {
                  message.success("로그인 성공!");
                  onSuccess("test123123123");
                  onClose();
                }}
                style={{
                  width: "48%",
                  border: "1px solid #1890ff", // 테두리 색상 (Ant Design primary color)
                  color: "#1890ff",
                  backgroundColor: "white",
                }}
              >
                테스트 로그인
              </Button>
            </Form.Item>
          </>
        </Form>
      </Modal>

      {/* 회원가입 모달 */}
      <SignupModal open={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
    </>
  );
};

export default LoginModal;
