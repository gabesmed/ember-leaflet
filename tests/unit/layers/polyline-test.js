import Ember from 'ember';
import PolylineLayer from 'ember-leaflet/layers/polyline';
import { moduleForComponent, test } from 'ember-qunit';
import locationsEqual from '../../helpers/locations-equal';
import locations from '../../helpers/locations';

var content, polyline, PolylineClass, component;

moduleForComponent('leaflet-map', 'PolylineLayer', {
  beforeEach: function() {
    content = Ember.A([locations.chicago, locations.sf, locations.nyc]);
    PolylineClass = PolylineLayer.extend({});
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
  polyline.set('content', Ember.A([locations.paris]));
  assert.equal(polyline.get('locations').length, 1);
  assert.equal(polyline._layer.getLatLngs().length, 1);
  locationsEqual(assert, polyline.get('locations')[0], locations.paris);
  locationsEqual(assert, polyline._layer.getLatLngs()[0], locations.paris);
});

test('setting location to array of arrays works', function(assert) {
  polyline.set('content', Ember.A([
    [locations.paris.lat, locations.paris.lng],
    [locations.sf.lat, locations.sf.lng],
    [locations.chicago.lat, locations.chicago.lng]
  ]));
  locationsEqual(assert, polyline.get('locations')[1], locations.sf);
  locationsEqual(assert, polyline._layer.getLatLngs()[1], locations.sf);
});

test('remove item from content updates polyline', function(assert) {
  content.popObject();
  assert.equal(polyline._layer.getLatLngs().length, content.length);
  assert.equal(polyline.get('locations').length, content.length);
});

test('add item to content updates polyline', function(assert) {
  content.pushObject(locations.paris);
  assert.equal(polyline._layer.getLatLngs().length, content.length);
  assert.equal(polyline.get('locations').length, content.length);
});

test('replace item in content moves polyline', function(assert) {
  content.replace(2, 1, locations.paris);
  locationsEqual(assert, polyline.get('locations')[2], locations.paris);
  locationsEqual(assert, polyline._layer.getLatLngs()[2], locations.paris);
});

test('nullify item in content updates polyline', function(assert) {
  content.replace(2, 1, null);
  assert.equal(polyline.get('locations.length'), 2);
  assert.equal(polyline._layer.getLatLngs().length, 2);
});
