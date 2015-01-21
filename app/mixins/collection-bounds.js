import Ember from 'ember';
import BoundsMixin from './bounds';

/**
  `EmberLeaflet.CollectionBoundsMixin` provides bounding box functionality
  to a collection layer.

  @class CollectionBoundsMixin
  @namespace EmberLeaflet
  @extends Ember.Mixin
  @uses EmberLeaflet.BoundsMixin
*/
export default Ember.Mixin.create(BoundsMixin, {

  locations: Ember.computed('@each.location', function() {
    return this.filterProperty('location').mapProperty('location');
  })

});
