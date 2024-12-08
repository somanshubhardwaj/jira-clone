import { useParams } from "next/navigation";
export const useInvite = () => {
  const params = useParams();
  return params.inviteCode as string;
};
