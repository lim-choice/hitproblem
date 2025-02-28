export const jsonToMarkdown = (data: any): string => {
  if (!data) return "데이터가 없습니다.";

  let markdown = "";

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return "**데이터가 없습니다.**\n\n";
    }

    // 배열의 첫 번째 항목을 기준으로 테이블 헤더 생성
    const keys = Object.keys(data[0]);
    markdown += `| ${keys.join(" | ")} |\n`;
    markdown += `| ${keys.map(() => "---").join(" | ")} |\n`;

    // 데이터 삽입
    data.forEach((item) => {
      markdown += `| ${keys.map((key) => String(item[key] ?? "")).join(" | ")} |\n`;
    });
    markdown += `\n`;
  } else if (typeof data === "object") {
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        markdown += `### ${key}\n\n`; // 배열이면 섹션 추가
        markdown += jsonToMarkdown(value);
      } else if (typeof value === "object") {
        markdown += `### ${key}\n\n`; // 객체이면 섹션 추가
        markdown += jsonToMarkdown([value]); // 객체를 배열로 변환하여 표로 변환
      } else {
        markdown += `**${key}:** ${value}\n\n`; // 기본 key-value 형식
      }
    });
  } else {
    markdown += `**값:** ${String(data)}\n\n`;
  }

  return markdown;
};
