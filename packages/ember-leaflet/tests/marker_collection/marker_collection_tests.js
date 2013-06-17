require('ember-leaflet/~tests/test_helper');

var view, collection, content, locationsEqual = window.locationsEqual,
  locations = window.locations;

module("EmberLeaflet.MarkerCollectionLayer", {
  setup: function() {
    content = Ember.A([
      Ember.Object.create({location: locations.nyc}),
      Ember.Object.create({location: locations.sf}),
      Ember.Object.create({location: locations.chicago}),
      Ember.Object.create({location: null})
    ]);
    var collectionClass = EmberLeaflet.MarkerCollectionLayer.extend({
      content: content
    });
    view = EmberLeaflet.MapView.create({
      childLayers: [collectionClass]
    });
    Ember.run(function() {
      view.appendTo('#qunit-fixture');
    });
    collection = view._childLayers[0];
  },
  teardown: function() {
    Ember.run(function() {
      view.destroy();      
    });
  }
});

test("child layers are instantiated and added", function() {
  equal(collection._childLayers.length, 4,
    "three child layers should be created");
});

test("item with location should be added to map", function() {
  var firstMarker = collection._childLayers[0];
  equal(firstMarker._layer._map, view._layer);
  locationsEqual(firstMarker.get('content.location'), locations.nyc);
  locationsEqual(firstMarker._layer.getLatLng(), locations.nyc);  
});

test("item with null location should be created but not added to map",
    function() {
  var fourthMarker = collection._childLayers[3];
  equal(fourthMarker.get('content.location'), null);
  equal(fourthMarker._layer, null);  
});

test("adding an object", function() {
  content.addObject({location: locations.paris});
  equal(collection._childLayers.length, 5);
  locationsEqual(collection._childLayers[4].get('content.location'), 
    locations.paris);
  locationsEqual(collection._childLayers[4]._layer.getLatLng(),
    locations.paris);
});

test("removing an object", function() {
  Ember.run(function() {
    content.removeObject(content[1]);    
  });
  equal(collection._childLayers.length, 3);
  locationsEqual(collection._childLayers[1].get('content.location'),
    locations.chicago);
  locationsEqual(collection._childLayers[1]._layer.getLatLng(),
    locations.chicago);
});

test("changing object's location updates marker", function() {
  content.objectAt(0).set('location', locations.paris);
  locationsEqual(collection._childLayers[0].get('location'),
    locations.paris);
  locationsEqual(collection._childLayers[0]._layer.getLatLng(),
    locations.paris);
});

test("nullifying object's location removes marker", function() {
  content.objectAt(0).set('location', null);
  equal(collection._childLayers[0].get('location'), null,
    "Location should be nullified.");
  equal(collection._childLayers[0]._layer, null,
    "Marker should be removed.");
});

test("un-nullify objects' location", function() {
  content.objectAt(3).set('location', locations.chicago);
  locationsEqual(collection._childLayers[3].get('location'),
    locations.chicago, "Location should be updated");
  ok(!!collection._childLayers[3]._layer, "Marker should be added to map");
  equal(collection._childLayers[3]._layer._map, view._layer);
});

test("changing content", function() {
  var newContent = Ember.A([
    {location: locations.paris},
    {location: locations.nyc}]);
  Ember.run(function() {
    collection.set('content', newContent);    
  });
  equal(collection._childLayers.length, 2);
  locationsEqual(collection._childLayers[0].get('content.location'),
    locations.paris);
  locationsEqual(collection._childLayers[1].get('content.location'),
    locations.nyc);  
});

test("destroy", function() {
  Ember.run(function() {
    collection._destroyLayer();
  });
  equal(collection._childLayers.length, 0);
});
