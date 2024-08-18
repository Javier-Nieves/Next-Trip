import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { addFriend as addFriendApi } from '@/app/_lib/actions';

export function useAddFriend() {
  const queryClient = useQueryClient();
  const { mutate: addFriend, isLoading } = useMutation({
    mutationFn: addFriendApi,
    onSuccess: () => {
      toast('New friend is added!', {
        icon: '🎒',
      });
      queryClient.invalidateQueries({
        active: true,
      });
    },
    onError: () => toast.error("Couldn't add friend"),
  });

  return { addFriend, isLoading };
}
