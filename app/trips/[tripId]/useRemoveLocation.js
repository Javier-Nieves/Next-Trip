import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { deleteLocationFromTrip } from '@/app/_lib/actions';
import { useEdgeStore } from '@/app/_lib/edgestore';
import { usePathname } from 'next/navigation';

export function useRemoveLocation() {
  const queryClient = useQueryClient();
  const { edgestore } = useEdgeStore();
  const tripId = usePathname().split('/').at(-1);

  const { mutate: removeLocation, isLoading: isEditing } = useMutation({
    mutationFn: (name) => deleteLocationFromTrip(tripId, name),
    onSuccess: async (urlsToDelete) => {
      // delete all images from edgeStore
      try {
        const promiseArray = urlsToDelete.map((url) =>
          edgestore.publicFiles.delete({
            url,
          }),
        );
        await Promise.all(promiseArray);
      } catch (err) {
        console.error(err.message);
      }
      // Invalidate all queries with 'trip' in the query key
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey.some(
            (key) => typeof key === 'string' && key.includes('trip'),
          ),
      });
      toast.success('Location removed from the trip!');
    },
    onError: (error) => toast.error(error.message),
  });

  return { isEditing, removeLocation };
}
