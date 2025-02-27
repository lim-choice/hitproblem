const translateSQLError = (error) => {
    const errorMap = {
      "ER_EMPTY_QUERY": "SQL 쿼리가 비어 있습니다.",
      "ER_SYNTAX_ERROR": "SQL 문법 오류가 발생했습니다.",
      "ER_BAD_FIELD_ERROR": "잘못된 컬럼명이 포함되어 있습니다.",
      "ER_PARSE_ERROR": "SQL 구문 분석 오류가 발생했습니다.",
      "ER_NO_SUCH_TABLE": "존재하지 않는 테이블을 조회하려고 했습니다.",
      "ER_DUP_ENTRY": "중복된 데이터가 존재합니다.",
      "ER_ACCESS_DENIED_ERROR": "데이터베이스 접근 권한이 없습니다.",
      "ER_TABLE_EXISTS_ERROR": "이미 존재하는 테이블입니다.",
      "ER_LOCK_WAIT_TIMEOUT": "트랜잭션이 대기 시간 초과로 중단되었습니다.",
      "ER_QUERY_INTERRUPTED": "쿼리가 강제로 중단되었습니다.",
    };
  
    return errorMap[error.code] || `SQL 실행 오류: ${error.sqlMessage || "알 수 없는 오류"}`;
  };
  
  module.exports = translateSQLError;
  