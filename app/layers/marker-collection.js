import CollectionLayer from './collection';
import MarkerLayer from './marker';

/**
 * `MarkerCollectionLayer` is a specific collection layer
 * containing marker objects.
 *
 * @class MarkerCollectionLayer
 * @extends CollectionLayer
 */
export default CollectionLayer.extend({
  itemLayerClass: MarkerLayer
});
