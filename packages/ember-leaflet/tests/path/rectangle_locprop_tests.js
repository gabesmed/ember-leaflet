require('ember-leaflet/~tests/test_helper');

var content, rectangle, RectangleClass, view, 
  locations = window.locations;

module("EmberLeaflet.RectangleLayer with location property", {
  setup: function() {
    content = Ember.A([
      Ember.Object.create({where: locations.chicago}),
      Ember.Object.create({where: locations.sf}),
      Ember.Object.create({where: locations.nyc})
    ]);
    RectangleClass = EmberLeaflet.RectangleLayer.extend({
      locationProperty: 'where'
    });
    rectangle = RectangleClass.create({
      content: content
    });
    view = EmberLeaflet.MapView.create({childLayers: [rectangle]});
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

test("rectangle is created", function() {
  ok(!!rectangle._layer);
  equal(rectangle._layer._map, view._layer);
});

test("locations match", function() {
  var _layerBounds = rectangle._layer.getBounds();
  locationsEqual(_layerBounds.getSouthWest(), locations.sf);
  equal(_layerBounds.getNorth(), locations.chicago.lat);
  equal(_layerBounds.getEast(), locations.nyc.lng);
  var locationLatLngs = rectangle.get('locations');
  locationsEqual(locationLatLngs[0], locations.chicago);
  locationsEqual(locationLatLngs[1], locations.sf);
  locationsEqual(locationLatLngs[2], locations.nyc);
});

test("replace content updates rectangle", function() {
  rectangle.set('content', Ember.A([
    {where:locations.paris},
    {where:locations.nyc}]));
  locationsEqual(rectangle.get('locations')[0], locations.paris);
  locationsEqual(rectangle.get('locations')[1], locations.nyc);
  var _layerBounds = rectangle._layer.getBounds();
  locationsEqual(_layerBounds.getSouthWest(), locations.nyc);
  locationsEqual(_layerBounds.getNorthEast(), locations.paris);
});

test("remove location from content updates rectangle", function() {
  content.popObject();
  locationsEqual(rectangle._layer.getBounds().getNorthEast(),
    locations.chicago);
  equal(rectangle.get('locations.length'), content.length);
});

test("add location to content updates rectangle", function() {
  content.pushObject({where:locations.paris});
  locationsEqual(rectangle._layer.getBounds().getNorthEast(),
    locations.paris);
  equal(rectangle.get('locations.length'), content.length);
});

test("replace location in content updates rectangle", function() {
  content[1].set('where', locations.paris);
  locationsEqual(rectangle.get('locations')[1], locations.paris);
  var _layerBounds = rectangle._layer.getBounds();
  locationsEqual(_layerBounds.getNorthEast(), locations.paris);
  equal(_layerBounds.getWest(), locations.chicago.lng);
  equal(_layerBounds.getSouth(), locations.nyc.lat);
});

test("nullify location in content updates rectangle", function() {
  content[1].set('where', null);
  equal(rectangle.get('locations.length'), 2);
  var _layerBounds = rectangle._layer.getBounds();
  locationsEqual(_layerBounds.getNorthWest(), locations.chicago);
  locationsEqual(_layerBounds.getSouthEast(), locations.nyc);
});
