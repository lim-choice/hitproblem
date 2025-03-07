import React, { useState } from "react";
import { Card, Splitter, Table, Tag, message } from "antd";
import MarkdownViewer from "../common/MarkdownViewer";
import { useProblemStore } from "../../hooks/useProblemStore";

interface MultipleChoiceProblemProps {
  selectedProblem: {
    id: number;
    title: string;
    content: string;
    difficulty: "쉬움" | "중간" | "어려움" | "Easy" | "Medium" | "Hard";
    choices: string[]; // ✅ 객관식 선택지 (5개)
    answer: number; // ✅ 정답 (1~5)
  } | null;
  theme: "light" | "dark";
}

const difficultyColors: Record<string, string> = {
  쉬움: "green",
  중간: "orange",
  어려움: "red",
  Easy: "green",
  Medium: "orange",
  Hard: "red",
};

const MultipleChoiceProblem: React.FC<MultipleChoiceProblemProps> = ({
  selectedProblem,
  theme,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [api, contextHolder] = message.useMessage();

  return (
    <>
      {contextHolder}
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
                  </Tag>{" "}
                  {selectedProblem.title}
                </>
              ) : (
                "문제 제목"
              )
            }
          >
            <div style={{ height: "100%" }}>
              <MarkdownViewer content={selectedProblem?.content ?? ""} />
            </div>
          </Card>
        </Splitter.Panel>

        {/* ✅ 객관식 선택지 (테이블) */}
        <Splitter.Panel
          style={{
            boxSizing: "border-box",
            height: "100%",
          }}
          min={"20%"}
        >
          <Card
            title="객관식 선택지"
            style={{
              height: "100%",
            }}
          >
            <Table
              dataSource={selectedProblem?.choices.map((choice, index) => ({
                key: index + 1,
                number: index + 1, // ✅ 선택지 번호
                choice: `${index + 1}. ${choice}`, // ✅ "1. 내용", "2. 내용" 형식으로 표시
              }))}
              columns={[
                {
                  title: "선택지",
                  dataIndex: "choice",
                  key: "choice",
                },
              ]}
              pagination={false}
              rowKey="key"
              rowSelection={{
                type: "radio", // ✅ Radio 선택을 rowSelection에서 처리
                selectedRowKeys: selectedAnswer ? [selectedAnswer] : [],
                onSelect: (record) => setSelectedAnswer(record.key),
              }}
              rowClassName={(record) =>
                selectedAnswer === record.key ? "selected-row" : ""
              }
              // ✅ Row 전체를 클릭하면 선택되도록 설정
              onRow={(record) => ({
                onClick: () => setSelectedAnswer(record.key),
                style: { cursor: "pointer" },
              })}
            />
          </Card>
        </Splitter.Panel>
      </Splitter>

      {/* ✅ 선택된 행 강조 스타일 추가 */}
      <style>
        {`
          .selected-row {
            background-color: #e6f7ff !important; /* ✅ 선택된 행을 밝은 파란색으로 강조 */
          }
        `}
      </style>
    </>
  );
};

export default MultipleChoiceProblem;
