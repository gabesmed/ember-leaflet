import Ember from 'ember';
import CircleLayer from '../../../layers/circle';
import { moduleForComponent, test } from 'ember-qunit';
import locationsEqual from '../../helpers/locations-equal';
import locations from '../../helpers/locations';

var content, circle, component;

moduleForComponent('leaflet-map', 'CircleLayer', {
  beforeEach: function() {
    content = Ember.Object.create({location: locations.sf, radius:10});
    circle = CircleLayer.create({
      content: content
    });

    component = this.subject();
    component.set('childLayers', [circle]);
    this.render();
  }
});

test('circle is created', function(assert) {
  assert.ok(!!circle._layer);
  assert.equal(circle._layer._map, component._layer);
});

test('locations match', function(assert) {
  var _layerLocation = circle._layer.getLatLng();
  locationsEqual(assert, _layerLocation, locations.sf);
  var locationLatLng = circle.get('location');
  locationsEqual(assert, locationLatLng, locations.sf);
});

test('radius match', function(assert) {
  var _layerRadius = circle._layer.getRadius();
  assert.equal(_layerRadius, 10);
  var locationRadius = circle.get('radius');
  assert.equal(locationRadius, 10);
});

test('set location to null clears circle', function(assert) {
  circle.set('location', null);
  assert.equal(circle._layer, null);
  assert.equal(content.get('location'), null);
});

test('move location in content moves circle', function(assert) {
  content.set('location', locations.chicago);
  locationsEqual(assert, circle.get('location'), locations.chicago);
  locationsEqual(assert, circle._layer.getLatLng(), locations.chicago);
});

test('move location to array moves circle', function(assert) {
  content.set('location', [locations.sf.lat, locations.sf.lng]);
  assert.deepEqual(circle.get('location'), [locations.sf.lat, locations.sf.lng],
    'location is still array');
  locationsEqual(assert, circle._layer.getLatLng(), locations.sf,
    'but circle center is converted to latLng before going to leatlet');
});

test('change radius in content changes circle radius', function(assert) {
  content.set('radius', 20);
  assert.equal(circle.get('radius'), 20);
  assert.equal(circle._layer.getRadius(), 20);
});

test('nullify location in content clears circle', function(assert) {
  content.set('location', null);
  assert.equal(circle.get('location'), null);
  assert.equal(circle._layer, null);
});

test('circle with null location should not create leaflet obj', function(assert) {
  var newCircle = CircleLayer.create({
    content: {location: null, radius: 10}
  });
  component.pushObject(newCircle);
  assert.equal(newCircle._layer, null);
});

test('circle with null radius should create leaflet obj', function(assert) {
  var newCircle = CircleLayer.create({
    content: {location: locations.sf, radius: null}
  });
  Ember.run(function() {
    component.pushObject(newCircle);
  });
  assert.ok(newCircle._layer);
  assert.equal(newCircle._layer._mRadius, null);
});
