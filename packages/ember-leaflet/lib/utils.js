var get = Ember.get, set = Ember.set;

function latLngArrayFromLatLng(latLng) {
  return latLng ? [latLng.lat, latLng.lng] : null; }

function lngLatArrayFromLatLng(latLng) {
  return latLng ? [latLng.lng, latLng.lat] : null; }

function latLngFromLatLngArray(latLngArray) {
  return latLngArray ? L.latLng(latLngArray[0], latLngArray[1]) : null; }

function latLngFromLngLatArray(lngLatArray) {
  return lngLatArray ? L.latLng(lngLatArray[1], lngLatArray[0]) : null; }

EmberLeaflet.convert = {
  latLngArrayFromLatLng: latLngArrayFromLatLng,
  lngLatArrayFromLatLng: lngLatArrayFromLatLng,
  latLngFromLatLngArray: latLngFromLatLngArray,
  latLngFromLngLatArray: latLngFromLngLatArray
};

EmberLeaflet.computed = {};

/**
  Define a computed property that converts a [longitude, latitude] array
  to a leaflet LatLng object.

  @method latlngFromLngLatArray
*/
EmberLeaflet.computed.latLngFromLngLatArray = function(coordKey) {
  return Ember.computed(coordKey, function(key, value) {
    if(arguments.length === 1) {
      return latLngFromLngLatArray(get(this, coordKey));
    } else {
      set(this, coordKey, lngLatArrayFromLatLng(value));
      return value;
    }
  });  
};

/**
  Define a computed property that converts a [latitude, longitude] array
  to a leaflet LatLng object.

  @method latlngFromLatLngArray
*/
EmberLeaflet.computed.latLngFromLatLngArray = function(coordKey) {
  return Ember.computed(coordKey, function(key, value) {
    if(arguments.length === 1) {
      return latLngFromLatLngArray(get(this, coordKey));
    } else {
      set(this, coordKey, value = latLngArrayFromLatLng(value));
      return value;
    }
  });  
};
