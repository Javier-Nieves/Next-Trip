import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addLocationToTrip } from '@/app/_lib/actions';

export function useEditTrip() {
  const queryClient = useQueryClient();

  const { mutate: editTrip, isLoading: isEditing } = useMutation({
    mutationFn: (data) => addLocationToTrip(data),
    onSuccess: () => {
      // console.log('\x1b[33m%s\x1b[0m', 'trip is modified!!');
      // Invalidate all queries with 'trip' in the query key
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey.some((key) => key.includes('trip')),
      });
    },
    onError: (error) => console.error(error.message),
  });

  return { isEditing, editTrip };
}
