'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import mapboxgl from '!mapbox-gl';
// prettier-ignore
import { centeredMap, createFeature, createGeoJSON, 
            markerMarkup, createFormData, locationPopupHandler } from '@/app/_lib/mapbox';
import { useEdgeStore } from '@/app/_lib/edgestore';
import Spinner from '@/app/_components/Spinner';
import TripDescription from '@/app/_components/TripDescription';
import PhotoLink from '@/app/_components/PhotoLink';

import 'mapbox-gl/dist/mapbox-gl.css';

export default function Page({ params }) {
  // todo - useReducer
  const { edgestore } = useEdgeStore();
  const [mapIsLoading, setMapIsLoading] = useState(false);
  const [trip, setTrip] = useState({});
  const [isEditingSession, setIsEditingSession] = useState(false);
  const [regenerateMap, setRegenerateMap] = useState(false);
  const [locationInfo, setLocationInfo] = useState(null);
  const [isHike, setIsHike] = useState(false);

  const [locations, setLocations] = useState([]);
  // waypoints - array for GeoJson creation => routes
  const [waypoints, setWaypoints] = useState([]);
  // features - array for the map.addSource method, contains Locations data
  const [features, setFeatures] = useState([]);

  const mapContainer = useRef(null);
  const map = useRef(null);
  const isMyTrip = useRef(null);

  // 0) get trip info & display map
  useEffect(
    function () {
      async function displayMap() {
        if (mapIsLoading) return;
        // get trip info
        const res = await fetch(`/api/trips/${params.tripId}`);
        const data = await res.json();
        setTrip(data.data.trip);
        setIsHike(() => data.data.trip.isHike);
        isMyTrip.current = data.data.isMyTrip;
        setLocations(data.data.trip.locations);
        // map container should be empty to render a new map (with editing)
        if (map.current && !regenerateMap) return;
        if (regenerateMap) {
          // when editing session if over => regenerate map without click handler
          mapContainer.current.innerHTML = '';
          setRegenerateMap(() => false);
        }
        setMapIsLoading(() => true);
        map.current = await centeredMap(mapContainer.current, locations);
        setMapIsLoading(() => false);
      }
      displayMap();
    },
    [isEditingSession],
  );

  // 0.5) convert map to editing if needed
  useEffect(
    function () {
      async function convertToEditing() {
        if (!map.current) return;
        function handleClick(event) {
          // clear all popups opened earlier
          const oldPopups = document.querySelectorAll('.mapboxgl-popup');
          oldPopups.forEach((popup) => popup.remove());
          // add new popup
          const coordinates = event.lngLat;
          const popup = new mapboxgl.Popup({ closeOnClick: false })
            .setLngLat(coordinates)
            .setHTML(markerMarkup)
            .addTo(map.current);
          // add handler to the popup form:
          document
            .querySelector('.newLocation__popup-form')
            .addEventListener('submit', async (e) => {
              e.preventDefault();
              const coordArray = [popup._lngLat.lng, popup._lngLat.lat];
              const form = createFormData(coordArray, isHike);
              popup.remove();
              // upload images, create Location document in the DB:
              locationPopupHandler(form, edgestore);
              // update map on screen
              createFeature({
                name: form.get('name'),
                address: form.get('address'),
                description: form.get('description'),
                coordinates: coordArray,
                images: form.get('images'),
              });
              createLocationsLayer();
              setWaypoints((cur) => [...cur, coordArray]);
              // plot route if there are more then 2 locations in a trip
              if (waypoints.length > 1) {
                const geoData = await createGeoJSON(waypoints, isHike);
                drawRoute(geoData);
              }
            });
        }
        if (isEditingSession) {
          // If editing - add form to create locations
          map.current.on('click', handleClick);
          map.current.getCanvas().style.cursor = 'crosshair';
        }
      }
      convertToEditing();
    },
    [isEditingSession, waypoints, isHike],
  );

  // 1
  useEffect(() => {
    if (locations.length > 0) {
      // locations and routes are created on the map via new layers
      // layers use Sourses, which are filled from arrays:
      fillGeoArrays(locations);
    }
  }, [locations]);
  // 2
  useEffect(() => {
    if (features.length > 0 || !mapIsLoading) {
      createLocationsLayer();
      populatePopups();
    }
  }, [features, mapIsLoading]);

  // 3 getting GeoJSON data for location points
  useEffect(
    function () {
      async function plotPath() {
        // if (!map.current) return;
        if (!waypoints.length) return;
        const routeData = await createGeoJSON(waypoints, isHike);

        if (!map.current?.getSource('route'))
          map.current?.addSource('route', {
            type: 'geojson',
            data: routeData,
          });
        else map.current?.getSource('route').setData(routeData);
        drawRoute(routeData);
      }
      plotPath();
    },
    [waypoints, isHike],
  );

  function fillGeoArrays(locations) {
    const bounds = new mapboxgl.LngLatBounds();
    // create an array for future map.addSource method
    // and waypoints array for Routes drawing
    let newWaypoints = [];
    let newFeatures = [];
    locations.forEach((loc) => {
      const newFeature = createFeature({
        name: loc.name,
        address: loc.address,
        description: loc.description,
        coordinates: loc.coordinates,
        images: loc.images,
        id: loc._id,
      });
      newFeatures.push(newFeature);
      newWaypoints.push(loc.coordinates);
      // showing all locations + adding padding to the map
      bounds.extend(loc.coordinates);
      map.current?.fitBounds(bounds, {
        padding: {
          top: 120,
          bottom: 120,
          left: 120,
          right: 120,
        },
        duration: 3000,
      });
    });
    setWaypoints(() => [...newWaypoints]);
    setFeatures(() => [...newFeatures]);
  }

  function createLocationsLayer() {
    map.current?.on('load', () => {
      // creating or updating layer's source
      if (!map.current.getSource('locations')) {
        map.current.addSource('locations', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features,
          },
        });
      } else {
        map.current.getSource('locations').setData({
          type: 'FeatureCollection',
          features,
        });
      }
      // creating Locations layer
      if (!map.current.getLayer('locations')) {
        map.current.addLayer({
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
      // center map.current on clicked location (with padding to the right)
      map.current.on('click', 'locations', (e) => {
        map.current.easeTo({
          center: e.features[0].geometry.coordinates,
          padding: { right: window.innerWidth * 0.5 },
          duration: 1000,
        });
      });
    });
  }

  function populatePopups() {
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });
    map.current?.on('mouseenter', 'locations', (e) => {
      map.current.getCanvas().style.cursor = 'pointer';
      const coordinates = e.features[0].geometry.coordinates.slice();
      const description = e.features[0].properties.description;
      // Populate the popup and set its coordinates
      popup.setLngLat(coordinates).setHTML(description).addTo(map.current);
    });
    // hide popup when cursor leaves
    map.current?.on('mouseleave', 'locations', () => {
      map.current.getCanvas().style.cursor = 'crosshair';
      popup.remove();
    });
    // clicking on the Location
    map.current?.on('click', 'locations', (e) => {
      const locationInfo = e.features[0].properties;
      setLocationInfo(() => locationInfo);
    });
  }

  function drawRoute(routeData) {
    if (!routeData) return;
    if (!map.current) return;
    if (map.current.getLayer('route-layer'))
      map.current.removeLayer('route-layer');

    map.current.getSource('route').setData(routeData);
    map.current.addLayer({
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
    if (
      map.current.getLayer('route-layer') &&
      map.current.getLayer('locations')
    )
      map.current.moveLayer('route-layer', 'locations');
  }

  // prettier-ignore
  const { coverImage, date, description, duration, highlight, name, travelers } = trip;
  const formattedDate = date ? format(date, 'dd.MM.yyyy') : '';
  const hasDate = typeof duration === 'number' && !Number.isNaN(+duration);

  return (
    <>
      {(map.current === null || mapIsLoading) && <Spinner />}
      <div className="fixed top-0 left-0 w-screen h-screen">
        {(highlight || description) && !isEditingSession && (
          <TripDescription highlight={highlight} description={description} />
        )}

        <div className="absolute z-50 right-5 md:right-[20px] lg:right-[100px] top-6 flex flex-col     gap-2 items-end">
          <div className="text-4xl font-semibold">{name}</div>
          {hasDate && (
            <div className="text-xl font-normal">
              {formattedDate}, {duration} {duration > 1 ? 'days' : 'day'}
            </div>
          )}

          {travelers?.length && (
            <div className="flex gap-2">
              {travelers.map((traveler) => (
                <PhotoLink user={traveler} key={traveler._id} />
              ))}
            </div>
          )}

          {isMyTrip.current && (
            <button
              onClick={() => {
                isEditingSession && setRegenerateMap(() => true);
                setIsEditingSession((cur) => !cur);
              }}
              className={`${isEditingSession ? 'bg-[var(--color-accent-base)] hover:bg-[var(--color-accent-dark)]' : 'bg-[var(--color-light-yellow)] hover:bg-[var(--color-yellow)]'} p-2 mt-2 rounded-md text-lg`}
            >
              {isEditingSession ? 'Back to trip' : 'Edit locations'}
            </button>
          )}

          {isMyTrip.current && isEditingSession && (
            <div className="flex items-center mt-2 space-x-2">
              <span
                className={`text-xl font-medium ${isHike ? 'text-black' : 'text-gray-500'}`}
              >
                Hike
              </span>
              <div
                className={`relative inline-flex items-center h-6 w-12 rounded-full transition-colors duration-300 ${isHike ? 'bg-[var(--color-accent-base)]' : 'bg-[var(--color-yellow)]'}`}
                onClick={() => setIsHike((cur) => !cur)}
              >
                <span
                  className={`absolute left-1 inline-block h-4 w-4 bg-black rounded-full transform transition-transform duration-300 ${isHike ? 'translate-x-0' : 'translate-x-6'}`}
                ></span>
              </div>
              <span
                className={`text-xl font-medium ${isHike ? 'text-gray-500' : 'text-black'}`}
              >
                Drive
              </span>
            </div>
          )}
        </div>

        {/* {locationInfoOpen && <LocationInfo location={locationInfo}/>} */}
        <div ref={mapContainer} className="z-30 w-full h-full" />
      </div>
    </>
  );
}
