require('ember-leaflet/~tests/test_helper');

var content, marker, MarkerClass, view, 
  locationsEqual = window.locationsEqual,
  locations = window.locations;

module("EmberLeaflet.MarkerLayer", {
  setup: function() {
    content = Ember.Object.create({loc: locations.nyc});
    MarkerClass = EmberLeaflet.MarkerLayer.extend({
      location: Ember.computed.alias('content.loc')
    });
    marker = MarkerClass.create({
      content: content
    });
    view = EmberLeaflet.MapView.create({childLayers: [marker]});
    Ember.run(function() {
      view.appendTo('#qunit-fixture');
    });
  },
  teardown: function() {
    Ember.run(function() {
      view.destroy();      
    });
  }
});

test("marker is created", function() {
  ok(!!marker._layer);
  equal(marker._layer._map, view._layer);
});

test("location matches", function() {
  locationsEqual(marker._layer.getLatLng(), locations.nyc);
  locationsEqual(marker.get('location'), locations.nyc);
});

test("set location to null clears marker", function() {
  marker.set('location', null);
  equal(marker._layer, null);
  equal(content.get('loc'), null);
});

test("move location in content moves marker", function() {
  content.set('loc', locations.sf);
  locationsEqual(marker.get('location'), locations.sf);
  locationsEqual(marker._layer.getLatLng(), locations.sf);
});

test("nullify location in content clears marker", function() {
  content.set('loc', null);
  equal(marker.get('location'), null);
  equal(marker._layer, null);
});

module("EmberLeaflet.MarkerLayer with conversion", {
  setup: function() {
    content = Ember.Object.create({
      loc: [locations.nyc.lat, locations.nyc.lng]
    });
    MarkerClass = EmberLeaflet.MarkerLayer.extend({
      location: EmberLeaflet.computed.latLngFromLatLngArray('content.loc')
    });
    marker = MarkerClass.create({
      content: content
    });
    view = EmberLeaflet.MapView.create({childLayers: [marker]});
    Ember.run(function() {
      view.appendTo('#qunit-fixture');
    });
  },
  teardown: function() {
    Ember.run(function() {
      view.destroy();      
    });
  }
});

test("location matches", function() {
  locationsEqual(marker._layer.getLatLng(), locations.nyc);
  locationsEqual(marker.get('location'), locations.nyc);
});

test("move location in content moves marker", function() {
  content.set('loc', [locations.sf.lat, locations.sf.lng]);
  locationsEqual(marker.get('location'), locations.sf);
  locationsEqual(marker._layer.getLatLng(), locations.sf);
});

test("nullify location in content clears marker", function() {
  content.set('loc', null);
  equal(marker.get('location'), null);
  equal(marker._layer, null);
});
