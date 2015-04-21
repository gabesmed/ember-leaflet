import Ember from 'ember';
import PolylineLayer from './polyline';

var get = Ember.get;

/**
 * `PolygonLayer` is a polygon on the map that adjusts based
 * on a content object that should be an array of LatLng objects.
 *
 * @class PolygonLayer
 * @extends PolylineLayer
 */
export default PolylineLayer.extend({
  _newLayer: function() {
    return L.polygon(get(this, 'locations'), get(this, 'options'));
  }
});
