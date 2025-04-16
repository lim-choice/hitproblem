import { useEffect, useState } from "react";
import { Alert, Card, Table, Tag } from "antd";
import axios from "axios";
import AppLayout from "../components/common/AppLayout";
import { useParams } from "react-router-dom";

interface ExamStats {
  title: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  details: {
    questionNumber: number;
    isCorrect: boolean;
  }[];
}

const TestStatistics = () => {
  const [stats, setStats] = useState<ExamStats | null>(null);
  const { examSessionId } = useParams<{ examSessionId: string }>();
  const [serverError, setServerError] = useState(false);

  useEffect(() => {
    const fetchExamStats = async () => {
      try {
        const response = await axios.get(
          `/api/examStatistics/${examSessionId}`
        );
        if (response.data) {
          setStats(response.data);
        }
      } catch (error) {
        console.error("시험 통계 데이터를 불러오는 중 오류 발생:", error);
      }
    };

    if (examSessionId) {
      fetchExamStats();
    }
  }, [examSessionId]);

  return (
    <AppLayout title="테스트">
      {serverError && (
        <Alert
          message="서버 오류"
          description="서버가 연결되지 않았습니다. 관리자에게 문의하세요."
          type="error"
          showIcon
          style={{ marginBottom: "16px" }}
        />
      )}

      <div
        style={{
          width: "80%",
          background: "#fff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
          margin: "auto",
        }}
      >
        {/* 시험 요약 카드 */}
        <Card title="📊 시험 결과 요약" bordered>
          <p>
            <strong>시험 제목:</strong> {stats?.title ?? ""}
          </p>
          <p>
            <strong>총 문제 수:</strong> {stats?.totalQuestions ?? 0}개
          </p>
          <p>
            <strong>맞힌 문제 수:</strong> {stats?.correctAnswers ?? 0}개
          </p>
          <p>
            <strong>점수:</strong> {stats?.score ?? 0}점
          </p>
        </Card>

        {/* 문제별 정오표 테이블 */}
        <Table
          dataSource={stats?.details}
          columns={[
            {
              title: "문제 번호",
              dataIndex: "questionNumber",
              key: "questionNumber",
              align: "center",
            },
            {
              title: "정답 여부",
              dataIndex: "isCorrect",
              key: "isCorrect",
              align: "center",
              render: (isCorrect: boolean) => (
                <Tag color={isCorrect ? "green" : "red"}>
                  {isCorrect ? "✔️ 정답" : "❌ 오답"}
                </Tag>
              ),
            },
          ]}
          pagination={false}
          rowKey="questionNumber"
          style={{ marginTop: 20 }}
        />
      </div>
    </AppLayout>
  );
};

export default TestStatistics;
