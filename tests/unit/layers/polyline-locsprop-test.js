import Ember from 'ember';
import PolylineLayer from '../../../layers/polyline';
import { moduleForComponent, test } from 'ember-qunit';
import locationsEqual from '../../helpers/locations-equal';
import locations from '../../helpers/locations';

var content, polyline, PolylineClass, component;

moduleForComponent('ember-leaflet', 'PolylineLayer with locations property', {
  beforeEach: function() {
    content = Ember.Object.create({
      path: Ember.A([locations.chicago, locations.sf, locations.nyc])
    });
    PolylineClass = PolylineLayer.extend({
      locationsProperty: 'path'
    });
    polyline = PolylineClass.create({
      content: content
    });
    component = this.subject();
    component.set('childLayers', [polyline]);
    this.render();
  }
});

test('polyline is created', function(assert) {
  assert.ok(!!polyline._layer);
  assert.equal(polyline._layer._map, component._layer);
});

test('locations match', function(assert) {
  var _layerLatLngs = polyline._layer.getLatLngs();
  locationsEqual(assert, _layerLatLngs[0], locations.chicago);
  locationsEqual(assert, _layerLatLngs[1], locations.sf);
  locationsEqual(assert, _layerLatLngs[2], locations.nyc);
  var locationLatLngs = polyline.get('locations');
  locationsEqual(assert, locationLatLngs[0], locations.chicago);
  locationsEqual(assert, locationLatLngs[1], locations.sf);
  locationsEqual(assert, locationLatLngs[2], locations.nyc);
});

test('replace content updates polyline', function(assert) {
  polyline.set('content', Ember.Object.create({
    path: Ember.A([locations.paris])
  }));
  assert.equal(polyline.get('locations').length, 1);
  assert.equal(polyline._layer.getLatLngs().length, 1);
  locationsEqual(assert, polyline.get('locations')[0], locations.paris);
  locationsEqual(assert, polyline._layer.getLatLngs()[0], locations.paris);
});

test('replace array updates polyline', function(assert) {
  polyline.set('content.path', Ember.A([locations.paris]));
  assert.equal(polyline.get('locations').length, 1);
  assert.equal(polyline._layer.getLatLngs().length, 1);
  locationsEqual(assert, polyline.get('locations')[0], locations.paris);
  locationsEqual(assert, polyline._layer.getLatLngs()[0], locations.paris);
});

test('remove location from content updates polyline', function(assert) {
  content.get('path').popObject();
  assert.equal(polyline._layer.getLatLngs().length, content.get('path').length);
  assert.equal(polyline.get('locations').length, content.get('path').length);
});

test('add location to content updates polyline', function(assert) {
  content.get('path').pushObject(locations.paris);
  assert.equal(polyline._layer.getLatLngs().length, content.get('path').length);
  assert.equal(polyline.get('locations').length, content.get('path').length);
  locationsEqual(assert, polyline.get('locations')[3], locations.paris);
  locationsEqual(assert, polyline._layer.getLatLngs()[3], locations.paris);
});

test('move location in content moves polyline', function(assert) {
  content.get('path').replace(2, 1, locations.paris);
  locationsEqual(assert, polyline.get('locations')[2], locations.paris);
  locationsEqual(assert, polyline._layer.getLatLngs()[2], locations.paris);
});

test('nullify location in content updates polyline', function(assert) {
  content.get('path').replace(2, 1, null);
  assert.equal(polyline.get('locations.length'), 2);
  assert.equal(polyline._layer.getLatLngs().length, 2);
});

test('changing locations property updates', function(assert) {
  content.set('path2', Ember.A([locations.london, locations.newdelhi]));
  polyline.set('locationsProperty', 'path2');
  assert.equal(polyline.get('locations.length'), 2);
  assert.equal(polyline._layer.getLatLngs().length, 2);
  locationsEqual(assert, polyline.get('locations')[0], locations.london);
});

test('observers reassigned after changing locationsProperty', function(assert) {
  content.set('path2', Ember.A([]));
  polyline.set('locationsProperty', 'path2');
  assert.equal(polyline.get('locations.length'), 0);
  content.get('path2').pushObject(locations.london);
  assert.equal(polyline.get('locations.length'), 1);
});
