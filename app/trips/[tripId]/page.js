'use client';
import { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import mapboxgl from '!mapbox-gl';
import { centeredMap, createFeature, createGeoJSON } from '@/app/_lib/mapbox';
import Spinner from '@/app/_components/Spinner';
import TripDescription from '@/app/_components/TripDescription';
import LocationInfo from '@/app/_components/LocationInfo';
import PhotoLink from '@/app/_components/PhotoLink';
import TripTitle from '../../_components/TripTitle';
import AddLocationsButton from '../../_components/AddLocationsButton';
import IsHikeToggle from '../../_components/IsHikeToggle';
import NewLocationForm from '../../_components/NewLocationForm';

import 'mapbox-gl/dist/mapbox-gl.css';

export default function Page({ params }) {
  // todo - useReducer
  const [mapIsLoading, setMapIsLoading] = useState(false);
  const [trip, setTrip] = useState({});
  const [isEditingSession, setIsEditingSession] = useState(false);
  const [regenerateMap, setRegenerateMap] = useState(false);
  const [newLocationCoordinates, setNewLocationCoordinates] = useState([]);
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
        // console.log('\x1b[36m%s\x1b[0m', '0');
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

  // 1) convert map to editing if needed
  useEffect(
    function () {
      async function convertToEditing() {
        // console.log('\x1b[36m%s\x1b[0m', '1');
        if (!map.current) return;
        function handleClick(event) {
          // remove previous marker
          document.querySelector('.mapboxgl-marker')?.remove();
          // add marker to the click coordinates
          const coordinates = event.lngLat;
          const marker = new mapboxgl.Marker()
            .setLngLat(coordinates)
            // .setHTML(markerMarkup)
            .addTo(map.current);
          // move map to marker's location
          map.current.easeTo({
            center: coordinates,
            padding: { left: window.innerWidth * 0.5 },
            duration: 1000,
          });
          setNewLocationCoordinates([+coordinates.lng, +coordinates.lat]);
        }
        if (isEditingSession) {
          // If editing - add form to create locations
          map.current.on('click', handleClick);
          map.current.getCanvas().style.cursor = 'crosshair';
        }
      }
      convertToEditing();
    },
    [isEditingSession, isHike],
  );

  // 2)
  useEffect(() => {
    if (locations.length > 0) {
      // console.log('\x1b[36m%s\x1b[0m', '2 arrays');
      // locations and routes are created on the map via new layers
      // layers use Sourses, which are filled from arrays:
      const bounds = new mapboxgl.LngLatBounds();
      fillGeoArrays(locations, bounds);
      // adding padding to the map
      !isEditingSession &&
        map.current?.fitBounds(bounds, {
          padding: {
            top: 120,
            bottom: 120,
            left: 120,
            right: 120,
          },
          duration: 3000,
        });
    }
  }, [locations]);

  // 3)
  useEffect(() => {
    // console.log('\x1b[36m%s\x1b[0m', '3 layer');
    if (features.length > 0) {
      createLocationsLayer();
      populatePopups();
    }
  }, [features, mapIsLoading]);

  // 4) getting GeoJSON data for location points
  useEffect(
    function () {
      async function plotPath() {
        // console.log('\x1b[36m%s\x1b[0m', '4');
        // remove marker from map
        document.querySelector('.mapboxgl-marker')?.remove();
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

  function fillGeoArrays(locations, bounds) {
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
      // extend map's bounds to include location
      bounds.extend(loc.coordinates);
    });
    setWaypoints(() => [...newWaypoints]);
    setFeatures(() => [...newFeatures]);
  }

  function createLocationsLayer() {
    // updating layer's source if new feature is added
    if (map.current?.getSource('locations'))
      map.current.getSource('locations').setData({
        type: 'FeatureCollection',
        features,
      });

    map.current?.on('load', () => {
      // creating source for the Locations layer
      if (map.current?.getSource('locations'))
        map.current.getSource('locations').setData({
          type: 'FeatureCollection',
          features,
        });
      else
        map.current.addSource('locations', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features,
          },
        });
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
  const { description, highlight, travelers } = trip;

  return (
    <>
      {(map.current === null || mapIsLoading) && <Spinner />}

      <div className="fixed top-0 left-0 w-screen h-screen">
        {/* trip details */}
        {!isEditingSession && (highlight || description) && (
          <TripDescription highlight={highlight} description={description} />
        )}
        {/* add location form */}
        {isEditingSession && Boolean(newLocationCoordinates.length) && (
          <NewLocationForm
            setNewLocationCoordinates={setNewLocationCoordinates}
            coordinates={newLocationCoordinates}
            isHike={isHike}
            setLocations={setLocations}
          />
        )}

        <div className="absolute z-50 right-5 md:right-[20px] lg:right-[100px] top-6 flex flex-col     gap-2 items-end">
          <TripTitle trip={trip} />

          {travelers?.length && (
            <div className="flex gap-2">
              {travelers.map((traveler) => (
                <PhotoLink user={traveler} key={traveler._id} />
              ))}
            </div>
          )}

          {isMyTrip.current && (
            <AddLocationsButton
              isEditingSession={isEditingSession}
              setRegenerateMap={setRegenerateMap}
              setIsEditingSession={setIsEditingSession}
              setLocationInfo={setLocationInfo}
            />
          )}

          {isMyTrip.current && isEditingSession && (
            <IsHikeToggle isHike={isHike} setIsHike={setIsHike} />
          )}
        </div>

        {locationInfo && (
          <LocationInfo
            location={locationInfo}
            setLocationInfo={setLocationInfo}
          />
        )}
        <div ref={mapContainer} className="z-30 w-full h-full" />
      </div>
    </>
  );
}
