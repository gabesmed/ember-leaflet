var view, collection, content;

module("EmberLeaflet.CollectionLayer", {
  setup: function() {
    content = Ember.A([{number: 1}, {number: 2}, {number: 3}]);
    var collectionClass = EmberLeaflet.CollectionLayer.extend({
      itemLayerClass: EmberLeaflet.EmptyLayer,
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
  equal(collection._childLayers.length, 3,
    "three child layers should be created");
  equal(collection._childLayers[0].get('content.number'), 1);
});

test("child layers accessible by property", function() {
  equal(collection.get('childLayers.length'), 3);
});

test("array observers are fired on add", function() {
  expect(6);
  var receiver = Ember.Object.create({
    arrayWillChange: function(array, idx, removedCount, addedCount) {
      equal(idx, 3);
      equal(removedCount, 0);
      equal(addedCount, 1);
    },
    arrayDidChange: function(array, idx, removedCount, addedCount) {
      equal(idx, 3);
      equal(removedCount, 0);
      equal(addedCount, 1);
    }
  });
  collection.addArrayObserver(receiver);
  content.addObject({number: 4});
  collection.removeArrayObserver(receiver);
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
  collection.addArrayObserver(receiver);
  Ember.run(function() {
    content.removeAt(1);
  });
  collection.removeArrayObserver(receiver);
});

test("adding an object", function() {
  content.addObject({number: 4});
  equal(collection._childLayers.length, 4);
  equal(collection._childLayers[3].get('content.number'), 4);
});

test("removing an object", function() {
  Ember.run(function() {
    content.removeObject(content[1]);    
  });
  equal(collection._childLayers.length, 2);
  equal(collection._childLayers[1].get('content.number'), 3);
});

test("changing content", function() {
  var newContent = Ember.A([{number: 6}, {number: 7}]);
  Ember.run(function() {
    collection.set('content', newContent);    
  });
  equal(collection._childLayers.length, 2);
  equal(collection._childLayers[0].get('content.number'), 6);
  equal(collection._childLayers[1].get('content.number'), 7);  
});

test("destroy", function() {
  Ember.run(function() {
    collection._destroyLayer();
  });
  equal(collection._childLayers.length, 0);
});
