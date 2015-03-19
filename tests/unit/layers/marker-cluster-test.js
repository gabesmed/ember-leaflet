import Ember from 'ember';
import MarkerCollectionLayer from '../../../layers/marker-collection';
import MarkerClusterLayer from '../../../layers/marker-cluster';
import { moduleForComponent, test } from 'ember-qunit';
import locationsEqual from '../../helpers/locations-equal';

var component, collection, cluster, content, map;

moduleForComponent('ember-leaflet', 'MarkerClusterLayer (clustered)', {
  beforeEach: function() {
    content = Ember.A([
      Ember.Object.create({location: L.latLng(40.714704, -74.000108)}),
      Ember.Object.create({location: L.latLng(40.714639, -73.989551)}),
      Ember.Object.create({location: L.latLng(40.721372, -73.991611)}),
      Ember.Object.create({location: null})
    ]);
    var collectionClass = MarkerCollectionLayer.extend({
      content: content
    });
    var clusterClass = MarkerClusterLayer.extend({
      childLayers: [collectionClass]
    });

    component = this.subject();
    component.setProperties({
      options: {maxZoom: 18},
      zoom: 13,
      center: L.latLng(40.7189000170401, -73.9944648742675),
      childLayers: [clusterClass]
    });

    this.render();

    map = component._layer;
    cluster = component._childLayers[0];
    collection = cluster._childLayers[0];
  }
});

test('initially clustered', function(assert) {
  assert.equal(component.get('zoom'), 13);
  assert.equal(cluster._layer._topClusterLevel._childCount, 3,
    'has three children');
  assert.equal(map._panes.markerPane.childNodes.length, 1,
    'one cluster in map');
  assert.equal(Ember.$(map._panes.markerPane.childNodes[0]).text(), '3',
    'cluster says 3');
});

test('zoom in', function(assert) {
  assert.expect(6);
  component.set('zoom', 14);
  var done = assert.async();
  setTimeout(function() {
    assert.equal(map._panes.markerPane.childNodes.length, 4,
      'three markers in map');
    var clusterMarker = map._panes.markerPane.childNodes[0];
    assert.ok(Ember.$(clusterMarker).hasClass('marker-cluster'));
    assert.equal(Ember.$(clusterMarker).css('opacity'), 0, 'cluster faded out');
    var markers = map._panes.markerPane.childNodes;
    assert.equal(Ember.$(markers[1]).css('opacity'), 1, 'markers faded in');
    assert.equal(Ember.$(markers[2]).css('opacity'), 1, 'markers faded in');
    assert.equal(Ember.$(markers[3]).css('opacity'), 1, 'markers faded in');
    done();
  }, 250);
});

test('adding an object updates cluster', function(assert) {
  content.addObject({location: L.latLng(40.71463, -73.98951)});
  assert.equal(cluster._layer._topClusterLevel._childCount, 4,
    'has four children');
  assert.equal(Ember.$(map._panes.markerPane.childNodes[0]).text(), '4',
    'cluster says 4');
});

test('removing an object updates cluster', function(assert) {
  Ember.run(function() {
    content.removeObject(content[1]);
  });
  assert.equal(cluster._layer._topClusterLevel._childCount, 2,
    'has two children');
  assert.equal(Ember.$(map._panes.markerPane.childNodes[0]).text(), '2',
    'cluster says 2');
});

test('replacing an object splits cluster', function(assert) {
  Ember.run(function() {
    content.replace(0, 1, [{location: L.latLng(40.736004, -73.993644)}]);
  });
  assert.equal(map._panes.markerPane.childNodes.length, 2,
    'two markers: cluster and marker');
  assert.ok(collection._childLayers[0]._layer._icon,
    'new split marker should have icon');
  assert.equal(collection._childLayers[1]._layer._icon, undefined,
    'other two markers should be hidden in cluster');
  assert.equal(collection._childLayers[2]._layer._icon, undefined,
    'other two markers should be hidden in cluster');
});

test('moving object splits cluster', function(assert) {
  Ember.run(function() {
    content[0].set('location', L.latLng(40.736004, -73.993644));
  });
  assert.equal(map._panes.markerPane.childNodes.length, 2,
    'two markers: cluster and marker');
  assert.ok(collection._childLayers[0]._layer._icon,
    'new split marker should have icon');
  assert.equal(collection._childLayers[1]._layer._icon, undefined,
    'other two markers should be hidden in cluster');
  assert.equal(collection._childLayers[2]._layer._icon, undefined,
    'other two markers should be hidden in cluster');
});

test('nullifying object\'s location updates cluster', function(assert) {
  content[0].set('location', null);
  assert.equal(cluster._layer._topClusterLevel._childCount, 2,
    'has two children');
  assert.equal(Ember.$(map._panes.markerPane.childNodes[0]).text(), '2',
    'cluster says 2');
});

test('un-nullifying objects\' location updates cluster', function(assert) {
  content[3].set('location', L.latLng(40.714704, -74.000108));
  assert.equal(cluster._layer._topClusterLevel._childCount, 4,
    'has four children');
  assert.equal(Ember.$(map._panes.markerPane.childNodes[0]).text(), '4',
    'cluster says 4');
});

