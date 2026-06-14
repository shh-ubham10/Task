import api from "../services/api";

export const bulkCreateQuestions = (questions: object[]) =>
  api.post("/questions/bulk", { questions });
export const fetchBulkQuestions = (questionIds: string[]) =>
  api.post("/questions/fetchBulk", { question_ids: questionIds });