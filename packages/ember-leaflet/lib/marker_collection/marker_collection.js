/**
  `EmberLeaflet.MarkerCollectionLayer` is a specific collection layer
  containing marker objects.
 
  @class MarkerCollectionLayer
  @namespace EmberLeaflet
  @extends EmberLeaflet.CollectionLayer
  @uses EmberLeaflet.BoundsMixin
*/
EmberLeaflet.MarkerCollectionLayer = EmberLeaflet.CollectionLayer.extend(
    EmberLeaflet.BoundsMixin, {
  itemLayerClass: EmberLeaflet.MarkerLayer
});
