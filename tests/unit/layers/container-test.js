import Ember from 'ember';
import ContainerLayer from 'ember-leaflet/layers/container';
import EmptyLayer from 'ember-leaflet/layers/empty';
import { moduleForComponent, test } from 'ember-qunit';

var component;

moduleForComponent('leaflet-map', 'ContainerLayer', {
  beforeEach: function() {
    component = this.subject();
    component.set('childLayers', [
      EmptyLayer.extend({aNumber: 1}),
      EmptyLayer.create({aNumber: 2})
    ]);
    this.render();
  }
});

test('child layers are instantiated and added', function(assert) {
  assert.equal(component._childLayers.length, 2, 'two child layers should be created');
  assert.equal(component._childLayers[0].get('aNumber'), 1,
    'classes should be added and instantiated');
  assert.equal(component._childLayers[1].get('aNumber'), 2,
    'instances should be copied');
});

test('child layers are added to leaflet map', function(assert) {
  assert.equal(component._childLayers.length, 2);
  assert.equal(component.get('length'), 2, 'view should instantiate length');
  assert.equal(component._childLayers[0]._layer._map, component._layer);
  assert.equal(component._childLayers[1]._layer._map, component._layer);
});

test('child layers are destroyed on removal', function(assert) {
  Ember.run(function() {
    component._destroyLayer();
  });
  assert.equal(component._childLayers.length, 0);
  assert.equal(component.get('length'), 0, 'length property should be updated.');
});

test('add child layers by adding to ContainerLayer', function(assert) {
  component.pushObject(EmptyLayer.extend({aNumber: 3}));
  assert.equal(component._childLayers.length, 3);
  assert.equal(component.get('length'), 3);
});

test('remove child layers by removing from ContainerLayer', function(assert) {
  component.removeObject(component._childLayers[0]);
  assert.equal(component._childLayers.length, 1);
  assert.equal(component.get('length'), 1);
  assert.equal(component._childLayers[0].get('aNumber'), 2);
});

test('array observers are fired on add', function(assert) {
  assert.expect(6);
  var receiver = Ember.Object.create({
    arrayWillChange: function(array, idx, removedCount, addedCount) {
      assert.equal(idx, 2);
      assert.equal(removedCount, 0);
      assert.equal(addedCount, 1);
    },
    arrayDidChange: function(array, idx, removedCount, addedCount) {
      assert.equal(idx, 2);
      assert.equal(removedCount, 0);
      assert.equal(addedCount, 1);
    }
  });
  component.addArrayObserver(receiver);
  component.pushObject(EmptyLayer.extend({aNumber: 3}));
  component.removeArrayObserver(receiver);
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
  component.addArrayObserver(receiver);
  Ember.run(function() {
    component.removeAt(1);
  });
  component.removeArrayObserver(receiver);
});
