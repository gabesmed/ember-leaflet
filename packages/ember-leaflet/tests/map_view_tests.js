require('ember-leaflet/~tests/test_helper');

var view, f, locationsEqual = window.locationsEqual;

module("EmberLeaflet.MapView", {
  setup: function() {
    view = EmberLeaflet.MapView.create({});
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

test("map DOM should be created", function() {
  ok(view.$().hasClass('leaflet-container'));
  equal(view.$('.leaflet-map-pane').length, 1);
});

test("leaflet object should be created", function() {
  ok(view._layer);
  ok(view._layer._loaded);
  equal(view.get('element')._leaflet, true);
});

test("leaflet object should have default settings", function() {
  equal(view.get('zoom'), 16);
  locationsEqual(view.get('center'), window.locations.nyc);
});

test("center and zoom are set on Ember object", function() {
  locationsEqual(view.get('center'), window.locations.nyc);
  equal(view.get('zoom'), 16);
});

test("center and zoom are set on map", function() {
  locationsEqual(view._layer.getCenter(), window.locations.nyc);
  equal(view._layer.getZoom(), 16);
});

test("change object center updates map", function() {
  Ember.run(function() {
    view.set('center', window.locations.sf);
  });
  locationsEqual(view._layer.getCenter(), window.locations.sf);
});

test("change object zoom updates map", function() {
  Ember.run(function() {
    view.set('zoom', 17);
  });
  equal(view._layer.getZoom(), 17);
});

test("change map center updates object", function() {
  view._layer.panTo(window.locations.sf);
  locationsEqual(view.get('center'), window.locations.sf);
});

test("change map zoom updates object", function() {
  view._layer.setZoom(17);
  equal(view.get('zoom'), 17);
});

test("default tile layer created", function() {
  equal(view._childLayers.length, 0);
  equal(view._defaultChildLayer._map, view._layer);
  equal(view._defaultChildLayer._url, 'http://a.tiles.mapbox.com/v3/examples.map-zr0njcqy/{z}/{x}/{y}.png');
});

test("_destroyLayer cleans up", function() {
  Ember.run(function() {
    view._destroyLayer();
  });
  equal(view.$('.leaflet-map-pane').length, 0);
  equal(view.get('element')._leaflet, undefined);
});
