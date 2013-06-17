require('ember-leaflet/~tests/test_helper');

var view, collection, parent, content,
  locationsEqual = window.locationsEqual,
  locations = window.locations, locs = locations, controller, App,
  originalLookup = Ember.lookup, lookup, Adapter, adapter, serializer, store;

module("EmberLeaflet.MarkerCollectionLayer with Ember Data", {
  setup: function() {

    Adapter = DS.Adapter.extend();
    Adapter.registerTransform('latlng', {
      deserialize: function(v) { return v; },
      serialize: function(v) { return v; }
    });
    adapter = Adapter.create();
    store = DS.Store.create({adapter: adapter});
    lookup = Ember.lookup = {};

    App = Ember.Namespace.create({name: 'App'});
    App.POI = DS.Model.extend({
      location: DS.attr('latlng')
    });
    App.POIList = DS.Model.extend({
      cities: DS.hasMany(App.POI)
    });
    App.POI.reopen({
      list: DS.belongsTo(App.POIList)
    });
    lookup.App = {POI: App.POI, POIList: App.POIList};

    Ember.run(function() {
      store.loadMany(App.POI, [
        {id: 'nyc', location: [locs.nyc.lng, locs.nyc.lat]},
        {id: 'sf', location: [locs.sf.lng, locs.sf.lat]},
        {id: 'chicago', location: [locs.chicago.lng, locs.chicago.lat]},
        {id: 'noloc', location: null}
      ]);
      store.load(App.POIList, {
        id: 'POIs',
        cities: ['nyc', 'sf', 'chicago', 'noloc']
      });
      parent = App.POIList.find('POIs');
      content = parent.get('cities');
    });
    controller = Ember.ArrayController.create({
      content: content
    });
    var markerClass = EmberLeaflet.MarkerLayer.extend({
      location: EmberLeaflet.computed.latLngFromLngLatArray(
        'content.location')
    });
    var collectionClass = EmberLeaflet.MarkerCollectionLayer.extend({
      contentBinding: 'controller',
      itemLayerClass: markerClass
    });
    view = EmberLeaflet.MapView.create({
      controller: controller,
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
      adapter.destroy();
      store.destroy();
    });
    Ember.lookup = originalLookup;
  }
});

test("child layers are instantiated and added", function() {
  equal(parent.get('cities.length'), 4);
  equal(content.get('length'), 4);
  equal(collection._childLayers.length, 4,
    "three child layers should be created");
});

test("item with location should be added to map", function() {
  var firstMarker = collection._childLayers[0];
  equal(firstMarker._layer._map, view._layer);
  deepEqual(firstMarker.get('content.location'), [
    locs.nyc.lng, locs.nyc.lat]);
  locationsEqual(firstMarker.get('location'), locations.nyc);
  locationsEqual(firstMarker._layer.getLatLng(), locations.nyc);  
});

test("item with null location should be created but not added to map",
    function() {
  var fourthMarker = collection._childLayers[3];
  equal(fourthMarker.get('location'), null);
  equal(fourthMarker._layer, null);  
});

test("adding a record", function() {
  Ember.run(function() {
    store.createRecord(App.POI, {
      list: parent, location: [locs.paris.lng, locs.paris.lat], id: 'paris'
    });    
  });
  equal(collection._childLayers.length, 5);
  locationsEqual(collection._childLayers[4].get('location'), locs.paris);
  locationsEqual(collection._childLayers[4]._layer.getLatLng(), locs.paris);
});

test("removing a record", function() {
  Ember.run(function() {
    App.POI.find('sf').deleteRecord();
  });
  equal(collection._childLayers.length, 3);
  locationsEqual(collection._childLayers[1].get('location'), locs.chicago);
  locationsEqual(collection._childLayers[1]._layer.getLatLng(),
    locs.chicago);
});

test("changing record's location updates marker", function() {
  Ember.run(function() {
    App.POI.find('nyc').set('location', [locs.paris.lng, locs.paris.lat]);
  });
  locationsEqual(collection._childLayers[0].get('location'), locs.paris);
  locationsEqual(collection._childLayers[0]._layer.getLatLng(), locs.paris);
});

test("nullifying record's location removes marker", function() {
  Ember.run(function() {
    App.POI.find('nyc').set('location', null);
  });
  equal(collection._childLayers[0].get('location'), null,
    "Location should be nullified.");
  equal(collection._childLayers[0]._layer, null,
    "Marker should be removed.");
});

test("un-nullify records' location", function() {
  Ember.run(function() {
    App.POI.find('noloc').set('location', 
      [locs.chicago.lng, locs.chicago.lat]);
  });
  locationsEqual(collection._childLayers[3].get('location'),
    locations.chicago, "Location should be updated");
  ok(!!collection._childLayers[3]._layer, "Marker should be added to map");
  equal(collection._childLayers[3]._layer._map, view._layer);
});
