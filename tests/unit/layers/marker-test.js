import Ember from 'ember';
import MarkerLayer from '../../../layers/marker';
import computed from '../../../utils/computed';
import { moduleForComponent, test } from 'ember-qunit';
import locationsEqual from '../../helpers/locations-equal';
import locations from '../../helpers/locations';

var content, marker, MarkerClass, component;

//Needed to silence leaflet autodetection error
L.Icon.Default.imagePath = 'some-path';

moduleForComponent('leaflet-map', 'MarkerLayer', {
  beforeEach: function() {
    content = Ember.Object.create({loc: locations.nyc});
    MarkerClass = MarkerLayer.extend({
      location: Ember.computed.alias('content.loc')
    });
    marker = MarkerClass.create({
      content: content
    });

    component = this.subject();
    component.set('childLayers', [marker]);

    this.render();
  }
});

test('marker is created', function(assert) {
  assert.ok(!!marker._layer);
  assert.equal(marker._layer._map, component._layer);
});

test('location matches', function(assert) {
  locationsEqual(assert, marker._layer.getLatLng(), locations.nyc);
  locationsEqual(assert, marker.get('location'), locations.nyc);
});

test('set location to null clears marker', function(assert) {
  marker.set('location', null);
  assert.equal(marker._layer, null);
  assert.equal(content.get('loc'), null);
});

test('move location in content moves marker', function(assert) {
  content.set('loc', locations.sf);
  locationsEqual(assert, marker.get('location'), locations.sf);
  locationsEqual(assert, marker._layer.getLatLng(), locations.sf);
});

test('nullify location in content clears marker', function(assert) {
  content.set('loc', null);
  assert.equal(marker.get('location'), null);
  assert.equal(marker._layer, null);
});

test('get & set opacity', function(assert) {
  assert.equal(marker.get('opacity'), 1.0);
  marker.set('opacity', 0.5);
  assert.equal(marker.get('opacity'), 0.5, 'opacity was updated in object');
  assert.equal(marker._layer.options.opacity, 0.5,
    'opacity was updated in options');
  assert.equal(Ember.$(marker._layer._icon).css('opacity'), 0.5,
    'opacity was updated in stylesheet');
});

test('get & set zIndexOffset', function(assert) {
  marker._layer.update();
  var initZIndex = parseInt(Ember.$(marker._layer._icon).css('z-index'), 10);
  assert.equal(marker.get('zIndexOffset'), 0);
  marker.set('zIndexOffset', 4);
  assert.equal(marker.get('zIndexOffset'), 4, 'zIndexOffset updated in object');
  assert.equal(marker._layer.options.zIndexOffset, 4,
    'zIndexOffset updated in options');
  assert.equal(Ember.$(marker._layer._icon).css('zIndex'), initZIndex + 4,
    'zIndex was updated in stylesheet');
});

moduleForComponent('leaflet-map', 'MarkerLayer with conversion', {
  beforeEach: function() {
    content = Ember.Object.create({
      loc: [locations.nyc.lat, locations.nyc.lng]
    });
    MarkerClass = MarkerLayer.extend({
      location: computed.latLngFromLatLngArray('content.loc')
    });
    marker = MarkerClass.create({
      content: content
    });
    component = this.subject();
    component.set('childLayers', [marker]);

    this.render();
  }
});

test('location matches', function(assert) {
  locationsEqual(assert, marker._layer.getLatLng(), locations.nyc);
  locationsEqual(assert, marker.get('location'), locations.nyc);
});

test('setting location latLng in content moves marker', function(assert) {
  content.set('loc', L.latLng(locations.sf.lat, locations.sf.lng));
  locationsEqual(assert, marker.get('location'), locations.sf);
  locationsEqual(assert, marker._layer.getLatLng(), locations.sf);
});

test('setting location array in content moves marker', function(assert) {
  content.set('loc', [locations.sf.lat, locations.sf.lng]);
  locationsEqual(assert, marker.get('location'), locations.sf);
  locationsEqual(assert, marker._layer.getLatLng(), locations.sf);
});

test('nullify location in content clears marker', function(assert) {
  content.set('loc', null);
  assert.equal(marker.get('location'), null);
  assert.equal(marker._layer, null);
});
