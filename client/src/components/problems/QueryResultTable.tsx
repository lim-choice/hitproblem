import React from "react";
import { Table } from "antd";

type QueryResultTableProps = {
  data: any[];
};

const QueryResultTable: React.FC<QueryResultTableProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>결과가 없습니다.</div>;
  }

  // 첫 번째 행의 키를 기준으로 동적으로 컬럼 생성
  const columns = Object.keys(data[0]).map((key) => ({
    title: key,
    dataIndex: key,
    key: key,
  }));

  return (
    <Table
      dataSource={data}
      columns={columns}
      rowKey={(record) =>
        record.id ?? record.key ?? Math.random().toString(36).substr(2, 9)
      } // ✅ 고유한 값 설정
      pagination={{ pageSize: 5 }}
    />
  );
};

export default QueryResultTable;
