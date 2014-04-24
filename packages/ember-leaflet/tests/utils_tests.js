require('ember-leaflet/~tests/test_helper');

var locationsEqual = window.locationsEqual, locations = window.locations,
  obj, layer, view, get = Ember.get, set = Ember.set;

module("EmberLeaflet.convert", {});

test("[lat, lng] to L.LatLng", function() {
  deepEqual(EmberLeaflet.convert.latLngArrayFromLatLng(locations.sf),
    [locations.sf.lat, locations.sf.lng]);
  equal(EmberLeaflet.convert.latLngArrayFromLatLng(null), null);
});

test("[lng, lat] to L.LatLng", function() {
  deepEqual(EmberLeaflet.convert.lngLatArrayFromLatLng(locations.sf),
    [locations.sf.lng, locations.sf.lat]);
  equal(EmberLeaflet.convert.latLngArrayFromLatLng(null), null);
});

test("L.LatLng to [lng, lat]", function() {
  locationsEqual(EmberLeaflet.convert.latLngFromLngLatArray(
    [locations.sf.lng, locations.sf.lat]), locations.sf);
  equal(EmberLeaflet.convert.latLngFromLngLatArray(null), null);
});

test("L.LatLng to [lat, lng]", function() {
  locationsEqual(EmberLeaflet.convert.latLngFromLatLngArray(
    [locations.sf.lat, locations.sf.lng]), locations.sf);
  equal(EmberLeaflet.convert.latLngFromLatLngArray(null), null);
});

module("EmberLeaflet.computed.latLngFromLatLngArray", {
  setup: function() {
    obj = Ember.Object.extend({
      // array in lat, lng format
      loc1: [locations.nyc.lat, locations.nyc.lng],

      // array in lng, lat format
      loc2: [locations.chicago.lng, locations.chicago.lat],

      latLng1: EmberLeaflet.computed.latLngFromLatLngArray('loc1'),
      latLng2: EmberLeaflet.computed.latLngFromLngLatArray('loc2')
    }).create();
  },
  teardown: function() {
  }
});

test("[lat, lng] to L.LatLng", function() {
  locationsEqual(get(obj, 'latLng1'), locations.nyc);
  set(obj, 'loc1', [locations.sf.lat, locations.sf.lng]);
  locationsEqual(get(obj, 'latLng1'), locations.sf);
});

test("[lng, lat] to L.LatLng", function() {
  locationsEqual(get(obj, 'latLng2'), locations.chicago);
  set(obj, 'loc2', [locations.sf.lng, locations.sf.lat]);
  locationsEqual(get(obj, 'latLng2'), locations.sf);
});

test("L.LatLng to [lng, lat]", function() {
  set(obj, 'latLng1', locations.sf);
  deepEqual(get(obj, 'loc1'), [locations.sf.lat, locations.sf.lng]);
});

test("L.LatLng to [lat, lng]", function() {
  set(obj, 'latLng2', locations.sf);
  deepEqual(get(obj, 'loc2'), [locations.sf.lng, locations.sf.lat]);
});

