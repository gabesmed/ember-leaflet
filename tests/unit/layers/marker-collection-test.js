import Ember from 'ember';
import MarkerCollectionLayer from '../../../layers/marker-collection';
import EmptyLayer from '../../../layers/empty';
import { moduleForComponent, test } from 'ember-qunit';
import locationsEqual from '../../helpers/locations-equal';
import locations from '../../helpers/locations';

var component, collection, content;

moduleForComponent('leaflet-map', 'MarkerCollectionLayer', {
  beforeEach: function() {
    content = Ember.A([
      Ember.Object.create({location: locations.nyc}),
      Ember.Object.create({location: locations.sf}),
      Ember.Object.create({location: locations.chicago}),
      Ember.Object.create({location: null})
    ]);

    var collectionClass = MarkerCollectionLayer.extend({
      content: content
    });

    component = this.subject();
    component.set('childLayers', [collectionClass]);

    this.render();

    collection = component._childLayers[0];
  }
});

test('child layers are instantiated and added', function(assert) {
  assert.equal(collection._childLayers.length, 4,
    'three child layers should be created');
});

test('item with location should be added to map', function(assert) {
  var firstMarker = collection._childLayers[0];
  assert.equal(firstMarker._layer._map, component._layer);
  locationsEqual(assert, firstMarker.get('content.location'), locations.nyc);
  locationsEqual(assert, firstMarker._layer.getLatLng(), locations.nyc);
});

test('item with null location should be created but not added to map',
    function(assert) {
  var fourthMarker = collection._childLayers[3];
  assert.equal(fourthMarker.get('content.location'), null);
  assert.equal(fourthMarker._layer, null);
});

test('adding an object', function(assert) {
  content.addObject({location: locations.paris});
  assert.equal(collection._childLayers.length, 5);
  locationsEqual(assert, collection._childLayers[4].get('content.location'),
    locations.paris);
  locationsEqual(assert, collection._childLayers[4]._layer.getLatLng(),
    locations.paris);
});

test('removing an object', function(assert) {
  Ember.run(function() {
    content.removeObject(content[1]);
  });
  assert.equal(collection._childLayers.length, 3);
  locationsEqual(assert, collection._childLayers[1].get('content.location'),
    locations.chicago);
  locationsEqual(assert, collection._childLayers[1]._layer.getLatLng(),
    locations.chicago);
});

test('changing object\'s location updates marker', function(assert) {
  content.objectAt(0).set('location', locations.paris);
  locationsEqual(assert, collection._childLayers[0].get('location'),
    locations.paris);
  locationsEqual(assert, collection._childLayers[0]._layer.getLatLng(),
    locations.paris);
});

test('nullifying object\'s location removes marker', function(assert) {
  content.objectAt(0).set('location', null);
  assert.equal(collection._childLayers[0].get('location'), null,
    'Location should be nullified.');
  assert.equal(collection._childLayers[0]._layer, null,
    'Marker should be removed.');
  assert.equal(Object.keys(component._layer._layers).length, 2, 'two markers left');
});

test('un-nullify objects\' location', function(assert) {
  content.objectAt(3).set('location', locations.chicago);
  locationsEqual(assert, collection._childLayers[3].get('location'),
    locations.chicago, 'Location should be updated');
  assert.ok(!!collection._childLayers[3]._layer, 'Marker should be added to map');
  assert.equal(collection._childLayers[3]._layer._map, component._layer);
  assert.equal(Object.keys(component._layer._layers).length, 4, 'four markers now');
});

test('changing content', function(assert) {
  var newContent = Ember.A([
    {location: locations.paris},
    {location: locations.nyc}]);
  Ember.run(function() {
    collection.set('content', newContent);
  });
  assert.equal(collection._childLayers.length, 2);
  locationsEqual(assert, collection._childLayers[0].get('content.location'),
    locations.paris);
  locationsEqual(assert, collection._childLayers[1].get('content.location'),
    locations.nyc);
});

