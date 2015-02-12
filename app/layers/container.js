import Ember from 'ember';
import ContainerLayerMixin from '../mixins/container-layer';
/**
  A `ContainerLayer` is an empty collection layer that you can programmatically
  add new layers to.
  @class ContainerLayer
  @namespace EmberLeaflet
  @uses EmberLeaflet.ContainerLayerMixin
*/
export default Ember.Object.extend(
    ContainerLayerMixin, {
  /**
  Default _newLayer calls L.layerGroup to allow adding of new layers.
  */
  _newLayer: function() { return L.layerGroup(); }
});
