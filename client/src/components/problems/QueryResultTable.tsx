import { Table } from "antd";

type QueryResultTableProps<T extends Record<string, unknown>> = {
  data: T[];
};

const QueryResultTable = <T extends Record<string, unknown>>({
  data,
}: QueryResultTableProps<T>) => {
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
      rowKey={
        (record, index) =>
          (record.id as string) ?? (record.key as string) ?? `row-${index}` // ✅ id, key가 없으면 인덱스를 사용
      }
      pagination={{ pageSize: 5 }}
    />
  );
};

export default QueryResultTable;
