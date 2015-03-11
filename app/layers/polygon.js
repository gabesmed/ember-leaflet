import Ember from 'ember';
import PolylineLayer from './polyline';

var get = Ember.get;

export default PolylineLayer.extend({
  _newLayer: function() {
    return L.polygon(get(this, 'locations'), get(this, 'options'));
  }
});
