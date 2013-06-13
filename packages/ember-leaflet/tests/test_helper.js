window.helper = {
  locationsEqual: function(loc1, loc2) {
    var msg = '', isEqual = false;
    if(!loc1) { msg = 'First location was null'; }
    else if(!loc2) { msg = 'Second location was null'; }
    else if(loc1.lat !== loc2.lat) { msg = 'Latitudes did not match'; }
    else if(loc1.lng !== loc2.lng) { msg = 'Longitudes did not match'; }
    else { isEqual = true; }
    ok(isEqual, msg);
  }
};
window.locationsEqual = window.helper.locationsEqual;

window.locations = {
  nyc: L.latLng(40.713282, -74.006978),
  sf: L.latLng(37.77493, -122.419415)
};

// Disable transitions
L.DomUtil.TRANSITION = null;
L.DomUtil.TRANSITION_END = null;
