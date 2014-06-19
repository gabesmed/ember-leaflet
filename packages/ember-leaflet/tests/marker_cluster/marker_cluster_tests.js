require('ember-leaflet/~tests/test_helper');

var view, collection, cluster, content, map,
  locationsEqual = window.locationsEqual, locations = window.locations;

module("EmberLeaflet.MarkerClusterLayer (clustered)", {
  setup: function() {
    content = Ember.A([
      Ember.Object.create({location: L.latLng(40.714704, -74.000108)}),
      Ember.Object.create({location: L.latLng(40.714639, -73.989551)}),
      Ember.Object.create({location: L.latLng(40.721372, -73.991611)}),
      Ember.Object.create({location: null})
    ]);
    var collectionClass = EmberLeaflet.MarkerCollectionLayer.extend({
      content: content
    });
    var clusterClass = EmberLeaflet.MarkerClusterLayer.extend({
      childLayers: [collectionClass]
    });
    view = EmberLeaflet.MapView.create({
      options: {maxZoom: 18},
      zoom: 13,
      center: L.latLng(40.7189000170401, -73.9944648742675),
      childLayers: [clusterClass]
    });
    Ember.run(function() {
      view.appendTo('#qunit-fixture');
    });
    map = view._layer;
    cluster = view._childLayers[0];
    collection = cluster._childLayers[0];
  },
  teardown: function() {
    Ember.run(function() {
      view.destroy();
    });
  }
});

test("initially clustered", function() {
  equal(view.get('zoom'), 13);
  equal(cluster._layer._topClusterLevel._childCount, 3,
    "has three children");
  equal(map._panes.markerPane.childNodes.length, 1,
    "one cluster in map");
  equal(Ember.$(map._panes.markerPane.childNodes[0]).text(), "3",
    "cluster says 3");
});

asyncTest("zoom in", 6, function() {
  view.set('zoom', 14);
  setTimeout(function() {
    equal(map._panes.markerPane.childNodes.length, 4,
      "three markers in map");
    var clusterMarker = map._panes.markerPane.childNodes[0];
    ok(Ember.$(clusterMarker).hasClass('marker-cluster'));
    equal(Ember.$(clusterMarker).css('opacity'), 0, 'cluster faded out');
    var markers = map._panes.markerPane.childNodes;
    equal(Ember.$(markers[1]).css('opacity'), 1, 'markers faded in');
    equal(Ember.$(markers[2]).css('opacity'), 1, 'markers faded in');
    equal(Ember.$(markers[3]).css('opacity'), 1, 'markers faded in');
    start();
  }, 250);
});

test("adding an object updates cluster", function() {
  content.addObject({location: L.latLng(40.71463, -73.98951)});
  equal(cluster._layer._topClusterLevel._childCount, 4,
    "has four children");
  equal(Ember.$(map._panes.markerPane.childNodes[0]).text(), "4",
    "cluster says 4");
});

test("removing an object updates cluster", function() {
  Ember.run(function() {
    content.removeObject(content[1]);    
  });
  equal(cluster._layer._topClusterLevel._childCount, 2,
    "has two children");
  equal(Ember.$(map._panes.markerPane.childNodes[0]).text(), "2",
    "cluster says 2");
});

test("replacing an object splits cluster", function() {
  Ember.run(function() {
    content.replace(0, 1, [{location: L.latLng(40.736004, -73.993644)}]);
  });
  equal(map._panes.markerPane.childNodes.length, 2,
    "two markers: cluster and marker");
  ok(collection._childLayers[0]._layer._icon,
    "new split marker should have icon");
  equal(collection._childLayers[1]._layer._icon, undefined,
    "other two markers should be hidden in cluster");
  equal(collection._childLayers[2]._layer._icon, undefined,
    "other two markers should be hidden in cluster");
});

test("moving object splits cluster", function() {
  Ember.run(function() {
    content[0].set('location', L.latLng(40.736004, -73.993644));
  });
  equal(map._panes.markerPane.childNodes.length, 2,
    "two markers: cluster and marker");
  ok(collection._childLayers[0]._layer._icon,
    "new split marker should have icon");
  equal(collection._childLayers[1]._layer._icon, undefined,
    "other two markers should be hidden in cluster");
  equal(collection._childLayers[2]._layer._icon, undefined,
    "other two markers should be hidden in cluster");
});

test("nullifying object's location updates cluster", function() {
  content[0].set('location', null);
  equal(cluster._layer._topClusterLevel._childCount, 2,
    "has two children");
  equal(Ember.$(map._panes.markerPane.childNodes[0]).text(), "2",
    "cluster says 2");
});

test("un-nullifying objects' location updates cluster", function() {
  content[3].set('location', L.latLng(40.714704, -74.000108));
  equal(cluster._layer._topClusterLevel._childCount, 4,
    "has four children");
  equal(Ember.$(map._panes.markerPane.childNodes[0]).text(), "4",
    "cluster says 4");
});

