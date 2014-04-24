require('ember-leaflet/~tests/test_helper');

var view, geometry, locations = window.locations, controller;

var n = [-15.780148, -47.92917],
    w = [-15.782102, -47.936869],
    s = [-15.786108, -47.931933],
    e = [-15.783423, -47.924638];

module("EmberLeaflet.PathBoundsLayer with location property", {
  setup: function() {
    locations = Ember.A([
      Ember.Object.create({lastSeenAt: n}),
      Ember.Object.create({lastSeenAt: w}),
      Ember.Object.create({lastSeenAt: s}),
      Ember.Object.create({lastSeenAt: null}),
      Ember.Object.create({lastSeenAt: e})
    ]);
    geometry = EmberLeaflet.PathBoundsLayer.create({
      content: locations,
      locationProperty: 'lastSeenAt'
    });
  }
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
  locations.pushObject(Ember.Object.create({lastSeenAt: e2}));
  equal(geometry.get('bounds').getEast(), e2[1]);
});

test("remove an object updates bounds", function() {
  Ember.run(function() { locations.replace(3, 2); });
  // now northernmost (first) point is most eastward
  equal(geometry.get('bounds').getEast(), n[1]);
});

test("update a location updates bound", function() {
  locations[1].set('lastSeenAt', e);
  // Now bounds don't extend as far west
  equal(geometry.get('bounds').getWest(), s[1]);
});

test("clear locations empties bounds", function() {
  Ember.run(function() { locations.clear(); });
  equal(geometry.get('bounds'), null);
});

test("nullify locations empties bounds", function() {
  Ember.run(function() { geometry.set('locations', null); });
  equal(geometry.get('bounds'), null);
});
