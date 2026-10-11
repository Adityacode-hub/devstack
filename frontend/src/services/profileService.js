import api from "./api";

export const getMyProfile = async () => {
  const response = await api.get("/profile/me");
  return response.data;
};

export const updateMyProfile = async (profileData) => {
  const response = await api.put("/profile/me", profileData);
  return response.data;
};