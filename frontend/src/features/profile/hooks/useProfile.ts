import { useGetMeQuery } from "../../auth/services/authApi";
import { useGetProfileByUserIdQuery } from "../services/profileApi";

export const useProfile = () => {
  const { data: me } = useGetMeQuery();
  const userId = me?.data.id;
  const { data: profile } = useGetProfileByUserIdQuery(userId!, {
    skip: !userId,
  });

  return profile?.data;
};
