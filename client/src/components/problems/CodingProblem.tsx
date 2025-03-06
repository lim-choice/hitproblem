import React, { useRef, useState } from "react";
import { Card, Splitter, message, Tag } from "antd";
import MonacoEditor, { OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { executeUserQuery } from "../../api/executionApi";
import { jsonToMarkdown } from "../../hooks/useMarkdown";
import MarkdownViewer from "../common/MarkdownViewer";

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
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<
    object | string | null
  >(null);
  const [executionColor, setExecutionColor] = useState("#ccc");
  const [api, contextHolder] = message.useMessage();

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  return (
    <>
      {contextHolder}
      <Splitter
        style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", height: "100%" }}
      >
        <Splitter.Panel
          style={{ boxSizing: "border-box", position: "relative" }}
          min={"20%"}
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
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              background: theme === "dark" ? "#222" : "#fff",
              color: theme === "dark" ? "#ddd" : "#000",
            }}
            headStyle={{
              backgroundColor: theme === "dark" ? "#333" : "#f5f5f5",
              fontSize: "16px",
              padding: "12px",
              color: theme === "dark" ? "#ddd" : "#000",
            }}
          >
            <MarkdownViewer content={selectedProblem?.content ?? ""} />
          </Card>
        </Splitter.Panel>

        <Splitter.Panel
          style={{ boxSizing: "border-box", height: "100%" }}
          min={"20%"}
        >
          <Splitter layout="vertical" style={{ height: "100%" }}>
            <Splitter.Panel
              style={{
                display: "flex",
                flexDirection: "column",
                height: "60%",
              }}
              min={"20%"}
            >
              <MonacoEditor
                height="100%"
                width="100%"
                defaultLanguage="sql"
                theme={theme === "dark" ? "vs-dark" : "light"}
                value={"SELECT * FROM users;"}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
                onMount={handleEditorMount}
              />
            </Splitter.Panel>

            <Splitter.Panel style={{ height: "40%" }} min={"20%"}>
              <Card
                title="실행 결과"
                style={{
                  height: "100%",
                  background: theme === "dark" ? "#222" : "#fff",
                  color: theme === "dark" ? "#ddd" : "#000",
                  border: `2px solid ${executionColor}`,
                }}
                headStyle={{
                  backgroundColor: theme === "dark" ? "#333" : "#f5f5f5",
                  fontSize: "16px",
                  padding: "12px",
                  color: theme === "dark" ? "#ddd" : "#000",
                }}
              >
                <div
                  style={{
                    flexGrow: 1,
                    overflowY: "scroll",
                    maxHeight: "65%",
                    minHeight: "0px",
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
