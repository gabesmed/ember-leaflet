var get = Ember.get, forEach = Ember.EnumerableUtils.forEach;

/**
  `EmberLeaflet.BoundsMixin` provides the ability to get a collection's
  bounds by its contents.
 
  @class BoundsMixin
  @namespace EmberLeaflet
  @extends Ember.Mixin
*/
EmberLeaflet.BoundsMixin = Ember.Mixin.create({
  bounds: Ember.computed(function() {
    var latLngs = [], latLng;
    forEach(this, function(childLayer) {
      if(latLng = get(childLayer, 'location')) { latLngs.push(latLng); }
    });
    return Ember.isEmpty(latLngs) ? null : new L.LatLngBounds(latLngs);
  }).property('@each.location')
});
