require('ember-leaflet/~tests/test_helper');

var content, polyline, PolylineClass, view,
  locations = window.locations;

module("EmberLeaflet.PolylineLayer with location property", {
  setup: function() {
    content = Ember.A([
      Ember.Object.create({where: locations.chicago}),
      Ember.Object.create({where: locations.sf}),
      Ember.Object.create({where: locations.nyc}),
      Ember.Object.create({where: null}),
      Ember.Object.create()
    ]);
    PolylineClass = EmberLeaflet.PolylineLayer.extend({
      locationProperty: 'where'
    });
    polyline = PolylineClass.create({
      content: content
    });
    view = EmberLeaflet.MapView.create({childLayers: [polyline]});
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

test("polyline is created", function() {
  ok(!!polyline._layer);
  equal(polyline._layer._map, view._layer);
});

test("locations match", function() {
  var _layerLatLngs = polyline._layer.getLatLngs();
  locationsEqual(_layerLatLngs[0], locations.chicago);
  locationsEqual(_layerLatLngs[1], locations.sf);
  locationsEqual(_layerLatLngs[2], locations.nyc);
  var locationLatLngs = polyline.get('locations');
  locationsEqual(locationLatLngs[0], locations.chicago);
  locationsEqual(locationLatLngs[1], locations.sf);
  locationsEqual(locationLatLngs[2], locations.nyc);
});

test("replace content updates polyline", function() {
  polyline.set('content', Ember.A([{where: locations.paris}]));
  equal(polyline.get('locations').length, 1);
  equal(polyline._layer.getLatLngs().length, 1);
  locationsEqual(polyline.get('locations')[0], locations.paris);
  locationsEqual(polyline._layer.getLatLngs()[0], locations.paris);
});

test("remove item from content updates polyline", function() {
  content.replace(2, 1, []);
  equal(polyline._layer.getLatLngs().length, 2);
  equal(polyline.get('locations').length, 2);
});

test("add item to content updates polyline", function() {
  content.pushObject({where: locations.paris});
  equal(polyline._layer.getLatLngs().length, 4);
  equal(polyline.get('locations').length, 4);
  locationsEqual(polyline.get('locations')[3], locations.paris);
  locationsEqual(polyline._layer.getLatLngs()[3], locations.paris);
});

test("nullify location in content updates polyline", function() {
  content[2].set('where', null);
  equal(polyline.get('locations.length'), 2);
  equal(polyline._layer.getLatLngs().length, 2);
});

test("un-nullify location in content updates polyline", function() {
  content[3].set('where', locations.paris);
  equal(polyline.get('locations.length'), 4);
  equal(polyline._layer.getLatLngs().length, 4);
  locationsEqual(polyline.get('locations')[3], locations.paris);
  locationsEqual(polyline._layer.getLatLngs()[3], locations.paris);
});

test("update location in content updates polyline", function() {
  content[2].set('where', locations.paris);
  locationsEqual(polyline.get('locations')[2], locations.paris);
  locationsEqual(polyline._layer.getLatLngs()[2], locations.paris);  
});

