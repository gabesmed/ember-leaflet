import CollectionLayer from './collection';
import MarkerLayer from './marker';

/**
  `EmberLeaflet.MarkerCollectionLayer` is a specific collection layer
  containing marker objects.

  @class MarkerCollectionLayer
  @namespace EmberLeaflet
  @extends EmberLeaflet.CollectionLayer
*/
export default CollectionLayer.extend({
  itemLayerClass: MarkerLayer
});
