import Ember from 'ember';

var get = Ember.get;

/**
 * `BoundsMixin` provides the ability to get a collection's
 * bounds by its `locations` property.
 *
 * @class BoundsMixin
 * @extends Ember.Mixin
 */
export default Ember.Mixin.create({

  /** Calculate bounds, or if object is already a bounds, return it. */
  bounds: Ember.computed(function() {
    var locations = get(this, 'locations');
    if (locations instanceof L.LatLngBounds) { return locations; }
    if(!locations || !get(locations, 'length')) { return null; }
    return L.latLngBounds(locations);
  }).property('locations').volatile()
});
