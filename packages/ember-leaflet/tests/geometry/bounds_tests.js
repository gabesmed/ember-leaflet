require('ember-leaflet/~tests/test_helper');

var view, geometry, locations = window.locations, controller;

var n = [-15.780148, -47.92917],
    w = [-15.782102, -47.936869],
    s = [-15.786108, -47.931933],
    e = [-15.783423, -47.924638];

module("EmberLeaflet.BoundingGeometryLayer", {
  setup: function() {
    locations = Ember.A([
      L.latLng(n), L.latLng(w), L.latLng(s), null, L.latLng(e)]);
    geometry = EmberLeaflet.BoundingGeometryLayer.create({
      locations: locations
    });
  },
  teardown: function() {}
});

test("bounds initializes ok", function() {
  var bounds = geometry.get('bounds');
  ok(bounds, "bounds should be initialized");
  equal(bounds.getSouth(), s[0]);
  equal(bounds.getNorth(), n[0]);
  equal(bounds.getWest(), w[1]);
  equal(bounds.getEast(), e[1]);
});

test("add an object updates bounds", function() {
  var e2 = [-15.782515, -47.914295]; // further east
  locations.pushObject(L.latLng(e2));
  equal(geometry.get('bounds').getEast(), e2[1]);
});

test("remove an object updates bounds", function() {
  locations.splice(3, 2);
  // now northernmost (first) point is most eastward
  equal(geometry.get('bounds').getEast(), n[1]);
});

test("clear locations empties bounds", function() {
  locations.clear();
  equal(geometry.get('bounds'), null);
});

test("clear child layers empties bounds", function() {
  geometry.set('locations', Ember.A());
  equal(geometry.get('bounds'), null);
});
