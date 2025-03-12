import React, { useState, useEffect } from "react";
import { Card, Input, Splitter, Tag } from "antd";
import MarkdownViewer from "../common/MarkdownViewer";
import { Problem } from "../../interfaces/problems";
import { difficultyColors } from "../../utils/constatns";

interface SubjectiveProblemProps {
  selectedProblem: Problem;
}

const SubjectiveProblem: React.FC<SubjectiveProblemProps> = ({
  selectedProblem,
}) => {
  const [answer, setAnswer] = useState(selectedProblem?.answer || "");

  useEffect(() => {
    setAnswer(selectedProblem?.answer || "");
  }, [selectedProblem]);

  const handleAnswerChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newAnswer = event.target.value;
    setAnswer(newAnswer);
    selectedProblem.answer = newAnswer;
  };

  return (
    <Splitter
      style={{
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        height: "100%",
      }}
    >
      {/* ✅ 문제 설명 (Markdown 렌더링) */}
      <Splitter.Panel
        style={{
          boxSizing: "border-box",
          position: "relative",
        }}
        min={"10%"}
      >
        <Card
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
          title={
            selectedProblem ? (
              <>
                <Tag
                  color={
                    difficultyColors[selectedProblem.difficulty] || "default"
                  }
                >
                  {selectedProblem.difficulty}
                </Tag>
                {" 문제"}
                {selectedProblem.index}
              </>
            ) : (
              "문제 제목"
            )
          }
        >
          <div style={{ flex: 1, overflowY: "auto" }}>
            <MarkdownViewer
              content={`### ${selectedProblem?.title}  ${selectedProblem?.content ?? ""}`}
            />
          </div>
        </Card>
      </Splitter.Panel>

      {/* ✅ 답안 입력 영역 */}
      <Splitter.Panel
        style={{
          boxSizing: "border-box",
          height: "100%",
        }}
        min={"20%"}
      >
        <Card
          title="답안 입력"
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
          bodyStyle={{ flex: 1, display: "flex", flexDirection: "column" }} // ✅ Card 내부 확장
        >
          <Input.TextArea
            value={answer}
            onChange={handleAnswerChange}
            placeholder="답안을 입력하세요."
            style={{
              flex: 1, // ✅ 부모 크기에 맞게 자동 확장
              resize: "none", // ✅ 사용자가 크기 조정하지 못하도록 설정
            }}
          />
        </Card>
      </Splitter.Panel>
    </Splitter>
  );
};

export default SubjectiveProblem;
