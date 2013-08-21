var get = Ember.get;

/**
  `EmberLeaflet.RectangleLayer` is a rectangle on the map that adjusts based
  on a content object that should be an array of LatLng objects.
 
  @class RectangleLayer
  @namespace EmberLeaflet
  @extends EmberLeaflet.PolylineLayer
*/
EmberLeaflet.RectangleLayer = EmberLeaflet.BoundingGeometryLayer.extend({
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
  }, 'bounds')
});
