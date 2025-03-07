import React, { useState, useEffect } from "react";
import { Card, Splitter, Table, Tag } from "antd";
import MarkdownViewer from "../common/MarkdownViewer";
import { Problem } from "../../interfaces/problems";

interface MultipleChoiceProblemProps {
  selectedProblem: Problem;
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
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(
    selectedProblem?.answer || null
  );

  const selectAnswer = (key: string) => {
    setSelectedAnswer(key);
    selectedProblem.answer = key; // ✅ 선택된 답안을 문제 객체에 반영
  };

  useEffect(() => {
    if (selectedAnswer !== selectedProblem?.answer) {
      setSelectedAnswer(selectedProblem?.answer);
    }
  }, [selectedProblem, selectedAnswer]);

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
          <div style={{ height: "100%" }}>
            <MarkdownViewer
              content={`### ${selectedProblem?.title}  ${selectedProblem?.content ?? ""}`}
            />
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
              key: `${index + 1}`,
              number: index + 1,
              choice: `${index + 1}. ${choice}`,
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
              type: "radio",
              selectedRowKeys: selectedAnswer ? [selectedAnswer] : [],
              onSelect: (record) => selectAnswer(record.key),
            }}
            rowClassName={(record) =>
              selectedAnswer === record.key ? "selected-row" : ""
            }
            onRow={(record) => ({
              onClick: () => selectAnswer(record.key),
              style: { cursor: "pointer" },
            })}
          />
        </Card>
      </Splitter.Panel>
    </Splitter>
  );
};

export default MultipleChoiceProblem;
