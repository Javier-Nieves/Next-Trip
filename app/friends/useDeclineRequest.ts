import { useMutation, useQueryClient } from '@tanstack/react-query';
import { declineRequest as declineRequestApi } from '@/app/_lib/actions';
import toast from 'react-hot-toast';

export function useDeclineRequest() {
  const queryClient = useQueryClient();
  // prettier-ignore
  const { mutate: declineRequest, isPending } = useMutation<void, Error, string>({
    mutationFn: declineRequestApi,
    onSuccess: () => {
      toast('Friend request denied', {
        icon: '🔥',
      });
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.state.fetchStatus === 'fetching' ||
          query.state.fetchStatus === 'paused',
      });
    },
    onError: () => toast.error("Couldn't process action"),
  });

  return { declineRequest, isDeclining: isPending };
}
