import mapboxgl from '!mapbox-gl';
import { createLocation } from './actions';

export default async function mapbox({
  mapContainer,
  locations,
  isEditingSession,
  isHike,
}) {
  // waypoints - array for GeoJson creation => routes
  let waypoints = [];
  // features - array for the map.addSource method, contains Locations data
  let features = [];

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
  if (isEditingSession) map.getCanvas().style.cursor = 'crosshair';
  else map.getCanvas().style.cursor = 'pointer';

  const bounds = new mapboxgl.LngLatBounds();

  map.on('load', async () => {
    // If editing - add form to add locations
    if (isEditingSession) {
      map.on('click', (event) =>
        addMarker({ map, event, features, waypoints, isHike }),
      );
      // map.on('click', (e) => addMarker(map, e, locationPopupHandler, features));
    }

    if (locations.length === 0) return;
    // locations and routes are created on the map via new layers
    // layers use Sourses, which are filled from arrays:
    fillGeoArrays(locations, bounds, waypoints, features);
    createLocationsLayer(map, features);
    populatePopups(map);
    // adding padding to the map
    map.fitBounds(bounds, {
      padding: {
        top: 120,
        bottom: 120,
        left: 120,
        right: 120,
      },
      duration: 3000,
    });
    // getting GeoJSON data for location points
    const routeData = await createGeoJSON({ map, waypoints, isHike });
    drawRoute(map, routeData);
  });

  return { map, bounds };
}

function fillGeoArrays(locations, bounds, waypoints, features) {
  // create an array for future map.addSource method
  // and waypoints array for Routes drawing
  locations.forEach((loc) => {
    waypoints.push(loc.coordinates);
    createFeature(
      {
        name: loc.name,
        address: loc.address,
        description: loc.description,
        coordinates: loc.coordinates,
        images: loc.images,
        id: loc._id,
      },
      features,
    );
    bounds.extend(loc.coordinates);
  });
}

