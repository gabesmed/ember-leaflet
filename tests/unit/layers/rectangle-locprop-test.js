import Ember from 'ember';
import RectangleLayer from '../../../layers/rectangle';
import { moduleForComponent, test } from 'ember-qunit';
import locationsEqual from '../../helpers/locations-equal';
import locations from '../../helpers/locations';

var content, rectangle, RectangleClass, component;

moduleForComponent('ember-leaflet', 'RectangleLayer with location property', {
  beforeEach: function() {
    content = Ember.A([
      Ember.Object.create({where: locations.chicago}),
      Ember.Object.create({where: locations.sf}),
      Ember.Object.create({where: locations.nyc})
    ]);
    RectangleClass = RectangleLayer.extend({
      locationProperty: 'where'
    });
    rectangle = RectangleClass.create({
      content: content
    });
    component = this.subject();
    component.set('childLayers', [rectangle]);
    this.render();
  }
});

test('rectangle is created', function(assert) {
  assert.ok(!!rectangle._layer);
  assert.equal(rectangle._layer._map, component._layer);
});

test('locations match', function(assert) {
  var _layerBounds = rectangle._layer.getBounds();
  locationsEqual(assert, _layerBounds.getSouthWest(), locations.sf);
  assert.equal(_layerBounds.getNorth(), locations.chicago.lat);
  assert.equal(_layerBounds.getEast(), locations.nyc.lng);
  var locationLatLngs = rectangle.get('locations');
  locationsEqual(assert, locationLatLngs[0], locations.chicago);
  locationsEqual(assert, locationLatLngs[1], locations.sf);
  locationsEqual(assert, locationLatLngs[2], locations.nyc);
});

test('replace content updates rectangle', function(assert) {
  rectangle.set('content', Ember.A([
    {where:locations.paris},
    {where:locations.nyc}]));
  locationsEqual(assert, rectangle.get('locations')[0], locations.paris);
  locationsEqual(assert, rectangle.get('locations')[1], locations.nyc);
  var _layerBounds = rectangle._layer.getBounds();
  locationsEqual(assert, _layerBounds.getSouthWest(), locations.nyc);
  locationsEqual(assert, _layerBounds.getNorthEast(), locations.paris);
});

test('remove location from content updates rectangle', function(assert) {
  content.popObject();
  locationsEqual(assert, rectangle._layer.getBounds().getNorthEast(),
    locations.chicago);
  assert.equal(rectangle.get('locations.length'), content.length);
});

test('add location to content updates rectangle', function(assert) {
  content.pushObject({where:locations.paris});
  locationsEqual(assert, rectangle._layer.getBounds().getNorthEast(),
    locations.paris);
  assert.equal(rectangle.get('locations.length'), content.length);
});

test('replace location in content updates rectangle', function(assert) {
  content[1].set('where', locations.paris);
  locationsEqual(assert, rectangle.get('locations')[1], locations.paris);
  var _layerBounds = rectangle._layer.getBounds();
  locationsEqual(assert, _layerBounds.getNorthEast(), locations.paris);
  assert.equal(_layerBounds.getWest(), locations.chicago.lng);
  assert.equal(_layerBounds.getSouth(), locations.nyc.lat);
});

test('nullify location in content updates rectangle', function(assert) {
  content[1].set('where', null);
  assert.equal(rectangle.get('locations.length'), 2);
  var _layerBounds = rectangle._layer.getBounds();
  locationsEqual(assert, _layerBounds.getNorthWest(), locations.chicago);
  locationsEqual(assert, _layerBounds.getSouthEast(), locations.nyc);
});
