import Layer from './layer';

/**
 * `EmberLeaflet.EmptyLayer` is a null layer mostly for testing.
 *
 * @class EmptyLayer
 * @extends Layer
 */
export default Layer.extend({
  _newLayer() { return L.layerGroup([]); }
});
