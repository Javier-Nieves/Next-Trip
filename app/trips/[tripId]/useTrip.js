'use client';

import { useQuery } from '@tanstack/react-query';

export function useTrip(tripId) {
  const { data: trip, isLoading } = useQuery({
    queryKey: ['trip', tripId],
    queryFn: async () => {
      const res = await fetch(`/api/trips/${tripId}`);
      const data = await res.json();
      return { ...data.data.trip, isMyTrip: data.data.isMyTrip };
    },
  });

  return { trip, isLoading };
}
