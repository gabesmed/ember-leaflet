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
    var content = get(this, 'content');
    if(!content || !Ember.isArray(content)) { return null; }
    var latLngs = [], latLng;
    forEach(content, function(item) {
      if(latLng = get(item, 'location')) { latLngs.push(latLng); }
    });
    return Ember.isEmpty(latLngs) ? null : new L.LatLngBounds(latLngs);
  }).property('content.@each.location')
});
