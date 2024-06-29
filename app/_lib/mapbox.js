import mapboxgl from '!mapbox-gl';

export default function mapbox({ lng, lat, zoom, mapContainer }) {
  mapboxgl.accessToken = process.env.MAPBOX_TOKEN;
  console.log('\x1b[36m%s\x1b[0m', 'token', process.env.MAPBOX_TOKEN);
  // mapboxgl.accessToken =
  //   'pk.eyJ1IjoiamF2aWVyLW5pZXZlcyIsImEiOiJjbG5heWppeDUwN2FyMmxwZ2VqZjBxZGdqIn0.jaVtxVlnW5rlkf2jlNVFlg';
  // console.log('\x1b[36m%s\x1b[0m', 'token', process.env.MAPBOX_TOKEN);
  return new mapboxgl.Map({
    container: mapContainer,
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [lng, lat],
    zoom: zoom,
  });
}
