import Ember from 'ember';
import ArrayPathLayer from './array-path';
import BoundsMixin from '../mixins/bounds';

var get = Ember.get;

/**
 * `RectangleLayer` is a rectangle on the map that adjusts based
 * on a content object that should be an array of LatLng objects.
 *
 * @class RectangleLayer
 * @extends ArrayPathLayer
 * @uses BoundsMixin
 */
export default ArrayPathLayer.extend(BoundsMixin, {

  events: ['click', 'dblclick', 'mousedown', 'mouseover', 'mouseout',
    'contextmenu', 'add', 'remove', 'popupopen', 'popupclose'],

  _newLayer: function() {
    return L.rectangle(get(this, 'bounds'), get(this, 'options'));
  },

  _createLayer: function() {
    if(!get(this, 'bounds')) { return; }
    this._super();
  },

  boundsDidChange: Ember.observer(function() {
    var bounds = get(this, 'bounds');
    if(this._layer && !bounds) {
      this._destroyLayer();
    } else if(bounds && !this._layer) {
      this._createLayer();
    } else if(bounds && this._layer) {
      this._layer.setBounds(bounds);
    }
  }, 'locations')
});
