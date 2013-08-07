require('ember-leaflet/~tests/test_helper');

var content, circle, view, 
  locationsEqual = window.locationsEqual,
  locations = window.locations;

module("EmberLeaflet.CircleLayer", {
  setup: function() {
    content = Ember.Object.create({loc:locations.sf,radius:10});
    var CircleClass = EmberLeaflet.CircleLayer.extend({
      location: Ember.computed.alias('content.loc')
    });
    circle = CircleClass.create({
      content: content
    });
    view = EmberLeaflet.MapView.create({childLayers: [circle]});
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

test("circle is created", function() {
  ok(!!circle._layer);
  equal(circle._layer._map, view._layer);
});

test("locations match", function() {
  var _layerLocation = circle._layer.getLatLng();
  locationsEqual(_layerLocation, locations.sf);
  var locationLatLng = circle.get('location');
  locationsEqual(locationLatLng, locations.sf);
});

test("radius match", function() {
  var _layerRadius = circle._layer.getRadius();
  equal(_layerRadius, 10);
  var locationRadius = circle.get('radius');
  equal(locationRadius, 10);
});

test("set location to null clears circle", function() {
  circle.set('location', null);
  equal(circle._layer, null);
  equal(content.get('loc'), null);
});

test("move location in content moves circle", function() {
  content.set('loc', locations.chicago);
  locationsEqual(circle.get('location'), locations.chicago);
  locationsEqual(circle._layer.getLatLng(), locations.chicago);
});

test("change radius in content changes circle radius", function() {
  content.set('radius', 20);
  equal(circle.get('radius'), 20);
  equal(circle._layer.getRadius(), 20);
});

test("nullify location in content clears circle", function() {
  content.set('loc', null);
  equal(circle.get('location'), null);
  equal(circle._layer, null);
});