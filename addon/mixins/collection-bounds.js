import Ember from 'ember';
import BoundsMixin from './bounds';

/**
 * `CollectionBoundsMixin` provides bounding box functionality
 * to a collection layer.
 *
 * @class CollectionBoundsMixin
 * @extends Ember.Mixin
 * @uses BoundsMixin
 */
export default Ember.Mixin.create(BoundsMixin, {

  locations: Ember.computed('@each.location', function() {
    return this.filterProperty('location').mapProperty('location');
  })

});
