import api from "./axiosInstance";

export const executeUserQuery = async (
  problemId: number,
  queryType: string,
  userQuery: string
) => {
  try {
    console.log(
      "[executeUserQuery] problemId: ",
      problemId,
      ", queryType: ",
      queryType,
      ", userQuery: ",
      userQuery
    );
    const response = await api.post(`/execute/${queryType}`, {
      problemId,
      userQuery,
    });
    return response.data;
  } catch (error) {
    console.error("[executeUserQuery] SQL 실행 실패:", error);
    throw error;
  }
};
