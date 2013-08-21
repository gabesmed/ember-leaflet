var view;

module("EmberLeaflet.ContainerLayer", {
  setup: function() {
    view = EmberLeaflet.MapView.create({
      childLayers: [
        EmberLeaflet.EmptyLayer.extend({aNumber: 1}),
        EmberLeaflet.EmptyLayer.create({aNumber: 2})]
    });
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

test("child layers are instantiated and added", function() {
  equal(view._childLayers.length, 2, "two child layers should be created");
  equal(view._childLayers[0].get('aNumber'), 1, 
    "classes should be added and instantiated");
  equal(view._childLayers[1].get('aNumber'), 2,
    "instances should be copied");
});

test("child layers are added to leaflet map", function() {
  equal(view._childLayers.length, 2);
  equal(view.get('length'), 2, "view should instantiate length");
  equal(view._childLayers[0]._layer._map, view._layer);
  equal(view._childLayers[1]._layer._map, view._layer);
});

test("child layers are destroyed on removal", function() {
  Ember.run(function() {
    view._destroyLayer();    
  });
  equal(view._childLayers.length, 0);
  equal(view.get('length'), 0, 'length property should be updated.');
});

test("add child layers by adding to ContainerLayer", function() {
  view.pushObject(EmberLeaflet.EmptyLayer.extend({aNumber: 3}));
  equal(view._childLayers.length, 3);
  equal(view.get('length'), 3);
});

test("remove child layers by removing from ContainerLayer", function() {
  view.removeObject(view._childLayers[0]);
  equal(view._childLayers.length, 1);
  equal(view.get('length'), 1);
  equal(view._childLayers[0].get('aNumber'), 2);
});

test("array observers are fired on add", function() {
  expect(6);
  var receiver = Ember.Object.create({
    arrayWillChange: function(array, idx, removedCount, addedCount) {
      equal(idx, 2);
      equal(removedCount, 0);
      equal(addedCount, 1);
    },
    arrayDidChange: function(array, idx, removedCount, addedCount) {
      equal(idx, 2);
      equal(removedCount, 0);
      equal(addedCount, 1);
    }
  });
  view.addArrayObserver(receiver);
  view.pushObject(EmberLeaflet.EmptyLayer.extend({aNumber: 3}));
  view.removeArrayObserver(receiver);
});

test("array observers are fired on remove", function() {
  expect(6);
  var receiver = Ember.Object.create({
    arrayWillChange: function(array, idx, removedCount, addedCount) {
      equal(idx, 1);
      equal(removedCount, 1);
      equal(addedCount, 0);
    },
    arrayDidChange: function(array, idx, removedCount, addedCount) {
      equal(idx, 1);
      equal(removedCount, 1);
      equal(addedCount, 0);
    }
  });
  view.addArrayObserver(receiver);
  Ember.run(function() {
    view.removeAt(1);
  });
  view.removeArrayObserver(receiver);
});
