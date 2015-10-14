import Ember from 'ember';
import PolylineLayer from './polyline';

const { get } = Ember;

/**
 * `PolygonLayer` is a polygon on the map that adjusts based
 * on a content object that should be an array of LatLng objects.
 *
 * @class PolygonLayer
 * @extends PolylineLayer
 */
export default PolylineLayer.extend({
  _newLayer() {
    return L.polygon(get(this, 'locations'), get(this, 'options'));
  }
});
