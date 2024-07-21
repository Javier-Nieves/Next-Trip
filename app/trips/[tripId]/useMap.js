import { useQuery } from '@tanstack/react-query';
import { centeredMap } from '@/app/_lib/mapbox';

export async function useMap(mapContainer, trip) {
  const { data: map, isLoading } = useQuery({
    queryKey: ['map', trip?.name],
    queryFn: () => centeredMap(mapContainer, trip?.locations),
    // staleTime: 0,
    enabled: Boolean(trip?.locations && mapContainer?.innerHTML === ''),
  });
  // console.log('hook map', map);
  return { map, mapIsLoading: isLoading };
}
