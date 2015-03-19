import Ember from 'ember';
import LayerMixin from '../mixins/layer';

/**
 * `Layer` is a convenience object for those who prefer
 * creating layers with `Layer.extend(...)` rather than
 * `Ember.Object.extend(LayerMixin, ...)`.
 *
 * @class Layer
 * @uses LayerMixin
 */
export default Ember.Object.extend(LayerMixin, {});
