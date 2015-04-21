import Ember from 'ember';
import convert from 'ember-leaflet/utils/convert';
import { module, test } from 'qunit';
import locationsEqual from '../../helpers/locations-equal';
import locations from '../../helpers/locations';

module('convert helpers', {});

test('[lat, lng] to L.LatLng', function(assert) {
  assert.deepEqual(convert.latLngArrayFromLatLng(locations.sf),
    [locations.sf.lat, locations.sf.lng]);
  assert.equal(convert.latLngArrayFromLatLng(null), null);
});

test('[lng, lat] to L.LatLng', function(assert) {
  assert.deepEqual(convert.lngLatArrayFromLatLng(locations.sf),
    [locations.sf.lng, locations.sf.lat]);
  assert.equal(convert.latLngArrayFromLatLng(null), null);
});

test('L.LatLng to [lng, lat]', function(assert) {
  locationsEqual(assert, convert.latLngFromLngLatArray(
    [locations.sf.lng, locations.sf.lat]), locations.sf);
  assert.equal(convert.latLngFromLngLatArray(null), null);
});

test('L.LatLng to [lat, lng]', function(assert) {
  locationsEqual(assert, convert.latLngFromLatLngArray(
    [locations.sf.lat, locations.sf.lng]), locations.sf);
  assert.equal(convert.latLngFromLatLngArray(null), null);
});
