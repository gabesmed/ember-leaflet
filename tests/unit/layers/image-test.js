import Ember from 'ember';
import ImageLayer from 'ember-leaflet/layers/image';
import { moduleForComponent, test } from 'ember-qunit';

var component;

moduleForComponent('leaflet-map', 'ImageLayer', {
  beforeEach: function() {
    component = this.subject();
    component.set('childLayers',  [
      ImageLayer.extend({
        imageUrl: 'http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg',
        bounds: [[40.712216, -74.22655], [40.773941, -74.12544]]
      })
    ]);
    this.render();
  }
});

test('image layer is added', function(assert) {
  var imageLayer = component._childLayers[0];
  assert.equal(imageLayer._layer._url, 'http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg');
});

test('update url', function(assert) {
  var imageLayer = component._childLayers[0];
  imageLayer.set('imageUrl', 'newUrl');
  assert.equal(imageLayer._layer._url, 'newUrl');
});

test('update opacity', function(assert) {
  var imageLayer = component._childLayers[0];
  imageLayer.set('opacity', 0.5);
  assert.equal(imageLayer._layer.options.opacity, 0.5);
});
