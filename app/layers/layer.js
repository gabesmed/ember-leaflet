import Ember from 'ember';
import LayerMixin from '../mixins/layer';
/**
  `EmberLeaflet.Layer` is a convenience object for those who prefer
  creating layers with `EmberLeaflet.Layer.extend(...)` rather than
  `Ember.Object.extend(EmberLeaflet.LayerMixin, ...)`.
  @class Layer
  @namespace EmberLeaflet
*/
export default Ember.Object.extend(LayerMixin, {});
