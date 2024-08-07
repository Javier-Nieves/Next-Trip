'use client';

import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import mapboxgl from '!mapbox-gl';
import { createFeature, createGeoJSON } from '@/app/_lib/mapbox';
import { useTrip } from './useTrip';
import { useMap } from './useMap';
import Spinner from '@/app/_components/Spinner';
import TripDescription from '@/app/_components/TripDescription';
import LocationInfo from '@/app/_components/LocationInfo';
import PhotoLink from '@/app/_components/PhotoLink';
import TripTitle from '@/app/_components/TripTitle';
import IsHikeToggle from '@/app/_components/IsHikeToggle';
import NewLocationForm from '@/app/_components/NewLocationForm';
import TripActionsMenu from '@/app/_components/TripActionsMenu';

import 'mapbox-gl/dist/mapbox-gl.css';
import AddLocationsButton from '@/app/_components/AddLocationsButton';

export default function Page({ params }) {
  // todo! redux?
  const queryClient = useQueryClient();
  const [isEditingSession, setIsEditingSession] = useState(false);
  const [regenerateMap, setRegenerateMap] = useState(false);
  const [newLocationCoordinates, setNewLocationCoordinates] = useState([]);
  const [locationInfo, setLocationInfo] = useState(null);
  const [isHike, setIsHike] = useState(false);
  const [mapIsCreated, setMapIsCreated] = useState(false);
  // waypoints - array for GeoJson creation => routes
  const waypoints = useRef([]);
  // features - array for the map.addSource method, contains Locations data
  let features = useRef([]);
  const mapContainer = useRef(null);
  const tripMap = useRef(null);

  //! 1) get trip info & display map
  const { trip, isLoading } = useTrip(params.tripId);
  const result = useMap(mapContainer.current, trip);
  // result is a Promise, it should be awaited
  useEffect(() => {
    async function getTripMap() {
      if (!trip || !result) return;
      const { map, mapIsLoading } = await result;
      if (!mapIsLoading && !mapIsCreated) {
        if (trip?.locations.length === 0) setIsEditingSession(true);
        setIsHike(trip?.isHike);
        setMapIsCreated(true);
        tripMap.current = map;
      }
    }
    getTripMap();
  }, [result, trip]);

  // 1.5) change app name to trip name and back
  useEffect(() => {
    if (!trip) return;
    document.querySelector('.mainTitle').innerHTML = trip.name;
    return () => {
      queryClient.removeQueries({
        predicate: () => true,
      });
      const title = document.querySelector('.mainTitle');
      if (title) title.innerHTML = 'See the World';
    };
  }, [trip]);

  //! 2) invalidate map query when map is regenerated (after editing)
  useEffect(() => {
    if (regenerateMap) {
      // console.log('map regeneration');
      mapContainer.current.innerHTML = '';
      queryClient.removeQueries({
        predicate: () => true,
      });
      setMapIsCreated(false);
      setRegenerateMap(() => false);
    }
  }, [mapContainer.current, regenerateMap]);

  //! 3) convert map to editing if needed
  useEffect(() => {
    async function convertToEditing() {
      if (!tripMap.current) return;
      function handleClick(event) {
        // remove previous marker
        document.querySelector('.mapboxgl-marker')?.remove();
        // add marker to the click coordinates
        const coordinates = event.lngLat;
        new mapboxgl.Marker().setLngLat(coordinates).addTo(tripMap.current);
        // move map to marker's location
        tripMap.current.easeTo({
          center: coordinates,
          // padding: { left: window.innerWidth * 0.05 },
          duration: 1000,
        });
        setNewLocationCoordinates([+coordinates.lng, +coordinates.lat]);
      }
      if (isEditingSession) {
        // console.log('\x1b[36m%s\x1b[0m', 'Converting to editing');
        // If editing - add form to create locations
        toast('Click the map to add location!', {
          icon: '🏙️',
        });
        tripMap.current.on('click', handleClick);
        tripMap.current.getCanvas().style.cursor = 'crosshair';
      }
    }
    convertToEditing();
  }, [isEditingSession, tripMap.current]);

  //! 4) filling arrays
  useEffect(() => {
    if (trip?.locations.length > 0) {
      // console.log('\x1b[36m%s\x1b[0m', '2) Filling arrays');
      // locations and routes are created on the map via new layers
      // layers use Sourses, which are filled from arrays:
      const bounds = new mapboxgl.LngLatBounds();
      fillGeoArrays(trip?.locations, bounds);
      // adding padding to the map
      if (!isEditingSession)
        tripMap.current?.fitBounds(bounds, {
          padding: 100,
          duration: 3000,
        });
    }
  }, [trip, tripMap.current, mapIsCreated]);

  //! 5) creating locations layer
  useEffect(() => {
    if (features.current.length > 0 && mapIsCreated) {
      // console.log('\x1b[36m%s\x1b[0m', '3) Locations layer');
      createLocationsLayer();
      populatePopups();
    }
  }, [trip, features.current, mapIsCreated, tripMap.current]);

  //! 6) getting GeoJSON data for location points
  useEffect(() => {
    async function plotPath() {
      // remove marker from map
      document.querySelector('.mapboxgl-marker')?.remove();

      if (waypoints.current?.length < 2 || !tripMap.current) return;
      // console.log('\x1b[36m%s\x1b[0m', '4) Plotting path', waypoints.current);
      const routeData = await createGeoJSON(waypoints.current, isHike);

      if (!tripMap.current?.getSource('route'))
        tripMap.current?.addSource('route', {
          type: 'geojson',
          data: routeData,
        });
      else tripMap.current?.getSource('route').setData(routeData);
      drawRoute(routeData);
    }
    plotPath();
  }, [waypoints.current, isHike, tripMap.current, trip]);

  function fillGeoArrays(locations, bounds) {
    if (!locations?.length) return;
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
    waypoints.current = newWaypoints;
    features.current = newFeatures;
  }
  function createLocationsLayer() {
    // updating layer's source if new feature is added
    if (tripMap.current?.getSource('locations')) {
      tripMap.current.getSource('locations').setData({
        type: 'FeatureCollection',
        features: features.current,
      });
    }
    if (typeof tripMap.current === 'object' && isEditingSession)
      handleLocationLayer();
    tripMap.current?.on('load', () => {
      handleLocationLayer();
    });
  }
  function handleLocationLayer() {
    // console.log('\x1b[36m%s\x1b[0m', 'map', tripMap.current);
    // creating source for the Locations layer
    if (tripMap.current?.getSource('locations')) {
      tripMap.current.getSource('locations').setData({
        type: 'FeatureCollection',
        features: features.current,
      });
    } else {
      tripMap.current.addSource('locations', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: features.current,
        },
      });
    }
    // creating Locations layer
    if (!tripMap.current.getLayer('locations')) {
      tripMap.current.addLayer({
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
    // center tripMap.current on clicked location (with padding to the right)
    tripMap.current.on('click', 'locations', (e) => {
      tripMap.current.easeTo({
        center: e.features[0].geometry.coordinates,
        padding: { bottom: window.innerHeight * 0.2 },
        duration: 1000,
      });
    });
  }
  function populatePopups() {
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });
    tripMap.current?.on('mouseenter', 'locations', (e) => {
      tripMap.current.getCanvas().style.cursor = 'pointer';
      const coordinates = e.features[0].geometry.coordinates.slice();
      const description = e.features[0].properties.description;
      // Populate the popup and set its coordinates
      popup.setLngLat(coordinates).setHTML(description).addTo(tripMap.current);
    });
    // hide popup when cursor leaves
    tripMap.current?.on('mouseleave', 'locations', () => {
      tripMap.current.getCanvas().style.cursor = 'crosshair';
      popup.remove();
    });
    // clicking on the Location
    tripMap.current?.on('click', 'locations', (e) => {
      const locationInfo = e.features[0].properties;
      setLocationInfo(() => locationInfo);
    });
  }
  function drawRoute(routeData) {
    if (!routeData) return;
    if (!tripMap.current) return;
    if (tripMap.current.getLayer('route-layer'))
      tripMap.current.removeLayer('route-layer');

    tripMap.current.getSource('route').setData(routeData);
    tripMap.current.addLayer({
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
      tripMap.current.getLayer('route-layer') &&
      tripMap.current.getLayer('locations')
    )
      tripMap.current.moveLayer('route-layer', 'locations');
  }
  function handleAddLocation() {
    // setRegenerateMap(true);
    isEditingSession && setRegenerateMap(() => true);
    setIsEditingSession((cur) => !cur);
    setLocationInfo(null);
  }
  // const { description = '', highlight = '', travelers = [] } = trip || {};

  return (
    <>
      {(!tripMap.current || isLoading) && <Spinner />}

      <div className="fixed top-0 left-0 w-screen h-screen">
        {isEditingSession && Boolean(newLocationCoordinates.length) && (
          <NewLocationForm
            setNewLocationCoordinates={setNewLocationCoordinates}
            coordinates={newLocationCoordinates}
            isHike={isHike}
          />
        )}

        <div className="absolute z-50 left-4 sm:left-16 top-[80px] flex flex-col gap-2 items-start p-3">
          <TripTitle trip={trip} />

          {trip?.isMyTrip && isEditingSession && (
            <div className="flex items-center gap-2">
              <AddLocationsButton
                handleAddLocation={handleAddLocation}
                isEditingSession={isEditingSession}
              />
              <IsHikeToggle isHike={isHike} setIsHike={setIsHike} />
            </div>
          )}

          {!isEditingSession && tripMap.current && !isLoading && (
            <TripDescription trip={trip} setLocationInfo={setLocationInfo} />
          )}
          {trip?.isMyTrip && (
            <TripActionsMenu
              setRegenerateMap={setRegenerateMap}
              handleAddLocation={handleAddLocation}
              isEditingSession={isEditingSession}
            />
          )}

          {trip?.travelersArray?.length !== 0 && (
            <div className="flex gap-2">
              <PhotoLink travelersArray={trip?.travelersArray} type="inTrip" />
            </div>
          )}
        </div>

        {locationInfo && (
          <LocationInfo
            isMyTrip={trip?.isMyTrip}
            location={locationInfo}
            setLocationInfo={setLocationInfo}
          />
        )}
        <div ref={mapContainer} className="z-30 w-full h-full" />
      </div>
    </>
  );
}