const createFeature = (loc, features) => {
  features.push({
    type: 'Feature',
    properties: {
      description: `
        <div class='location-description'>
          <h3>${loc.name}</h3>
          <h4>${loc.address}</h4>
          <h5>${loc.description}</h5>
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
  });
};

function createLocationsLayer(map, features) {
  // creating or updating layer's source
  if (!map.getSource('locations')) {
    map.addSource('locations', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features,
      },
    });
  } else {
    map.getSource('locations').setData({
      type: 'FeatureCollection',
      features,
    });
  }
  // creating Locations layer
  if (!map.getLayer('locations')) {
    map.addLayer({
      id: 'locations',
      type: 'circle',
      source: 'locations',
      paint: {
        'circle-color': '#000012',
        'circle-radius': 6,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
      },
    });
  }
  // center map on clicked location (with padding to the right)
  map.on('click', 'locations', (e) => {
    // add marker to clicked location
    document.querySelector('.marker') &&
      document.querySelector('.marker').remove();
    const el = document.createElement('div');
    el.className = 'marker';
    new mapboxgl.Marker(el)
      .setLngLat(e.features[0].geometry.coordinates)
      .addTo(map);
    // centering to the location
    map.easeTo({
      center: e.features[0].geometry.coordinates,
      padding: { right: window.innerWidth * 0.5 },
      duration: 1000,
    });
  });
}

function populatePopups(map) {
  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
  });
  map.on('mouseenter', 'locations', (e) => {
    map.getCanvas().style.cursor = 'pointer';
    const coordinates = e.features[0].geometry.coordinates.slice();
    const description = e.features[0].properties.description;
    // Populate the popup and set its coordinates
    popup.setLngLat(coordinates).setHTML(description).addTo(map);
  });
  // hide popup when cursor leaves
  map.on('mouseleave', 'locations', () => {
    map.getCanvas().style.cursor = 'crosshair';
    popup.remove();
  });
  // clicking on the Location
  map.on('click', 'locations', (e) => {
    // todo
    // mapboxViews.displayLocationInfo(e.features[0].properties);
  });
}

async function createGeoJSON({ map, waypoints, isHike }) {
  // 'hike' === less than 100km btw points
  let wayPointsString = '';
  waypoints.forEach((place) => {
    wayPointsString += `lonlat:${place.join(',')}|`;
  });
  wayPointsString = wayPointsString.slice(0, -1);

  const keyData = await fetch('/api/trips');
  const data = await keyData.json();
  const API_KEY = data.geoKey;

  const res = await fetch(
    `https://api.geoapify.com/v1/routing?waypoints=${wayPointsString}&mode=${isHike ? 'hike' : 'drive'}&apiKey=${API_KEY}`,
  );
  const routeData = await res.json();

  // console.log(routeData);
  https: if (!map.getSource('route'))
    map.addSource('route', {
      type: 'geojson',
      data: routeData,
    });
  else map.getSource('route').setData(routeData);
  return routeData;
}

const drawRoute = (map, routeData) => {
  // console.log('drawing route!', routeData);
  if (!routeData) return;
  if (map.getLayer('route-layer')) map.removeLayer('route-layer');

  map.getSource('route').setData(routeData);
  map.addLayer({
    id: 'route-layer',
    type: 'line',
    source: 'route',
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': '#a80202',
      'line-width': 3,
    },
    filter: ['==', '$type', 'LineString'],
  });
  // for Routes layer to be lower than Locations
  map.moveLayer('route-layer', 'locations');
};

const addMarker = ({ map, event, features, waypoints, isHike }) => {
  // add marker and form when map is clicked. Add handler to the form
  // clear all popups opened earlier
  const oldPopups = document.querySelectorAll('.mapboxgl-popup');
  oldPopups.forEach((popup) => popup.remove());

  // create new popup
  const coordinates = event.lngLat;
  const popup = new mapboxgl.Popup({ closeOnClick: false })
    .setLngLat(coordinates)
    .setHTML(markerMarkup)
    .addTo(map);

  // with handler:
  document
    .querySelector('.newLocation__popup-form')
    .addEventListener('submit', (e) => {
      e.preventDefault();
      const coordArray = [popup._lngLat.lng, popup._lngLat.lat];
      const form = createFormData(coordArray);
      popup.remove();
      locationPopupHandler({
        form,
        coordArray,
        map,
        features,
        waypoints,
        isHike,
      });
    });
};

const locationPopupHandler = async ({
  form,
  coordArray,
  map,
  features,
  waypoints,
  isHike,
}) => {
  form.append('isHike', isHike);
  createLocation(form);

  createFeature(
    {
      name: form.get('name'),
      address: form.get('address'),
      description: form.get('description'),
      coordinates: coordArray,
      images: form.get('images'),
    },
    features,
  );
  createLocationsLayer(map, features);
  waypoints.push(coordArray);
  if (waypoints.length > 1) {
    const geoData = await createGeoJSON({ map, waypoints, isHike });
    drawRoute(map, geoData);
  }
};

const markerMarkup = `<form class='newLocation__popup-form'>
                        <input type='text' class='newLocation__popup-name' placeholder='Name'>
                        <input type='text' class='newLocation__popup-address' placeholder='Address'>
                        <input type='text' class='newLocation__popup-desc' placeholder='Description'>
                        <input type='file' class='newLocation__input' accept='image/*' id='images' multiple>
                        <input type='submit' class='newLocation__add-btn' value='Add location'>
                      </form>`;

const createFormData = (coordArray) => {
  const form = new FormData();
  form.append('name', document.querySelector('.newLocation__popup-name').value);
  // prettier-ignore
  form.append('address', document.querySelector('.newLocation__popup-address').value);
  // prettier-ignore
  form.append('description', document.querySelector('.newLocation__popup-desc').value);
  form.append('coordinates', coordArray);
  const images = document.querySelector('#images').files;
  for (let i = 0; i < images.length; i++) form.append('images', images[i]);
  return form;
};

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
