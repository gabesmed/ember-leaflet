var get = Ember.get, forEach = Ember.EnumerableUtils.forEach;

/**
  `EmberLeaflet.MarkerHashLayer` is a specific collection layer
  containing marker objects.
 
  @class MarkerHashLayer
  @namespace EmberLeaflet
  @extends EmberLeaflet.HashLayer
  @uses EmberLeaflet.BoundsMixin
*/
EmberLeaflet.MarkerHashLayer = EmberLeaflet.HashLayer.extend(
    EmberLeaflet.BoundsMixin, {
  itemLayerClass: EmberLeaflet.MarkerLayer,
  hashByProperty: 'location',
  hashIsLocation: true
});
