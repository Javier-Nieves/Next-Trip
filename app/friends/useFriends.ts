import { useQuery } from '@tanstack/react-query';
import { UserInfo, TripDocument, UserDocument } from '@/app/_lib/types';

interface ApiResponse {
  status: string;
  data: {
    user: UserDocument;
  };
}
export function useFriends() {
  const { data: user, isLoading } = useQuery<UserDocument, Error>({
    queryKey: ['friends'],
    queryFn: async (): Promise<UserDocument> => {
      const res = await fetch(`/api/friends`);
      const data: ApiResponse = await res.json();
      return data.data.user;
    },
  });

  return { user, isLoading };
}
