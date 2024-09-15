import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { usePathname } from 'next/navigation';
import { addLocationToTrip } from '@/app/_lib/actions';

export function useAddLocation() {
  const queryClient = useQueryClient();
  const tripId = usePathname().split('/').at(-1);

  // prettier-ignore
  const { mutate: addLocation, isPending:isEditing } = useMutation<void, Error, string>({
    mutationFn: (data) => addLocationToTrip(JSON.parse(data), tripId),
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
    onError: (error) => {
      console.error(error.message);
      toast.error(error.message);
    },
  });

  return { addLocation, isEditing };
}