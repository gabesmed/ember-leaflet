import Ember from 'ember';
import ArrayPathLayer from 'array-path';

var get = Ember.get;

/**
  `EmberLeaflet.PolylineLayer` is a polyline on the map that adjusts based
  on a content object that should be an array of LatLng objects.

  @class PolylineLayer
  @namespace EmberLeaflet
  @extends EmberLeaflet.ArrayPathLayer
*/
export default ArrayPathLayer.extend({
  options: {},

  events: ['click', 'dblclick', 'mousedown', 'mouseover', 'mouseout',
    'contextmenu', 'add', 'remove', 'popupopen', 'popupclose'],

  _newLayer: function() {
    return L.polyline(get(this, 'locations'), get(this, 'options'));
  },

  locationsDidChange: Ember.observer(function() {
    if(!this._layer) { return; }
    this._layer.setLatLngs(get(this, 'locations'));
  }, 'locations')
});
