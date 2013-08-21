require('ember-leaflet/~tests/test_helper');

var content, marker, MarkerClass, view, 
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

test("get & set opacity", function() {
  equal(marker.get('opacity'), 1.0);
  marker.set('opacity', 0.5);
  equal(marker.get('opacity'), 0.5, "opacity was updated in object");
  equal(marker._layer.options.opacity, 0.5,
    'opacity was updated in options');
  equal(Ember.$(marker._layer._icon).css('opacity'), 0.5,
    'opacity was updated in stylesheet');
});

test("get & set zIndexOffset", function() {
  marker._layer.update();
  var initZIndex = parseInt(Ember.$(marker._layer._icon).css('z-index'), 10);
  equal(marker.get('zIndexOffset'), 0);
  marker.set('zIndexOffset', 4);
  equal(marker.get('zIndexOffset'), 4, "zIndexOffset updated in object");
  equal(marker._layer.options.zIndexOffset, 4,
    'zIndexOffset updated in options');
  equal(Ember.$(marker._layer._icon).css('zIndex'), initZIndex + 4,
    "zIndex was updated in stylesheet");
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
