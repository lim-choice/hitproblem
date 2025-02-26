import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, message, Space } from "antd";
import axios from "axios";

interface SignupModalProps {
  open: boolean;
  onClose: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    nick: "",
  }); // ✅ 닉네임 추가

  // 모달이 열릴 때 초기화
  useEffect(() => {
    if (open) {
      setSignupData({ email: "", password: "", nick: "" }); // ✅ 초기화
      form.resetFields();
    }
  }, [open]);

  // 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  // ✅ 올바른 한글 글자(초성 + 중성 + 종성) 조합하여 4글자 닉네임 생성
  const generateRandomNick = () => {
    const consonants = "ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ"; // 초성 (기본 자음)
    const vowels = "ㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣ"; // 중성 (기본 모음)
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
    ]; // 종성 (받침, 없을 수도 있음)

    const getRandomChar = (charSet: string | string[]) =>
      charSet[Math.floor(Math.random() * charSet.length)];

    let randomNick = "";
    for (let i = 0; i < 4; i++) {
      const first = getRandomChar(consonants); // 초성 선택
      const middle = getRandomChar(vowels); // 중성 선택
      const last = getRandomChar(finalConsonants); // 종성 선택 (없을 수도 있음)

      // 완전한 한글 글자 조합 (유니코드 계산)
      const completeChar = String.fromCharCode(
        44032 +
          consonants.indexOf(first) * 588 +
          vowels.indexOf(middle) * 28 +
          finalConsonants.indexOf(last)
      );
      randomNick += completeChar;
    }

    setSignupData({ ...signupData, nick: randomNick });
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/signup", signupData);
      message.success("회원가입 성공! 로그인하세요.");
      onClose();
    } catch (error) {
      message.error("회원가입 실패. 다시 시도해주세요.");
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

        {/* ✅ 별명 입력창 + 랜덤 버튼 */}
        <Form.Item
          name="nick"
          label="별명"
          rules={[{ required: true, message: "별명을 입력하세요!" }]}
        >
          <Space.Compact style={{ width: "100%" }}>
            <Input
              name="nick"
              value={signupData.nick}
              onChange={handleChange}
              placeholder="별명 입력"
              style={{ flex: 1 }} // 입력창 크기 조정
            />
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
