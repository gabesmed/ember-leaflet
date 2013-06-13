var get = Ember.get, set = Ember.set, setProperties = Ember.setProperties;

/**
  `EmberLeaflet.PopupMixin` adds popup functionality to any
  `EmberLeaflet.Layer` class.
 
  @class PopupMixin
  @namespace EmberLeaflet
*/
EmberLeaflet.PopupMixin = Ember.Mixin.create({
  popupContent: 'default popup content',
  popupOptions: {},
  
  _onClick: function(e) {
    this._popup
      .setLatLng(e.latlng)
      .setContent(this.get('popupContent'))
      .openOn(this._layer._map);
  },

  _createPopup: function() {
    this._popup = L.popup(this.get('popupOptions'));
  },

  _destroyPopup: function() {
    if(!this._popup) { return; }
    delete this._popup;
  },

  layerWillChange: Ember.beforeObserver(function() {
    if(!this._layer) { return; }
    this._layer.off('click', this._onClick, this);
    this._destroyPopup();
  }, 'layer'),

  layerDidChange: Ember.observer(function() {
    if(!this._layer) { return; }
    this._createPopup();
    this._layer.on('click', this._onClick, this);
  }, 'layer')

});