test('destroy', function(assert) {
  Ember.run(function() {
    collection._destroyLayer();
  });
  assert.equal(collection._childLayers.length, 0);
});

var controller;

moduleForComponent('leaflet-map', 'MarkerCollectionLayer and Controller', {
  beforeEach: function() {
    content = Ember.A([
      Ember.Object.create({location: locations.nyc}),
      Ember.Object.create({location: locations.sf}),
      Ember.Object.create({location: locations.chicago}),
      Ember.Object.create({location: null})
    ]);

    controller = Ember.ArrayController.create({
      content: content
    });
    var collectionClass = MarkerCollectionLayer.extend({
      contentBinding: 'controller'
    });
    component = this.subject();
    component.setProperties({
      controller: controller,
      childLayers: [collectionClass]
    });

    this.render();

    collection = component._childLayers[0];
  }
});

test('content is bound', function(assert) {
  assert.strictEqual(controller.get('content'), content,
    'controller content should be original array');
  assert.strictEqual(collection.get('content'), controller,
    'collection should refer to controller');
  assert.strictEqual(collection.get('content.content'), content,
    'collection content should be original array');
});

test('child layers are instantiated and added', function(assert) {
  assert.equal(collection._childLayers.length, 4,
    'three child layers should be created');
});

test('item with location should be added to map', function(assert) {
  var firstMarker = collection._childLayers[0];
  assert.equal(firstMarker._layer._map, component._layer);
  locationsEqual(assert, firstMarker.get('content.location'), locations.nyc);
  locationsEqual(assert, firstMarker._layer.getLatLng(), locations.nyc);
});

test('item with null location should be created but not added to map',
    function(assert) {
  var fourthMarker = collection._childLayers[3];
  assert.equal(fourthMarker.get('content.location'), null);
  assert.equal(fourthMarker._layer, null);
});

test('adding an object', function(assert) {
  content.addObject({location: locations.paris});
  assert.equal(collection._childLayers.length, 5);
  locationsEqual(assert, collection._childLayers[4].get('content.location'),
    locations.paris);
  locationsEqual(assert, collection._childLayers[4]._layer.getLatLng(),
    locations.paris);
});

test('removing an object', function(assert) {
  Ember.run(function() {
    content.removeObject(content[1]);
  });
  assert.equal(collection._childLayers.length, 3);
  locationsEqual(assert, collection._childLayers[1].get('content.location'),
    locations.chicago);
  locationsEqual(assert, collection._childLayers[1]._layer.getLatLng(),
    locations.chicago);
});

test('changing object\'s location updates marker', function(assert) {
  content.objectAt(0).set('location', locations.paris);
  locationsEqual(assert, collection._childLayers[0].get('location'),
    locations.paris);
  locationsEqual(assert, collection._childLayers[0]._layer.getLatLng(),
    locations.paris);
});

test('nullifying object\'s location removes marker', function(assert) {
  content.objectAt(0).set('location', null);
  assert.equal(collection._childLayers[0].get('location'), null,
    'Location should be nullified.');
  assert.equal(collection._childLayers[0]._layer, null,
    'Marker should be removed.');
});

test('un-nullify objects\' location', function(assert) {
  content.objectAt(3).set('location', locations.chicago);
  locationsEqual(assert, collection._childLayers[3].get('location'),
    locations.chicago, 'Location should be updated');
  assert.ok(!!collection._childLayers[3]._layer, 'Marker should be added to map');
  assert.equal(collection._childLayers[3]._layer._map, component._layer);
});

test('changing content', function(assert) {
  var newContent = Ember.A([
    {location: locations.paris},
    {location: locations.nyc}]);
  Ember.run(function() {
    controller.set('content', newContent);
  });
  assert.equal(collection._childLayers.length, 2);
  locationsEqual(assert, collection._childLayers[0].get('content.location'),
    locations.paris);
  locationsEqual(assert, collection._childLayers[1].get('content.location'),
    locations.nyc);
});
