import Ember from 'ember';
import PolylineLayer from 'ember-leaflet/layers/polyline';
import { moduleForComponent, test } from 'ember-qunit';
import locationsEqual from '../../helpers/locations-equal';
import locations from '../../helpers/locations';

var content, polyline, PolylineClass, component;

moduleForComponent('leaflet-map', 'PolylineLayer with location property', {
  beforeEach: function() {
    content = Ember.A([
      Ember.Object.create({where: locations.chicago}),
      Ember.Object.create({where: locations.sf}),
      Ember.Object.create({where: locations.nyc}),
      Ember.Object.create({where: null}),
      Ember.Object.create()
    ]);
    PolylineClass = PolylineLayer.extend({
      locationProperty: 'where'
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
  polyline.set('content', Ember.A([{where: locations.paris}]));
  assert.equal(polyline.get('locations').length, 1);
  assert.equal(polyline._layer.getLatLngs().length, 1);
  locationsEqual(assert, polyline.get('locations')[0], locations.paris);
  locationsEqual(assert, polyline._layer.getLatLngs()[0], locations.paris);
});

test('remove item from content updates polyline', function(assert) {
  content.replace(2, 1, []);
  assert.equal(polyline._layer.getLatLngs().length, 2);
  assert.equal(polyline.get('locations').length, 2);
});

test('add item to content updates polyline', function(assert) {
  content.pushObject({where: locations.paris});
  assert.equal(polyline._layer.getLatLngs().length, 4);
  assert.equal(polyline.get('locations').length, 4);
  locationsEqual(assert, polyline.get('locations')[3], locations.paris);
  locationsEqual(assert, polyline._layer.getLatLngs()[3], locations.paris);
});

test('nullify location in content updates polyline', function(assert) {
  content[2].set('where', null);
  assert.equal(polyline.get('locations.length'), 2);
  assert.equal(polyline._layer.getLatLngs().length, 2);
});

test('un-nullify location in content updates polyline', function(assert) {
  content[3].set('where', locations.paris);
  assert.equal(polyline.get('locations.length'), 4);
  assert.equal(polyline._layer.getLatLngs().length, 4);
  locationsEqual(assert, polyline.get('locations')[3], locations.paris);
  locationsEqual(assert, polyline._layer.getLatLngs()[3], locations.paris);
});

test('update location in content updates polyline', function(assert) {
  content[2].set('where', locations.paris);
  locationsEqual(assert, polyline.get('locations')[2], locations.paris);
  locationsEqual(assert, polyline._layer.getLatLngs()[2], locations.paris);
});
