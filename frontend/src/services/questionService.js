import api from "./api";

export const getQuestions = async (params = {}) => {
  const response = await api.get("/questions", {
    params,
  });

  return response.data;
};

export const getQuestionById = async (questionId) => {
  const response = await api.get(
    `/questions/${questionId}`
  );

  return response.data;
};

export const upvoteQuestion = async (questionId) => {
  const response = await api.put(
    `/questions/${questionId}/upvote`
  );

  return response.data;
};

export const downvoteQuestion = async (questionId) => {
  const response = await api.put(
    `/questions/${questionId}/downvote`
  );

  return response.data;
};