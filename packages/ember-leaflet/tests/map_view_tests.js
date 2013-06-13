require('ember-leaflet/~tests/test_helper');

var view, f,
  helper = window.helper,
  locationsEqual = window.locationsEqual;

module("EmberLeaflet.MapView", {
  setup: function() {
    view = EmberLeaflet.MapView.create({
      center: window.locations.nyc,
      zoom: 16
    });
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
  ok(view.$().hasClass('ember-view'));
});

test("leaflet object should be created", function() {
  ok(view._layer);
  ok(view._layer._loaded);
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
