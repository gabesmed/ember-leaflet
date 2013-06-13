/**
  `EmberLeaflet.MarkerCollectionLayer` is a specific collection layer
  containing marker objects.
 
  @class MarkerCollectionLayer
  @namespace EmberLeaflet
  @extends EmberLeaflet.CollectionLayer
*/
EmberLeaflet.MarkerCollectionLayer = EmberLeaflet.CollectionLayer.extend({
  itemLayerClass: EmberLeaflet.MarkerLayer,

  bounds: Ember.computed(function() {
    var latLngs = this.get('content')
      .filterProperty('location')
      .mapProperty('location');
    return Ember.isEmpty(latLngs) ? null : new L.LatLngBounds(latLngs);
  }).property('content.@each.location')
});
