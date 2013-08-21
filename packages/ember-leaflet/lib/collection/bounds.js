/**
  `EmberLeaflet.CollectionBoundsMixin` provides bounding box functionality
  to a collection layer.
 
  @class CollectionBoundsMixin
  @namespace EmberLeaflet
  @extends Ember.Mixin
  @uses EmberLeaflet.BoundsMixin
*/
EmberLeaflet.CollectionBoundsMixin = Ember.Mixin.create(
    EmberLeaflet.BoundsMixin, {
  
  locations: Ember.computed('@each.location', function() {
    return this.filterProperty('location').mapProperty('location');
  })

});
