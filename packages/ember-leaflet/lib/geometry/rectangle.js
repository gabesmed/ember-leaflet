var get = Ember.get;

/**
  `EmberLeaflet.RectangleLayer` is a rectangle on the map that adjusts based
  on a content object that should be an array of LatLng objects.
 
  @class RectangleLayer
  @namespace EmberLeaflet
  @extends EmberLeaflet.PolylineLayer
*/
EmberLeaflet.RectangleLayer = EmberLeaflet.PolylineLayer.extend({
  _newLayer: function() {
    return L.rectangle(L.latLngBounds(get(this, 'locations')),
                       get(this, 'options'));
  },

  locationsDidChange: Ember.observer(function() {
    if(!this._layer) { return; }
    this._layer.setBounds(L.latLngBounds(get(this, 'locations')));
  }, 'locations')
});
