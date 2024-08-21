import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { deleteFriend as deleteFriendApi } from '@/app/_lib/actions';

export function useDeleteFriend() {
  const queryClient = useQueryClient();
  const { mutate: deleteFriend, isLoading } = useMutation({
    mutationFn: deleteFriendApi,
    onSuccess: () => {
      toast('Friend is deleted!', {
        icon: '😵‍💫',
      });
      queryClient.invalidateQueries({
        active: true,
      });
    },
    onError: () => toast.error("Couldn't delete friend"),
  });

  return { deleteFriend, isLoading };
}