test('changing content updates cluster', function(assert) {
  var newContent = Ember.A([{location: L.latLng(40.714704, -74.000108)}]);
  Ember.run(function() {
    collection.set('content', newContent);
  });
  assert.equal(cluster._layer._topClusterLevel._childCount, 1,
    'has one child');
  assert.equal(map._panes.markerPane.childNodes.length, 1,
    'one marker in map');
});

test('destroy', function(assert) {
  Ember.run(function() {
    cluster._destroyLayer();
  });
  assert.equal(cluster._childLayers.length, 0);
  assert.equal(Ember.$('.marker-cluster').length, 0);
  component._childLayers = [];
});

moduleForComponent('ember-leaflet', 'MarkerClusterLayer (unclustered)', {
  setup: function() {
    content = Ember.A([
      Ember.Object.create({location: L.latLng(40.714704, -74.000108)}),
      Ember.Object.create({location: L.latLng(40.714639, -73.989551)}),
      Ember.Object.create({location: L.latLng(40.721372, -73.991611)}),
      Ember.Object.create({location: null})
    ]);
    var collectionClass = MarkerCollectionLayer.extend({
      content: content
    });
    var clusterClass = MarkerClusterLayer.extend({
      childLayers: [collectionClass]
    });

    component = this.subject();
    component.setProperties({
      options: {maxZoom: 18},
      zoom: 14,
      center: L.latLng(40.7189000170401, -73.9944648742675),
      childLayers: [clusterClass]
    });

    this.render();

    map = component._layer;
    cluster = component._childLayers[0];
    collection = cluster._childLayers[0];
  }
});

test('initially unclustered', function(assert) {
  assert.equal(component.get('zoom'), 14);
  assert.equal(cluster._layer._topClusterLevel._childCount, 3,
    'has three children');
  assert.equal(map._panes.markerPane.childNodes.length, 3,
    'three markers on map');
});

test('zoom out', function(assert) {
  assert.expect(6);
  component.set('zoom', 3);
  var done = assert.async();
  setTimeout(function() {
    assert.equal(map._panes.markerPane.childNodes.length, 4,
      'four layers on map');
    var clusterMarker = map._panes.markerPane.childNodes[3];
    assert.ok(Ember.$(clusterMarker).hasClass('marker-cluster'));
    assert.equal(Ember.$(clusterMarker).css('opacity'), 1, 'cluster faded in');
    var markers = map._panes.markerPane.childNodes;
    assert.equal(Ember.$(markers[0]).css('opacity'), 0, 'markers faded out');
    assert.equal(Ember.$(markers[1]).css('opacity'), 0, 'markers faded out');
    assert.equal(Ember.$(markers[2]).css('opacity'), 0, 'markers faded out');
    done();
  }, 250);
});

test('adding an object adds a marker', function(assert) {
  // location is not near any other markers but inside map area.
  content.addObject({location: L.latLng(40.721752, -73.999895)});
  assert.equal(map._panes.markerPane.childNodes.length, 4,
    'map has four markers');
});

test('removing an object updates cluster', function(assert) {
  Ember.run(function() {
    content.removeObject(content[1]);
  });
  assert.equal(map._panes.markerPane.childNodes.length, 2,
    'map has two markers');
});

test('replacing an object moves marker', function(assert) {
  var newLoc = L.latLng(40.736004, -73.993644);
  Ember.run(function() {
    content.replace(0, 1, [{location: newLoc}]);
  });
  assert.equal(map._panes.markerPane.childNodes.length, 3,
    'map still has three markers');
  locationsEqual(assert, collection._childLayers[0]._layer.getLatLng(), newLoc);
});

test('moving an object moves marker', function(assert) {
  var newLoc = L.latLng(40.736004, -73.993644);
  Ember.run(function() {
    content[0].set('location', newLoc);
  });
  assert.equal(map._panes.markerPane.childNodes.length, 3,
    'map still has three markers');
  locationsEqual(assert, collection._childLayers[0]._layer.getLatLng(), newLoc);
});

test('nullifying object\'s location removes marker', function(assert) {
  content[0].set('location', null);
  assert.equal(map._panes.markerPane.childNodes.length, 2,
    'map has two markers');
});

test('un-nullifying objects\' location adds marker', function(assert) {
  var newLoc = L.latLng(40.736004, -73.993644);
  content[3].set('location', newLoc);
  assert.equal(map._panes.markerPane.childNodes.length, 4,
    'map now has four markers');
  locationsEqual(assert, collection._childLayers[3]._layer.getLatLng(), newLoc);
});

test('changing content updates markers', function(assert) {
  var newLoc = L.latLng(40.736004, -73.993644);
  var newContent = Ember.A([{location: newLoc}]);
  Ember.run(function() {
    collection.set('content', newContent);
  });
  assert.equal(map._panes.markerPane.childNodes.length, 1,
    'map now has one marker');
  locationsEqual(assert, collection._childLayers[0]._layer.getLatLng(), newLoc);
});

test('destroy', function(assert) {
  Ember.run(function() {
    cluster._destroyLayer();
  });
  assert.equal(cluster._childLayers.length, 0);
  assert.equal(Ember.$('.marker-cluster').length, 0);
  component._childLayers = [];
});
