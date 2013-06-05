
/**
MarkerCollectionLayer
*/
EmberLeaflet.MarkerCollectionLayer = EmberLeaflet.CollectionLayer.extend({
  itemLayerClass: EmberLeaflet.MarkerLayer,

  bounds: Ember.computed(function() {
    var latLngs = (this.get('content')
      .filterProperty('location')
      .mapProperty('location'));
    return Ember.isEmpty(latLngs) ? null : new L.LatLngBounds(latLngs);
  }).property('content.@each.location')
});
