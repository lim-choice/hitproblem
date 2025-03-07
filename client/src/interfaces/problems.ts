export interface TestSheet {
  id: number;
  type: string;
  sub_type: string;
  title: string;
  description: string;
}

export interface Problem {
  index: number;
  problem_id: number;
  test_sheet_id: number;
  problem_type: string;
  title: string;
  difficulty: string;
  content: string;
  choices: string[];
  answer: string; //유저가 입력한 값
}
