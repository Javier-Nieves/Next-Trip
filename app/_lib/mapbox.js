import mapboxgl from '!mapbox-gl';

export async function centeredMap(mapContainer, locations) {
  // center map to trip locations of user's location
  let center = [];
  if (!locations.length) center = await handleGetLocation();
  else center = [locations[0].coordinates[0], locations[0].coordinates[1]];

  // PUBLIC ACCESS TOKEN:
  mapboxgl.accessToken =
    'pk.eyJ1IjoiamF2aWVyLW5pZXZlcyIsImEiOiJjbG5heWppeDUwN2FyMmxwZ2VqZjBxZGdqIn0.jaVtxVlnW5rlkf2jlNVFlg';

  //! creating Map object
  const map = new mapboxgl.Map({
    container: mapContainer,
    style: 'mapbox://styles/mapbox/streets-v12',
    center,
    zoom: 9,
  });
  // adding scale control
  map.addControl(new mapboxgl.ScaleControl());
  // adding zoom buttons
  const zoomPanel = new mapboxgl.NavigationControl({ showCompass: false });
  map.addControl(zoomPanel, 'bottom-left');
  // change cursor
  map.getCanvas().style.cursor = 'pointer';

  return map;
}

export const createFeature = (loc) => {
  let photosText = '';
  if (loc.images.length === 1) photosText = '1 photo';
  if (loc.images.length > 1) photosText = `${loc.images.length} photos`;
  return {
    type: 'Feature',
    properties: {
      description: `
        <div class='location-description'>
          <h2>${loc.name}</h2>
          <h3>${photosText}</h3>
        </div>
        `,
      name: loc.name,
      address: loc.address,
      desc: loc.description,
      coordinates: loc.coordinates,
      images: loc.images,
      id: loc.id,
    },
    geometry: {
      type: 'Point',
      coordinates: loc.coordinates,
    },
  };
};

export async function createGeoJSON(waypoints, isHike) {
  // console.log('\x1b[36m%s\x1b[0m', 'waypoints, isHike', waypoints, isHike);
  // 'hike' === less than 100km btw points
  let wayPointsString = '';
  waypoints.forEach((place) => {
    place && (wayPointsString += `lonlat:${place.join(',')}|`);
  });
  wayPointsString = wayPointsString.slice(0, -1);

  const keyData = await fetch('/api/trips');
  const data = await keyData.json();
  const API_KEY = data.geoKey;
  // console.log('hiking? ', isHike);
  const res = await fetch(
    `https://api.geoapify.com/v1/routing?waypoints=${wayPointsString}&mode=${isHike ? 'hike' : 'drive'}&apiKey=${API_KEY}`,
  );
  const routeData = await res.json();
  return routeData;
}

function handleGetLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve([position.coords.longitude, position.coords.latitude]);
        },
        (error) => {
          console.error(error);
          // random coordinates in case user doesn't allow geolocation
          resolve([2.35, 43.225]);
        },
      );
    } else {
      reject('Geolocation is not supported by this browser.');
    }
  });
}
