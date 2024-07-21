import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { navigate, deleteTrip as deleteTripAPI } from '@/app/_lib/actions';
import { useEdgeStore } from '@/app/_lib/edgestore';

export function useDeleteTrip() {
  const client = useQueryClient();
  const { edgestore } = useEdgeStore();

  const { mutate: deleteTrip, isLoading: isDeleting } = useMutation({
    mutationFn: () => deleteTripAPI(),
    onSuccess: async (imagesToDelete) => {
      const promiseArray = imagesToDelete.map((url) =>
        edgestore.publicFiles.delete({
          url,
        }),
      );
      await Promise.all(promiseArray);

      toast.success('🌆 Trip succesfully deleted');
      navigate('/');
    },
    onError: (error) => {
      console.error('deletion: ', error.message);
      toast.error('Could not delete trip', error.message);
    },
  });

  return { deleteTrip, isDeleting };
}
