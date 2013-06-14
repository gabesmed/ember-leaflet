/**
  `EmberLeaflet.BoundsMixin` provides the ability to get a collection's
  bounds by its contents.
 
  @class BoundsMixin
  @namespace EmberLeaflet
  @extends Ember.Mixin
*/
EmberLeaflet.BoundsMixin = Ember.Mixin.create({
  bounds: Ember.computed(function() {
    var latLngs = this.get('content')
      .filterProperty('location')
      .mapProperty('location');
    return Ember.isEmpty(latLngs) ? null : new L.LatLngBounds(latLngs);
  }).property('content.@each.location')
});
