import React from "react";
import { Card, Splitter, Tag } from "antd";
import MonacoEditor from "@monaco-editor/react";
import MarkdownViewer from "../common/MarkdownViewer";
import { useProblemStore } from "../../hooks/useProblemStore";

interface CodingProblemProps {
  selectedProblem: {
    id: number;
    title: string;
    content: string;
    difficulty: "쉬움" | "중간" | "어려움" | "Easy" | "Medium" | "Hard";
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

const CodingProblem: React.FC<CodingProblemProps> = ({
  selectedProblem,
  theme,
}) => {
  const { isExecuting, executionResult, executionColor, setUserCode } =
    useProblemStore();

  return (
    <>
      <Splitter
        style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", height: "100%" }}
      >
        <Splitter.Panel
          style={{ boxSizing: "border-box", position: "relative" }}
          min={"10%"}
        >
          <Card
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
            <MarkdownViewer content={selectedProblem?.content ?? ""} />
          </Card>
        </Splitter.Panel>

        <Splitter.Panel
          style={{ boxSizing: "border-box", height: "100%" }}
          min={"20%"}
        >
          <Splitter layout="vertical" style={{ height: "100%" }}>
            <Splitter.Panel style={{ height: "60%" }} min={"20%"}>
              <MonacoEditor
                height="100%"
                width="100%"
                defaultLanguage="sql"
                theme={theme === "dark" ? "vs-dark" : "light"}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
                onChange={(newValue) => setUserCode(newValue || "")}
              />
            </Splitter.Panel>
            <Splitter.Panel style={{ height: "0%" }} min={"20%"}>
              <Card
                title="실행 결과"
                style={{
                  height: "100%",
                  border: `2px solid ${executionColor}`,
                }}
              >
                <div
                  style={{
                    flexGrow: 1,
                    overflowY: "scroll",
                    height: "100%",
                  }}
                >
                  {isExecuting ? (
                    <div style={{ textAlign: "center", color: "#aaa" }}>
                      ⏳ 실행 중...
                    </div>
                  ) : (
                    <div
                      style={{
                        color: executionColor,
                        overflowX: "auto",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <MarkdownViewer content={executionResult ?? ""} />
                    </div>
                  )}
                </div>
              </Card>
            </Splitter.Panel>
          </Splitter>
        </Splitter.Panel>
      </Splitter>
    </>
  );
};

export default CodingProblem;
