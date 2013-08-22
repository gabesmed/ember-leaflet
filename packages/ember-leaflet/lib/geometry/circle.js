var get = Ember.get;

/**
  `EmberLeaflet.CircleLayer` is a circle on the map that adjusts based
  on a content object that should be an array of LatLng objects.
 
  @class CircleLayer
  @namespace EmberLeaflet
  @extends EmberLeaflet.PointGeometryLayer
*/
EmberLeaflet.CircleLayer = EmberLeaflet.PointGeometryLayer.extend({
  
  /**
  If this property is null, watch the content object for radius updates.
  If this property is set, look inside this property of the content object
  for the radius.
  */
  radius: Ember.computed.alias('content.radius'),
  
  _updateLayerOnRadiusChange: Ember.observer(function() {
    var newRadius = get(this, 'radius');
      
    if(newRadius && !this._layer) {
      this._createLayer();
    } else if(this._layer && !newRadius) {
      this._destroyLayer();
    } else {
      var oldRadius = this._layer && this._layer.getRadius();
      if(oldRadius && newRadius && (oldRadius !== newRadius)) {
        this._layer.setRadius(newRadius);
      }
    }
  }, 'radius'),
  
  _newLayer: function() {
    return L.circle(get(this, 'location'), get(this, 'radius'),
      get(this, 'options'));
  }, 
  
  _destroyLayer: function() {
    if(!this._layer) { return; }
    this._super();
  }
});
