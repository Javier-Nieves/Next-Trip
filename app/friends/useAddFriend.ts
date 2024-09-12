import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { addFriend as addFriendApi } from '@/app/_lib/actions';

export function useAddFriend() {
  const queryClient = useQueryClient();
  // <ReturnType, ErrorType, VariablesType, ContextType>
  const { mutate: addFriend, isPending } = useMutation<void, Error, string>({
    mutationFn: addFriendApi,
    onSuccess: () => {
      toast('New friend is added!', {
        icon: '🎒',
      });
      // invalidating active queries:
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.state.fetchStatus === 'fetching' ||
          query.state.fetchStatus === 'paused',
      });
    },
    onError: () => toast.error("Couldn't add friend"),
  });

  return { addFriend, isAdding: isPending };
}
