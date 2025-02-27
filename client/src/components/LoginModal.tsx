import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, message, Flex } from "antd";
import SignupModal from "./SignupModal"; // 회원가입 모달 import
import { useAuthStore } from "../hooks/useAuthStore";

const LoginModal: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { user, login, isLoginModalOpen, closeLoginModal } = useAuthStore();
  const [isSignupOpen, setIsSignupOpen] = useState(false); // 회원가입 모달 상태

  // 모달이 열릴 때 입력 필드 초기화
  useEffect(() => {
    if (isLoginModalOpen) {
      form.resetFields();
    }
  }, [isLoginModalOpen, form]);

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      message.success("로그인 성공!");
      closeLoginModal(); // ✅ Zustand 상태 업데이트로 모달 닫기
    } catch (error) {
      message.error("로그인 실패. 이메일 또는 비밀번호를 확인하세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        title="로그인"
        open={isLoginModalOpen}
        onCancel={closeLoginModal}
        footer={null}
      >
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
                style={{ width: "48%" }}
              >
                회원가입
              </Button>
            </Flex>
          </Form.Item>
        </Form>
      </Modal>

      {/* 회원가입 모달 */}
      <SignupModal open={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
    </>
  );
};

export default LoginModal;
