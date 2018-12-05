/* eslint-disable no-new */
import loadGoogleMapsApi from 'load-google-maps-api';

let map;
let mapEl;
let position;
let options;
let placeId;
let placeLocation;

function createMarker() {
  const customMarker = options.marker.icon ? {
    url: options.marker.icon,
  } : null;
  const marker = new google.maps.Marker({
    map,
    position: placeLocation || position,
    icon: customMarker,
  });
  if (options.marker.clickable !== false
    && (options.marker.link !== null || options.placeId !== null)) {
    google.maps.event.addListener(marker, 'click', () => {
      window.open(options.marker.link ? options.marker.link : `https://www.google.com/maps/place/?q=place_id:${placeId}`);
    });
  }
}

function callback(place, status) {
  // If we can get the data back from the places service use it
  // if not use hard-coded coordinates
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    placeLocation = place.geometry.location;
  }
  createMarker();
}

function getPlace() {
  const placesService = new google.maps.places.PlacesService(map);
  placesService.getDetails({
    placeId,
  }, callback);
}

export default function init(optionsObj) {
  options = optionsObj;
  loadGoogleMapsApi({
    key: options.key,
    libraries: options.libraries,
  }).then((googleMaps) => {
    mapEl = document.querySelector(options.selector);
    placeId = options.placeId ? options.placeId : mapEl.dataset.placeid;
    position = {
      lat: parseFloat(options.lat ? options.lat : (mapEl.dataset.lat || null)),
      lng: parseFloat(options.lng ? options.lng : (mapEl.dataset.lng || null)),
    };
    map = new googleMaps.Map(mapEl, {
      center: position,
      streetViewControl: options.streetViewControl,
      zoom: options.zoom,
      styles: options.styles,
    });
    getPlace();
  }).catch((error) => {
    console.error(error);
  });
}
