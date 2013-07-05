require('ember-leaflet/~tests/test_helper');

var view, collection, content, locationsEqual = window.locationsEqual,
  locations = window.locations, controller;

var n = [-15.780148, -47.92917],
    w = [-15.782102, -47.936869],
    s = [-15.786108, -47.931933],
    e = [-15.783423, -47.924638];

module("EmberLeaflet.BoundsMixin", {
  setup: function() {
    content = Ember.A([
      Ember.Object.create({location: L.latLng(n)}),
      Ember.Object.create({location: L.latLng(w)}),
      Ember.Object.create({location: L.latLng(s)}),
      Ember.Object.create({location: null}),
      Ember.Object.create({location: L.latLng(e)})
    ]);
    collection = Ember.ArrayProxy
      .extend(EmberLeaflet.BoundsMixin, {})
      .create({content: content});
  },
  teardown: function() {}
});

test("bounds initializes ok", function() {
  var bounds = collection.get('bounds');
  ok(bounds, "bounds should be initialized");
  equal(bounds.getSouth(), s[0]);
  equal(bounds.getNorth(), n[0]);
  equal(bounds.getWest(), w[1]);
  equal(bounds.getEast(), e[1]);
});

test("add an object updates bounds", function() {
  var e2 = [-15.782515, -47.914295]; // further east
  content.pushObject(Ember.Object.create({location: L.latLng(e2)}));
  equal(collection.get('bounds').getEast(), e2[1]);
});

test("remove an object updates bounds", function() {
  content.splice(3, 2);
  // now northernmost (first) point is most eastward
  equal(collection.get('bounds').getEast(), n[1]);
});

test("clear content empties bounds", function() {
  content.clear();
  equal(collection.get('bounds'), null);
});

test("clear child layers empties bounds", function() {
  collection.set('content', Ember.A());
  equal(collection.get('bounds'), null);
});


module("EmberLeaflet.BoundsMixin with non-standard location key", {
  setup: function() {
    content = Ember.A([
      Ember.Object.create({lastSeenAt: n}),
      Ember.Object.create({lastSeenAt: w}),
      Ember.Object.create({lastSeenAt: s}),
      Ember.Object.create({lastSeenAt: null}),
      Ember.Object.create({lastSeenAt: e})
    ]);
    var collectionClass = EmberLeaflet.MarkerCollectionLayer.extend({
      content: content,
      itemLayerClass: EmberLeaflet.MarkerLayer.extend({
        location: EmberLeaflet.computed.latLngFromLatLngArray(
          'content.lastSeenAt')
      })
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

test("bounds initializes ok", function() {
  var bounds = collection.get('bounds');
  ok(bounds, "bounds should be initialized");
  equal(bounds.getSouth(), s[0]);
  equal(bounds.getNorth(), n[0]);
  equal(bounds.getWest(), w[1]);
  equal(bounds.getEast(), e[1]);
});

test("add an object updates bounds", function() {
  var e2 = [-15.782515, -47.914295]; // further east
  content.pushObject(Ember.Object.create({lastSeenAt: e2}));
  equal(collection.get('bounds').getEast(), e2[1]);
});

test("remove an object updates bounds", function() {
  Ember.run(function() {
    content.replace(3, 2);    
  });
  // now northernmost (first) point is most eastward
  equal(collection.get('bounds').getEast(), n[1]);
});

test("clear content empties bounds", function() {
  Ember.run(function() {
    content.clear();
  });
  equal(collection.get('bounds'), null);
});

test("nullify content empties bounds", function() {
  Ember.run(function() {
    collection.set('content', null);
  });
  equal(collection.get('bounds'), null);
});
