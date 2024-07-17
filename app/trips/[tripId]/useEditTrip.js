import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addLocationToTrip } from '@/app/_lib/actions';
import toast from 'react-hot-toast';

export function useEditTrip() {
  const queryClient = useQueryClient();

  const { mutate: editTrip, isLoading: isEditing } = useMutation({
    mutationFn: (data) => addLocationToTrip(data),
    onSuccess: () => {
      // Invalidate all queries with 'trip' in the query key
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey.some(
            (key) => typeof key === 'string' && key.includes('trip'),
          ),
      });
      toast.success('Location added to the trip!');
    },
    onError: (error) => toast.error(error.message),
  });

  return { isEditing, editTrip };
}
