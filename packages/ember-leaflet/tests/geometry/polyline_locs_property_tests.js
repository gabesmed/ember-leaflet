require('ember-leaflet/~tests/test_helper');

var content, polyline, PolylineClass, view, 
  locations = window.locations,
  locationsEqual = window.locationsEqual;

module("EmberLeaflet.PolylineLayer with locations property", {
  setup: function() {
    content = Ember.Object.create({
      path: Ember.A([locations.chicago, locations.sf, locations.nyc])
    });
    PolylineClass = EmberLeaflet.PolylineLayer.extend({
      locationsProperty: 'path'
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
  polyline.set('content', Ember.Object.create({
    path: Ember.A([locations.paris])
  }));
  equal(polyline.get('locations').length, 1);
  equal(polyline._layer.getLatLngs().length, 1);
  locationsEqual(polyline.get('locations')[0], locations.paris);
  locationsEqual(polyline._layer.getLatLngs()[0], locations.paris);
});

test("remove location from content updates polyline", function() {
  content.get('path').popObject();
  equal(polyline._layer.getLatLngs().length, content.get('path').length);
  equal(polyline.get('locations').length, content.get('path').length);
});

test("add location to content updates polyline", function() {
  content.get('path').pushObject(locations.paris);
  equal(polyline._layer.getLatLngs().length, content.get('path').length);
  equal(polyline.get('locations').length, content.get('path').length);
  locationsEqual(polyline.get('locations')[3], locations.paris);
  locationsEqual(polyline._layer.getLatLngs()[3], locations.paris);
});

test("move location in content moves polyline", function() {
  content.get('path').replace(2, 1, locations.paris);
  locationsEqual(polyline.get('locations')[2], locations.paris);
  locationsEqual(polyline._layer.getLatLngs()[2], locations.paris);
});

test("nullify location in content updates polyline", function() {
  content.get('path').replace(2, 1, null);
  equal(polyline.get('locations.length'), 2);
  equal(polyline._layer.getLatLngs().length, 2);
});

test("changing locations property updates", function() {
  content.set('path2', Ember.A([locations.london, locations.newdelhi]));
  polyline.set('locationsProperty', 'path2');
  equal(polyline.get('locations.length'), 2);
  equal(polyline._layer.getLatLngs().length, 2);
  locationsEqual(polyline.get('locations')[0], locations.london);
});

test("observers reassigned after changing locationsProperty", function() {
  content.set('path2', Ember.A([]));
  polyline.set('locationsProperty', 'path2');
  equal(polyline.get('locations.length'), 0);
  content.get('path2').pushObject(locations.london);
  equal(polyline.get('locations.length'), 1);
});
