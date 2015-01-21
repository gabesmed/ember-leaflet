import Layer from './layer';

/**
  `EmberLeaflet.EmptyLayer` is a null layer mostly for testing.
  @class EmptyLayer
  @namespace EmberLeaflet
*/
export default Layer.extend({
  _newLayer: function() { return L.layerGroup([]); }
});
