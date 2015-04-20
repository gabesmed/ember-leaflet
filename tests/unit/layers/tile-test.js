import Ember from 'ember';
import TileLayer from '../../../layers/tile';
import { moduleForComponent, test } from 'ember-qunit';

var component;

moduleForComponent('leaflet-map', 'TileLayer', {
  beforeEach: function() {
    component = this.subject();
    component.set('childLayers',  [
      TileLayer.extend({
        tileUrl: 'http://a.tiles.mapbox.com/v3/examples.map-zr0njcqy/{z}/{x}/{y}.png'
      })
    ]);
    this.render();
  }
});

test('tile layer is added', function(assert) {
  var tileLayer = component._childLayers[0];
  assert.equal(tileLayer._layer._url, 'http://a.tiles.mapbox.com/v3/examples.map-zr0njcqy/{z}/{x}/{y}.png');
});

test('update url', function(assert) {
  var tileLayer = component._childLayers[0];
  tileLayer.set('tileUrl', 'newUrl');
  assert.equal(tileLayer._layer._url, 'newUrl');
});

test('update opacity', function(assert) {
  var tileLayer = component._childLayers[0];
  tileLayer.set('opacity', 0.5);
  assert.equal(tileLayer._layer.options.opacity, 0.5);
});

test('update zIndex', function(assert) {
  var tileLayer = component._childLayers[0];
  tileLayer.set('zIndex', 100);
  assert.equal(tileLayer._layer.options.zIndex, 100);
});
