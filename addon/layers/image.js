import Ember from 'ember';
import Layer from './layer';
import computed from '../utils/computed';

const { get } = Ember;

/**
 * `imageOverlay` is a layer with a single image.
 *
 * @class imageOverlay
 * @extends Layer
 */

export default Layer.extend({
  imageUrl: null,
  bounds: null,
  options: null,

  _newLayer() {
    return L.imageOverlay(get(this,'imageUrl'), get(this,'bounds'), get(this, 'options'));
  },

  urlDidChange: Ember.observer('imageUrl', function() {
    if(!this._layer) { return; }
    this._layer.setUrl(this.get('imageUrl'));
  }),

  opacity: computed.optionProperty()
});
