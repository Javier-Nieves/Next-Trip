import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { deleteFriend as deleteFriendApi } from '@/app/_lib/actions';

export function useDeleteFriend() {
  const queryClient = useQueryClient();
  const { mutate: deleteFriend, isPending } = useMutation<void, Error, string>({
    mutationFn: deleteFriendApi,
    onSuccess: () => {
      toast('Friend is deleted!', {
        icon: '😵‍💫',
      });
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.state.fetchStatus === 'fetching' ||
          query.state.fetchStatus === 'paused',
      });
    },
    onError: () => toast.error("Couldn't delete friend"),
  });

  return { deleteFriend, isDeleting: isPending };
}
