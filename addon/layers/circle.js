import Ember from 'ember';
import PointPathLayer from './point';
import convert from '../utils/convert';

const { get } = Ember;

/**
 * `CircleLayer` is a circle on the map that adjusts based
 * on a content object that should be an array of LatLng objects.
 *
 * @class CircleLayer
 * @extends PointPathLayer
 */
export default PointPathLayer.extend({

  /**
  If this property is null, watch the content object for radius updates.
  If this property is set, look inside this property of the content object
  for the radius.
  */
  radius: Ember.computed.alias('content.radius'),

  _updateLayerOnRadiusChange: Ember.observer('radius', function() {
    const newRadius = get(this, 'radius');

    if(newRadius && !this._layer) {
      this._createLayer();
    } else if(this._layer && !newRadius) {
      this._destroyLayer();
    } else {
      const oldRadius = this._layer && this._layer.getRadius();
      if(oldRadius && newRadius && (oldRadius !== newRadius)) {
        this._layer.setRadius(newRadius);
      }
    }
  }),

  _newLayer() {
    // Convert from array if an array somehow got through.
    return L.circle(convert.latLngFromLatLngArray(get(this, 'location')),
      get(this, 'radius'), get(this, 'options'));
  },

  _destroyLayer() {
    if(!this._layer) { return; }
    this._super();
  }
});
