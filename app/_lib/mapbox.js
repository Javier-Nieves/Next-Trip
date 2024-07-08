import mapboxgl from '!mapbox-gl';
import { createLocation } from './actions';

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
  // if (isEditingSession) map.getCanvas().style.cursor = 'crosshair';
  // else map.getCanvas().style.cursor = 'pointer';
  map.getCanvas().style.cursor = 'pointer';

  return map;
}

export const createFeature = (loc) => {
  return {
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
  };
};

export async function createGeoJSON(waypoints, isHike) {
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
  return routeData;
}

export async function locationPopupHandler(form, edgestore) {
  if (form.has('images')) {
    const file = form.get('images');
    // uploading picture to EdgeStore
    // todo - upload multiple files. Limit size to 2 Mb
    const res = await edgestore.publicFiles.upload({
      file,
      // onProgressChange: (progress) => setProgress(progress),
    });
    form.append('imageUrl', res.url);
  }
  createLocation(form);
}

export const markerMarkup = `<form class='newLocation__popup-form'>
                        <input type='text' class='newLocation__popup-name' placeholder='Name' required />
                        <input type='text' class='newLocation__popup-address' placeholder='Address' />
                        <input type='text' class='newLocation__popup-desc' placeholder='Description' />
                        <input type='file' class='newLocation__input' accept='image/*' id='images' multiple />
                        <input type='submit' class='newLocation__add-btn' value='Add location' />
                      </form>`;

export const createFormData = (coordArray, isHike = false) => {
  const form = new FormData();
  form.append('name', document.querySelector('.newLocation__popup-name').value);
  // prettier-ignore
  form.append('address', document.querySelector('.newLocation__popup-address').value);
  // prettier-ignore
  form.append('description', document.querySelector('.newLocation__popup-desc').value);
  form.append('coordinates', coordArray);
  form.append('isHike', isHike);
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
