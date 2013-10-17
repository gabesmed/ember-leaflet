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

module("EmberLeaflet.computed.styleProperties", {
  setup: function() {
    layer = EmberLeaflet.CircleLayer.create({
      content: {
        location: locations.sf,
        radius: 10
      }
    });
    view = EmberLeaflet.MapView.create({
      childLayers: [layer]
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

test("Getters", function() {
  equal(layer.get('stroke'), layer._layer.options.stroke, "get stroke");
  equal(layer.get('color'), layer._layer.options.color, "get color");
  equal(layer.get('weight'), layer._layer.options.weight, "get weight");
  equal(layer.get('opacity'), layer._layer.options.opacity, "get opacity");
  equal(layer.get('fill'), layer._layer.options.fill, "get fill");
  equal(layer.get('fillColor'), layer._layer.options.fillColor, "get fill color");
  equal(layer.get('fillOpacity'), layer._layer.options.fillOpacity, "get fill opacity");
  equal(layer.get('dashArray'), layer._layer.options.dashArray, "get dash array");
  equal(layer.get('clickable'), layer._layer.options.clickable, "get clickable");
  equal(layer.get('pointerEvents'), layer._layer.options.pointerEvents, "get pointer events");
});

test("Setters", function() {
  layer.set('stroke', false);
  equal(layer._layer.options.stroke, false, "set stroke");
  layer.set('color', '#000');
  equal(layer._layer.options.color, '#000', "set color");
  layer.set('weight', 12);
  equal(layer._layer.options.weight, 12, "set weight");
  layer.set('opacity', 0);
  equal(layer._layer.options.opacity, 0, "set opacity");
  var fillValue = !layer._layer.options.fill;
  layer.set('fill', fillValue);
  equal(layer._layer.options.fill, fillValue, "set fill");
  layer.set('fillColor', '#fff');
  equal(layer._layer.options.fillColor, '#fff', "set fill color");
  layer.set('fillOpacity', 0);
  equal(layer._layer.options.fillOpacity, 0, "set fill opacity");
  layer.set('dashArray', '5,3,2');
  equal(layer._layer.options.dashArray, '5,3,2', "set dash array");
  layer.set('clickable', false);
  equal(layer._layer.options.clickable, false, "set clickable");
  layer.set('pointerEvents', 'none');
  equal(layer._layer.options.pointerEvents, 'none', "set pointer events");
});
