import Ember from 'ember';
import Layer from './layer';
import computed from '../utils/computed';

var get = Ember.get;

/**
 * `imageOverlay` is a layer with a single image.
 *
 * @class imageOverlay
 * @extends Layer
 */

export default Layer.extend({
  imageUrl: null,
  imageBounds: null,
  options: null,

  _newLayer: function() {
    return L.imageOverlay(get(this,'imageUrl'), get(this,'imageBounds'), get(this, 'options'));
  },

  imageUrlDidChange: Ember.observer('imageUrl', function() {
    if(!this._layer) { return; }
    this._layer.setUrl(this.get('imageUrl'));
  }),

  opacity: computed.optionProperty()
});
