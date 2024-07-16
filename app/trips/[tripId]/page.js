'use client';

import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import mapboxgl from '!mapbox-gl';
import { createFeature, createGeoJSON } from '@/app/_lib/mapbox';
import Spinner from '@/app/_components/Spinner';
import TripDescription from '@/app/_components/TripDescription';
import LocationInfo from '@/app/_components/LocationInfo';
import PhotoLink from '@/app/_components/PhotoLink';
import TripTitle from '../../_components/TripTitle';
import AddLocationsButton from '../../_components/AddLocationsButton';
import IsHikeToggle from '../../_components/IsHikeToggle';
import NewLocationForm from '../../_components/NewLocationForm';
import { useTrip } from './useTrip';
import { useMap } from './useMap';

import 'mapbox-gl/dist/mapbox-gl.css';

export default function Page({ params }) {
  const queryClient = useQueryClient();
  const [isEditingSession, setIsEditingSession] = useState(false);
  const [tripMap, setTripMap] = useState(null);
  const [regenerateMap, setRegenerateMap] = useState(false);
  const [newLocationCoordinates, setNewLocationCoordinates] = useState([]);
  const [locationInfo, setLocationInfo] = useState(null);
  const [isHike, setIsHike] = useState(false);
  // waypoints - array for GeoJson creation => routes
  const [waypoints, setWaypoints] = useState([]);
  // features - array for the map.addSource method, contains Locations data
  const [features, setFeatures] = useState([]);

  const mapContainer = useRef(null);

  //! 1) get trip info & display map
  const { trip, isLoading } = useTrip(params.tripId);
  const result = useMap(mapContainer.current, trip?.locations);
  // queryClient.invalidateQueries({ queryKey: ['map'] });
  // result is a Promise, it should be awaited
  useEffect(() => {
    async function getTripMap() {
      const { map } = await result;
      setTripMap(map);
      setIsHike(() => trip?.isHike);
    }
    getTripMap();
  }, [result, trip]);

  //! 2) invalidate map query when map is regenerated (after editing)
  useEffect(() => {
    if (regenerateMap) {
      mapContainer.current.innerHTML = '';
      queryClient.invalidateQueries('map');
      setRegenerateMap(() => false);
    }
  }, [queryClient, mapContainer.current, regenerateMap]);

  //! 3) convert map to editing if needed
  useEffect(() => {
    async function convertToEditing() {
      // console.log('\x1b[36m%s\x1b[0m', '3');
      if (!tripMap) return;
      function handleClick(event) {
        // remove previous marker
        document.querySelector('.mapboxgl-marker')?.remove();
        // add marker to the click coordinates
        const coordinates = event.lngLat;
        const marker = new mapboxgl.Marker()
          .setLngLat(coordinates)
          .addTo(tripMap);
        // move map to marker's location
        tripMap.easeTo({
          center: coordinates,
          padding: { left: window.innerWidth * 0.5 },
          duration: 1000,
        });
        setNewLocationCoordinates([+coordinates.lng, +coordinates.lat]);
      }
      if (isEditingSession) {
        // If editing - add form to create locations
        tripMap.on('click', handleClick);
        tripMap.getCanvas().style.cursor = 'crosshair';
      }
    }
    convertToEditing();
  }, [isEditingSession, isHike, tripMap]);

  //! 4) filling arrays
  useEffect(() => {
    if (trip?.locations.length > 0) {
      // locations and routes are created on the map via new layers
      // layers use Sourses, which are filled from arrays:
      const bounds = new mapboxgl.LngLatBounds();
      fillGeoArrays(trip?.locations, bounds);
      // adding padding to the map
      tripMap?.fitBounds(bounds, {
        padding: {
          top: 120,
          bottom: 120,
          left: 120,
          right: 120,
        },
        duration: 3000,
      });
    }
  }, [trip, tripMap]);

  //! 5) creating locations layer
  useEffect(() => {
    // console.log('\x1b[36m%s\x1b[0m', 'effect 3', features.length);
    if (features.length > 0) {
      createLocationsLayer();
      populatePopups();
    }
  }, [features, tripMap]);

  //! 6) getting GeoJSON data for location points
  useEffect(() => {
    async function plotPath() {
      // console.log('\x1b[36m%s\x1b[0m', '4');
      // remove marker from map
      document.querySelector('.mapboxgl-marker')?.remove();
      if (!waypoints.length) return;
      const routeData = await createGeoJSON(waypoints, isHike);

      if (!tripMap?.getSource('route'))
        tripMap?.addSource('route', {
          type: 'geojson',
          data: routeData,
        });
      else tripMap?.getSource('route').setData(routeData);
      drawRoute(routeData);
    }
    plotPath();
  }, [waypoints, isHike, tripMap]);

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
    setWaypoints(() => [...newWaypoints]);
    setFeatures(() => [...newFeatures]);
  }
  function createLocationsLayer() {
    // updating layer's source if new feature is added
    if (tripMap?.getSource('locations'))
      tripMap.getSource('locations').setData({
        type: 'FeatureCollection',
        features,
      });

    tripMap?.on('load', () => {
      // console.log('\x1b[32m%s\x1b[0m', 'creating location layer 2');
      if (!tripMap) return;
      // creating source for the Locations layer
      if (tripMap?.getSource('locations'))
        tripMap.getSource('locations').setData({
          type: 'FeatureCollection',
          features,
        });
      else
        tripMap.addSource('locations', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features,
          },
        });
      // creating Locations layer
      if (!tripMap.getLayer('locations')) {
        tripMap.addLayer({
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
      // center tripMap on clicked location (with padding to the right)
      tripMap.on('click', 'locations', (e) => {
        tripMap.easeTo({
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
    tripMap?.on('mouseenter', 'locations', (e) => {
      tripMap.getCanvas().style.cursor = 'pointer';
      const coordinates = e.features[0].geometry.coordinates.slice();
      const description = e.features[0].properties.description;
      // Populate the popup and set its coordinates
      popup.setLngLat(coordinates).setHTML(description).addTo(tripMap);
    });
    // hide popup when cursor leaves
    tripMap?.on('mouseleave', 'locations', () => {
      tripMap.getCanvas().style.cursor = 'crosshair';
      popup.remove();
    });
    // clicking on the Location
    tripMap?.on('click', 'locations', (e) => {
      const locationInfo = e.features[0].properties;
      setLocationInfo(() => locationInfo);
    });
  }
  function drawRoute(routeData) {
    if (!routeData) return;
    if (!tripMap) return;
    if (tripMap.getLayer('route-layer')) tripMap.removeLayer('route-layer');

    tripMap.getSource('route').setData(routeData);
    tripMap.addLayer({
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
    if (tripMap.getLayer('route-layer') && tripMap.getLayer('locations'))
      tripMap.moveLayer('route-layer', 'locations');
  }

  const { description = '', highlight = '', travelers = [] } = trip || {};

  return (
    <>
      {(!tripMap || isLoading) && <Spinner />}

      <div className="fixed top-0 left-0 w-screen h-screen">
        {/* trip details */}
        {/* {!isEditingSession && (highlight || description) && (
          <TripDescription highlight={highlight} description={description} />
        )} */}
        {/* add location form */}
        {isEditingSession && Boolean(newLocationCoordinates.length) && (
          <NewLocationForm
            setNewLocationCoordinates={setNewLocationCoordinates}
            coordinates={newLocationCoordinates}
            isHike={isHike}
          />
        )}

        <div className="absolute z-50 left-16 top-[100px] flex flex-col gap-2 items-start">
          <TripTitle trip={trip} />

          {travelers?.length !== 0 && (
            <div className="flex gap-2">
              {travelers.map((traveler) => (
                <PhotoLink user={traveler} key={traveler._id} />
              ))}
            </div>
          )}

          {trip?.isMyTrip && (
            <AddLocationsButton
              isEditingSession={isEditingSession}
              setRegenerateMap={setRegenerateMap}
              setIsEditingSession={setIsEditingSession}
              setLocationInfo={setLocationInfo}
            />
          )}

          {trip?.isMyTrip && isEditingSession && (
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
