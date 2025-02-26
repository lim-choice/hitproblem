import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import axios from "axios";

interface SignupModalProps {
  open: boolean;
  onClose: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [signupData, setSignupData] = useState({ email: "", password: "" }); // ✅ 입력값 상태 관리

  // 모달이 열릴 때마다 입력값 초기화
  useEffect(() => {
    if (open) {
      setSignupData({ email: "", password: "" }); // ✅ 초기화
      form.resetFields(); // ✅ Ant Design Form도 초기화
    }
  }, [open]);

  // 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/signup", signupData);
      message.success("회원가입 성공! 로그인하세요.");
      onClose();
    } catch (error) {
      message.error(`회원가입 실패. 다시 시도해주세요. (${error})`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="회원가입" open={open} onCancel={onClose} footer={null}>
      <Form
        form={form}
        layout="vertical"
        initialValues={signupData}
        onFinish={handleSignup}
      >
        <Form.Item
          name="email"
          label="이메일"
          rules={[
            { required: true, message: "이메일을 입력하세요!" },
            { type: "email", message: "올바른 이메일 형식이 아닙니다!" },
          ]}
        >
          <Input
            name="email"
            value={signupData.email}
            onChange={handleChange}
            placeholder="example@email.com"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="비밀번호"
          rules={[{ required: true, message: "비밀번호를 입력하세요!" }]}
        >
          <Input.Password
            name="password"
            value={signupData.password}
            onChange={handleChange}
            placeholder="비밀번호 입력"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            회원가입
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SignupModal;
