import api from "./api";

export const getAnswers = async (questionId) => {
  const response = await api.get(
    `/answers/${questionId}`
  );

  return response.data;
};

export const createAnswer = async (
  questionId,
  content
) => {
  const response = await api.post(
    `/answers/${questionId}`,
    {
      content,
    }
  );

  return response.data;
};

export const updateAnswer = async (
  answerId,
  content
) => {
  const response = await api.put(
    `/answers/${answerId}`,
    {
      content,
    }
  );

  return response.data;
};

export const deleteAnswer = async (answerId) => {
  const response = await api.delete(
    `/answers/${answerId}`
  );

  return response.data;
};

export const acceptAnswer = async (answerId) => {
  const response = await api.put(
    `/answers/${answerId}/accept`
  );

  return response.data;
};

export const upvoteAnswer = async (answerId) => {
  const response = await api.put(
    `/answers/${answerId}/upvote`
  );

  return response.data;
};

export const downvoteAnswer = async (answerId) => {
  const response = await api.put(
    `/answers/${answerId}/downvote`
  );

  return response.data;
};

