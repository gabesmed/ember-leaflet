var convert = {};

/**
Convert a L.LatLng object to a [lat, lng] array.
*/
convert.latLngArrayFromLatLng = function(latLng) {
  return latLng ? [latLng.lat, latLng.lng] : null; };

/**
Convert a L.LatLng object to a [lng, lat] array.
*/
convert.lngLatArrayFromLatLng = function(latLng) {
  return latLng ? [latLng.lng, latLng.lat] : null; };

/**
Convert a [lat, lng] array to an L.LatLng object. If LatLng is passed in,
pass it through.
*/
convert.latLngFromLatLngArray = function(arr) {
  return arr ? (arr.lat ? arr : L.latLng(arr[0], arr[1])) : null; };

/**
Convert a [lng, lat] array to an L.LatLng object. If LatLng is passed in,
pass it through.
*/
convert.latLngFromLngLatArray = function(arr) {
  return arr ? (arr.lat ? arr : L.latLng(arr[1], arr[0])) : null; };

export default convert;
