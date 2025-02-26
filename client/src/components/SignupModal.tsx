import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, message, Space } from "antd";
import { useRegister } from "../hooks/useRegister";
import { RegisterRequest } from "../interfaces/auth";

interface SignupModalProps {
  open: boolean;
  onClose: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ open, onClose }) => {
  const { register } = useRegister();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // 모달이 열릴 때 폼 초기화
  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open, form]);

  // ✅ 한글 랜덤 닉네임 생성 함수
  const generateRandomNick = () => {
    const consonants = "ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ"; // 초성
    const vowels = "ㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣ"; // 중성
    const finalConsonants = [
      "",
      "ㄱ",
      "ㄴ",
      "ㄷ",
      "ㄹ",
      "ㅁ",
      "ㅂ",
      "ㅅ",
      "ㅇ",
      "ㅈ",
      "ㅊ",
      "ㅋ",
      "ㅌ",
      "ㅍ",
      "ㅎ",
    ]; // 종성

    const getRandomChar = (charSet: string | string[]) =>
      charSet[Math.floor(Math.random() * charSet.length)];

    let randomNick = "";
    for (let i = 0; i < 4; i++) {
      const first = getRandomChar(consonants);
      const middle = getRandomChar(vowels);
      const last = getRandomChar(finalConsonants);

      const completeChar = String.fromCharCode(
        44032 +
          consonants.indexOf(first) * 588 +
          vowels.indexOf(middle) * 28 +
          finalConsonants.indexOf(last)
      );

      randomNick += completeChar;
    }

    form.setFieldsValue({ nick: randomNick }); // ✅ Form 상태 변경
  };

  // ✅ 회원가입 처리
  const handleSignup = async (values: {
    email: string;
    password: string;
    nick: string;
  }) => {
    setLoading(true);
    try {
      const requestData: RegisterRequest = {
        user: {
          email: values.email,
          nick: values.nick,
          id: 0,
        },
        password: values.password,
      };

      await register(requestData);
      message.success("회원가입 성공! 로그인하세요.");
      onClose();
      form.resetFields();
    } catch (error) {
      message.error("회원가입 실패. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="회원가입" open={open} onCancel={onClose} footer={null}>
      <Form form={form} layout="vertical" onFinish={handleSignup}>
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

        {/* ✅ 별명 입력창 + 랜덤 닉네임 버튼 */}
        <Form.Item
          name="nick"
          label="별명"
          rules={[{ required: true, message: "별명을 입력하세요!" }]}
        >
          <Space.Compact style={{ width: "100%" }}>
            <Input placeholder="별명 입력" />
            <Button onClick={generateRandomNick} type="default">
              랜덤
            </Button>
          </Space.Compact>
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
