import { useQuery } from '@tanstack/react-query';

export function useFriends() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      const res = await fetch(`/api/friends`);
      const data = await res.json();
      return data.data.user;
    },
  });

  return { user, isLoading };
}
