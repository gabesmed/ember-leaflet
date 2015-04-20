import Ember from 'ember';
import PathLayer from '../../../layers/path';
import { moduleForComponent, test } from 'ember-qunit';
import locations from '../../helpers/locations';

var content, pathClass, path, component, get = Ember.get;

moduleForComponent('leaflet-map', 'PathLayer', {
  beforeEach: function() {
    content = Ember.Object.create({location: locations.sf, radius:10});
    pathClass = PathLayer.extend({
      _newLayer: function() {
        return L.circle(get(this, 'content.location'),
          get(this, 'content.radius'), get(this, 'options'));
      },
      _destroyLayer: function() { if(this._layer) { this._super(); } }
    });
    path = pathClass.create({content: content});

    component = this.subject();
    component.set('childLayers', [path]);
    this.render();
  }
});

test('path is created', function(assert) {
  assert.ok(!!path._layer);
  assert.equal(path._layer._map, component._layer);
});

test('set styles through property', function(assert) {
  var values = {
    stroke: true, color: '#f00', weight: 5, opacity: 0.6, fill: true,
    fillColor: '#0f0', fillOpacity: 0.8, dashArray: '5, 10'};
  for(var key in values) {
    path.set(key, values[key]);
    assert.strictEqual(path._layer.options[key], values[key],
      key + ' option set on layer');
    assert.strictEqual(path.get('options')[key], values[key],
      key + ' option set on object');
  }
  // test SVG values set correctly.
  var svg = path._layer._path;
  assert.strictEqual(svg.getAttribute('stroke'), values.color.toString());
  assert.strictEqual(svg.getAttribute('stroke-opacity'), values.opacity.toString());
  assert.strictEqual(svg.getAttribute('stroke-width'), values.weight.toString());
  assert.strictEqual(svg.getAttribute('stroke-dasharray'), values.dashArray);
  assert.strictEqual(svg.getAttribute('fill'), values.fillColor.toString());
  assert.strictEqual(svg.getAttribute('fill-opacity'), values.fillOpacity.toString());
});

test('get styles through property', function(assert) {
  var values = {
    stroke: true, color: '#f00', weight: 5, opacity: 0.6, fill: true,
    fillColor: '#0f0', fillOpacity: 0.8, dashArray: '5, 10'};
  path._layer.setStyle(values);
  for(var key in values) {
    assert.strictEqual(path.get(key), values[key],
      key + ' option should be accessible through property');
  }
});

test('set style, then create', function(assert) {
  path._destroyLayer();
  path.set('color', '#00f');
  path._createLayer();
  assert.strictEqual(path._layer.options.color, '#00f');
});

test('create, set style, destroy & recreate', function(assert) {
  path.set('color', '#00f');
  path._destroyLayer();
  path._createLayer();
  assert.strictEqual(path._layer.options.color, '#00f');
});
