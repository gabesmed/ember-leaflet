import Ember from 'ember';
import Layer from './layer';
import computed from '../utils/computed';


var get = Ember.get;

/**
 * `TileLayer` is a tile set.
 *
 * @class TileLayer
 * @extends Layer
 */
export default Layer.extend({
  tileUrl: null,
  options: {},
  _newLayer: function() {
    return L.tileLayer(get(this, 'tileUrl'), get(this, 'options'));
  },

  tileUrlDidChange: Ember.observer('tileUrl', function() {
    if(!this._layer) { return; }
    this._layer.setUrl(this.get('tileUrl'));
  }),

  zIndex: computed.optionProperty(),
  opacity: computed.optionProperty()
});
