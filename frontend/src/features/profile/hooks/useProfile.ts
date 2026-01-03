import { useGetMeQuery } from "../../auth/services/authApi";
import { useGetMyProfileQuery, useGetProfileByUserIdQuery } from "../services/profileApi";

export const useProfile = () => {

  const { data: profile } = useGetMyProfileQuery();

  return profile?.data;
};