test("changing content updates cluster", function() {
  var newContent = Ember.A([{location: L.latLng(40.714704, -74.000108)}]);
  Ember.run(function() {
    collection.set('content', newContent);
  });
  equal(cluster._layer._topClusterLevel._childCount, 1,
    "has one child");
  equal(map._panes.markerPane.childNodes.length, 1,
    "one marker in map");
});

test("destroy", function() {
  Ember.run(function() {
    cluster._destroyLayer();
  });
  equal(cluster._childLayers.length, 0);
  equal(Ember.$('.marker-cluster').length, 0);
  view._childLayers = [];
});

module("EmberLeaflet.MarkerClusterLayer (unclustered)", {
  setup: function() {
    content = Ember.A([
      Ember.Object.create({location: L.latLng(40.714704, -74.000108)}),
      Ember.Object.create({location: L.latLng(40.714639, -73.989551)}),
      Ember.Object.create({location: L.latLng(40.721372, -73.991611)}),
      Ember.Object.create({location: null})
    ]);
    var collectionClass = EmberLeaflet.MarkerCollectionLayer.extend({
      content: content
    });
    var clusterClass = EmberLeaflet.MarkerClusterLayer.extend({
      childLayers: [collectionClass]
    });
    view = EmberLeaflet.MapView.create({
      options: {maxZoom: 18},
      zoom: 14,
      center: L.latLng(40.7189000170401, -73.9944648742675),
      childLayers: [clusterClass]
    });
    Ember.run(function() {
      view.appendTo('#qunit-fixture');
    });
    map = view._layer;
    cluster = view._childLayers[0];
    collection = cluster._childLayers[0];
  },
  teardown: function() {
    Ember.run(function() {
      view.destroy();
    });
  }
});

test("initially unclustered", function() {
  equal(view.get('zoom'), 14);
  equal(cluster._layer._topClusterLevel._childCount, 3,
    "has three children");
  equal(map._panes.markerPane.childNodes.length, 3,
    "three markers on map");
});

asyncTest("zoom out", 6, function() {
  view.set('zoom', 3);
  setTimeout(function() {
    equal(map._panes.markerPane.childNodes.length, 4,
      "four layers on map");
    var clusterMarker = map._panes.markerPane.childNodes[3];
    ok(Ember.$(clusterMarker).hasClass('marker-cluster'));
    equal(Ember.$(clusterMarker).css('opacity'), 1, 'cluster faded in');
    var markers = map._panes.markerPane.childNodes;
    equal(Ember.$(markers[0]).css('opacity'), 0, 'markers faded out');
    equal(Ember.$(markers[1]).css('opacity'), 0, 'markers faded out');
    equal(Ember.$(markers[2]).css('opacity'), 0, 'markers faded out');
    start();        
  }, 250);
});

test("adding an object adds a marker", function() {
  // location is not near any other markers but inside map area.
  content.addObject({location: L.latLng(40.721752, -73.999895)});
  equal(map._panes.markerPane.childNodes.length, 4,
    "map has four markers");
});

test("removing an object updates cluster", function() {
  Ember.run(function() {
    content.removeObject(content[1]);    
  });
  equal(map._panes.markerPane.childNodes.length, 2,
    "map has two markers");
});

test("replacing an object moves marker", function() {
  var newLoc = L.latLng(40.736004, -73.993644);
  Ember.run(function() {
    content.replace(0, 1, [{location: newLoc}]);
  });
  equal(map._panes.markerPane.childNodes.length, 3,
    "map still has three markers");
  locationsEqual(collection._childLayers[0]._layer.getLatLng(), newLoc);
});

test("moving an object moves marker", function() {
  var newLoc = L.latLng(40.736004, -73.993644);
  Ember.run(function() {
    content[0].set('location', newLoc);
  });
  equal(map._panes.markerPane.childNodes.length, 3,
    "map still has three markers");
  locationsEqual(collection._childLayers[0]._layer.getLatLng(), newLoc);
});

test("nullifying object's location removes marker", function() {
  content[0].set('location', null);
  equal(map._panes.markerPane.childNodes.length, 2,
    "map has two markers");
});

test("un-nullifying objects' location adds marker", function() {
  var newLoc = L.latLng(40.736004, -73.993644);
  content[3].set('location', newLoc);
  equal(map._panes.markerPane.childNodes.length, 4,
    "map now has four markers");
  locationsEqual(collection._childLayers[3]._layer.getLatLng(), newLoc);
});

test("changing content updates markers", function() {
  var newLoc = L.latLng(40.736004, -73.993644);
  var newContent = Ember.A([{location: newLoc}]);
  Ember.run(function() {
    collection.set('content', newContent);
  });
  equal(map._panes.markerPane.childNodes.length, 1,
    "map now has one marker");
  locationsEqual(collection._childLayers[0]._layer.getLatLng(), newLoc);
});

test("destroy", function() {
  Ember.run(function() {
    cluster._destroyLayer();
  });
  equal(cluster._childLayers.length, 0);
  equal(Ember.$('.marker-cluster').length, 0);
  view._childLayers = [];
});
