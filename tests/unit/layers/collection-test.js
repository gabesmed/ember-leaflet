import Ember from 'ember';
import CollectionLayer from '../../../layers/collection';
import EmptyLayer from '../../../layers/empty';
import { moduleForComponent, test } from 'ember-qunit';

var component, collection, content;

moduleForComponent('ember-leaflet', 'CollectionLayer', {
  beforeEach: function() {
    content = Ember.A([{number: 1}, {number: 2}, {number: 3}]);
    var collectionClass = CollectionLayer.extend({
      itemLayerClass: EmptyLayer,
      content: content
    });

    component = this.subject();
    component.set('childLayers', [collectionClass]);

    this.render();

    collection = component._childLayers[0];
  }
});

test('child layers are instantiated and added', function(assert) {
  assert.equal(collection._childLayers.length, 3,
    'three child layers should be created');
  assert.equal(collection._childLayers[0].get('content.number'), 1);
});

test('child layers accessible by property', function(assert) {
  assert.equal(collection.get('childLayers.length'), 3);
});

test('array observers are fired on add', function(assert) {
  assert.expect(6);
  var receiver = Ember.Object.create({
    arrayWillChange: function(array, idx, removedCount, addedCount) {
      assert.equal(idx, 3);
      assert.equal(removedCount, 0);
      assert.equal(addedCount, 1);
    },
    arrayDidChange: function(array, idx, removedCount, addedCount) {
      assert.equal(idx, 3);
      assert.equal(removedCount, 0);
      assert.equal(addedCount, 1);
    }
  });
  collection.addArrayObserver(receiver);
  content.addObject({number: 4});
  collection.removeArrayObserver(receiver);
});

test('array observers are fired on remove', function(assert) {
  assert.expect(6);
  var receiver = Ember.Object.create({
    arrayWillChange: function(array, idx, removedCount, addedCount) {
      assert.equal(idx, 1);
      assert.equal(removedCount, 1);
      assert.equal(addedCount, 0);
    },
    arrayDidChange: function(array, idx, removedCount, addedCount) {
      assert.equal(idx, 1);
      assert.equal(removedCount, 1);
      assert.equal(addedCount, 0);
    }
  });
  collection.addArrayObserver(receiver);
  Ember.run(function() {
    content.removeAt(1);
  });
  collection.removeArrayObserver(receiver);
});

test('adding an object', function(assert) {
  content.addObject({number: 4});
  assert.equal(collection._childLayers.length, 4);
  assert.equal(collection._childLayers[3].get('content.number'), 4);
});

test('removing an object', function(assert) {
  Ember.run(function() {
    content.removeObject(content[1]);
  });
  assert.equal(collection._childLayers.length, 2);
  assert.equal(collection._childLayers[1].get('content.number'), 3);
});

test('changing content', function(assert) {
  var newContent = Ember.A([{number: 6}, {number: 7}]);
  Ember.run(function() {
    collection.set('content', newContent);
  });
  assert.equal(collection._childLayers.length, 2);
  assert.equal(collection._childLayers[0].get('content.number'), 6);
  assert.equal(collection._childLayers[1].get('content.number'), 7);
});

test('destroy', function(assert) {
  Ember.run(function() {
    collection._destroyLayer();
  });
  assert.equal(collection._childLayers.length, 0);
});
