import { useMutation, useQueryClient } from '@tanstack/react-query';
import { declineRequest as declineRequestApi } from '@/app/_lib/actions';
import toast from 'react-hot-toast';

export function useDeclineRequest() {
  const queryClient = useQueryClient();
  const { mutate: declineRequest, isLoading } = useMutation({
    mutationFn: declineRequestApi,
    onSuccess: () => {
      toast('Friend request denied', {
        icon: '🔥',
      });
      queryClient.invalidateQueries({
        active: true,
      });
    },
    onError: () => toast.error("Couldn't process action"),
  });

  return { declineRequest, isLoading };
}
