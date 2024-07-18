import { useQuery } from '@tanstack/react-query';
import { centeredMap } from '@/app/_lib/mapbox';

export async function useMap(mapContainer, locations) {
  const { data: map, isLoading } = useQuery({
    queryKey: ['map', locations?.at(0)?.coordinates?.at(0)],
    queryFn: () => centeredMap(mapContainer, locations),
    // staleTime: 0,
    enabled: Boolean(locations),
  });
  // console.log('hook map', map);
  return { map, mapIsLoading: isLoading };
}
