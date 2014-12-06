require('ember-leaflet/~tests/test_helper');

var view, f;

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

asyncTest("two zooms in rapid succession end correctly", 1, function() {
  expect(2);
  view.set('zoom', 17);
  setTimeout(function() {
    view.set('zoom', 18);
    setTimeout(function() {
      equal(view.get('zoom'), 18, "zoom correct on object");
      equal(view._layer.getZoom(), 18, "zoom correct on map");
      start();
    }, 100);
  }, 1);
});

test("default tile layer created", function() {
  equal(view._childLayers.length, 1, "should be created");
  equal(Ember.typeOf(view._childLayers[0]), "instance",
    "should be instantiated");
  ok(EmberLeaflet.TileLayer.detectInstance(view._childLayers[0]),
    "should be an EmberLeaflet.TileLayer");
  equal(view._childLayers[0]._layer._map, view._layer,
    "should be added to map");
  equal(view._childLayers[0]._layer._url, '//a.tiles.mapbox.com/v3/examples.map-zr0njcqy/{z}/{x}/{y}.png',
    "should have tileUrl set");
});

test("don't create default layer if childLayers is set", function() {
  var secondView = EmberLeaflet.MapView.create({childLayers: []});
  Ember.run(function() {
    secondView.appendTo('#qunit-fixture');
  });
  equal(secondView._childLayers.length, 0);
  Ember.run(function() {
    secondView.destroy();      
  });  
});

test("_destroyLayer cleans up", function() {
  Ember.run(function() {
    view._destroyLayer();
  });
  equal(view.$('.leaflet-map-pane').length, 0);
  equal(view.get('element')._leaflet, undefined);
});
