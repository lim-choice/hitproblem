import React, { useEffect } from "react";
import { Card, Splitter, Tag } from "antd";
import MonacoEditor from "@monaco-editor/react";
import MarkdownViewer from "../common/MarkdownViewer";
import { useProblemStore } from "../../hooks/useProblemStore";
import { useThemeStore } from "../../hooks/useThemeStore";
import { Problem } from "../../interfaces/problems";
import { difficultyColors } from "../../utils/constatns";

interface CodingProblemProps {
  selectedProblem: Problem;
}

const CodingProblem: React.FC<CodingProblemProps> = ({ selectedProblem }) => {
  const {
    isExecuting,
    executionResult,
    executionColor,
    userCode,
    setUserCode,
  } = useProblemStore();
  const { theme } = useThemeStore();

  return (
    <>
      <Splitter
        style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", height: "100%" }}
      >
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
            <div
              style={{
                height: "100%",
              }}
            >
              <MarkdownViewer content={selectedProblem?.content ?? ""} />
            </div>
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
                value={userCode}
                onChange={(newValue) => setUserCode(newValue || "")}
              />
            </Splitter.Panel>
            <Splitter.Panel style={{ height: "100%" }} min={"20%"}>
              <Card
                title="실행 결과"
                style={{
                  height: "100%",
                  border: `2px solid ${executionColor}`,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    flexGrow: 1,
                    overflowY: "auto",
                    height: "90%",
                    padding: "5px",
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
                      <MarkdownViewer
                        content={
                          typeof executionResult === "string"
                            ? executionResult
                            : JSON.stringify(executionResult ?? "")
                        }
                      />
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
