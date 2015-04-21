import Ember from 'ember';
import computed from 'ember-leaflet/utils/computed';
import { module, test } from 'qunit';
import locationsEqual from '../../helpers/locations-equal';
import locations from '../../helpers/locations';

var obj, get = Ember.get, set = Ember.set;

module('computed.latLngFromLatLngArray', {
  beforeEach: function() {
    obj = Ember.Object.extend({
      // array in lat, lng format
      loc1: [locations.nyc.lat, locations.nyc.lng],

      // array in lng, lat format
      loc2: [locations.chicago.lng, locations.chicago.lat],

      latLng1: computed.latLngFromLatLngArray('loc1'),
      latLng2: computed.latLngFromLngLatArray('loc2')
    }).create();
  }
});

test('[lat, lng] to L.LatLng', function(assert) {
  locationsEqual(assert, get(obj, 'latLng1'), locations.nyc);
  set(obj, 'loc1', [locations.sf.lat, locations.sf.lng]);
  locationsEqual(assert, get(obj, 'latLng1'), locations.sf);
});

test('[lng, lat] to L.LatLng', function(assert) {
  locationsEqual(assert, get(obj, 'latLng2'), locations.chicago);
  set(obj, 'loc2', [locations.sf.lng, locations.sf.lat]);
  locationsEqual(assert, get(obj, 'latLng2'), locations.sf);
});

test('L.LatLng to [lng, lat]', function(assert) {
  set(obj, 'latLng1', locations.sf);
  assert.deepEqual(get(obj, 'loc1'), [locations.sf.lat, locations.sf.lng]);
});

test('L.LatLng to [lat, lng]', function(assert) {
  set(obj, 'latLng2', locations.sf);
  assert.deepEqual(get(obj, 'loc2'), [locations.sf.lng, locations.sf.lat]);
});
