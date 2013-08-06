require('ember-leaflet/~tests/test_helper');

var content, polygon, PolygonClass, view, 
  locationsEqual = window.locationsEqual,
  locations = window.locations;

var get = Ember.get;

module("EmberLeaflet.PopupMixin (Geometry)", {
  setup: function() {
    content = Ember.A([locations.sf, locations.chicago, locations.nyc]);

    PolygonClass = EmberLeaflet.PolygonLayer.extend(
      EmberLeaflet.PopupMixin, {});
    
    polygon = PolygonClass.create({
      content: content,
      popupContent: 'hello there!'
    });

    view = EmberLeaflet.MapView.create({childLayers: [polygon]});
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

test("Popup is created", function() {
  ok(polygon._popup, "popup is created");
  equal(polygon._popup._map, null, "popup not added until opened");  
});

test("Clicking shows popup", function() {
  var latlng = L.latLngBounds(polygon.get('locations')).getCenter();
  polygon._layer.fire('click', {
    latlng: latlng
  });
  ok(!!polygon._popup._map, "popup added to map");
  equal(polygon._popup._content, 'hello there!');
  locationsEqual(polygon._popup._latlng, latlng);
});

test("Destroying map destroys popup", function() {
  Ember.run(function() { view.destroy(); });
  equal(polygon._popup, null);
});
