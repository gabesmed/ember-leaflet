import Ember from 'ember';
import BoundsPathLayer from 'ember-leaflet/layers/bounds-path';
import { module, test } from 'qunit';

var geometry, locations;
var n = [-15.780148, -47.92917],
    w = [-15.782102, -47.936869],
    s = [-15.786108, -47.931933],
    e = [-15.783423, -47.924638];

module('BoundsPathLayer', {
  beforeEach: function() {
    locations = Ember.A([
      L.latLng(n), L.latLng(w), L.latLng(s), null, L.latLng(e)
    ]);
    geometry = BoundsPathLayer.create({
      locations: locations
    });
  }
});

test('bounds initializes ok', function(assert) {
  var bounds = geometry.get('bounds');
  assert.ok(bounds, 'bounds should be initialized');
  assert.equal(bounds.getSouth(), s[0]);
  assert.equal(bounds.getNorth(), n[0]);
  assert.equal(bounds.getWest(), w[1]);
  assert.equal(bounds.getEast(), e[1]);
});

test('add an object updates bounds', function(assert) {
  var e2 = [-15.782515, -47.914295]; // further east
  locations.pushObject(L.latLng(e2));
  assert.equal(geometry.get('bounds').getEast(), e2[1]);
});

test('remove an object updates bounds', function(assert) {
  locations.splice(3, 2);
  // now northernmost (first) point is most eastward
  assert.equal(geometry.get('bounds').getEast(), n[1]);
});

test('clear locations empties bounds', function(assert) {
  locations.clear();
  assert.equal(geometry.get('bounds'), null);
});
