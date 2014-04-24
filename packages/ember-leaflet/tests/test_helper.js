window.helper = {
  locationsEqual: function(loc1, loc2) {
    var msg = '', isEqual = false;
    if(!loc1) { msg = 'First location was null'; }
    else if(!loc2) { msg = 'Second location was null'; }
    else if(loc1.lat !== loc2.lat) {
      msg = 'Latitude ' + loc1.lat + ' did not match ' + loc2.lat; }
    else if(loc1.lng !== loc2.lng) {
      msg = 'Longitude ' + loc1.lng + ' did not match ' + loc2.lng; }
    else { isEqual = true; }
    ok(isEqual, msg);
  }
};
window.locationsEqual = window.helper.locationsEqual;

window.locations = {
  nyc: L.latLng(40.713282, -74.006978),
  sf: L.latLng(37.77493, -122.419415),
  chicago: L.latLng(41.878114, -87.629798),
  paris: L.latLng(48.856614, 2.352222),
  london: L.latLng(51.511214, -0.119824),
  newdelhi: L.latLng(28.635308, 77.22496)
};

// Disable transitions
L.DomUtil.TRANSITION = '';
L.DomUtil.TRANSITION_END = '';
window.L_DISABLE_3D = true;

L.Icon.Default.imagePath = '/testpath';
