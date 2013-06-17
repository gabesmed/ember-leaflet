var get = Ember.get, set = Ember.set, setProperties = Ember.setProperties;

/**
  `EmberLeaflet.PopupMixin` adds popup functionality to any
  `EmberLeaflet.Layer` class.
 
  @class PopupMixin
  @namespace EmberLeaflet
*/
EmberLeaflet.PopupMixin = Ember.Mixin.create({
  popupContent: 'default popup content',
  popupOptions: {offset: L.point(0, -36)},
  
  _onClickOpenPopup: function(e) {
    this._popup
      .setLatLng(e.latlng)
      .setContent(this.get('popupContent'))
      .openOn(this._layer._map);
  },

  _onDragStartClosePopup: function(e) {
    this._layer._map.closePopup();
  },

  _createPopup: function() {
    this._popup = L.popup(this.get('popupOptions'));
  },

  _destroyPopup: function() {
    if(!this._popup) { return; }
    delete this._popup;
  },

  _removePopupObservers: Ember.beforeObserver(function() {
    if(!this._layer) { return; }
    this._layer.off('click', this._onClickOpenPopup, this);
    this._layer.off('dragstart', this._onDragStartClosePopup, this);
    this._destroyPopup();
  }, 'layer'),

  _addPopupObservers: Ember.observer(function() {
    if(!this._layer) { return; }
    this._createPopup();
    this._layer.on('click', this._onClickOpenPopup, this);
    this._layer.on('dragstart', this._onDragStartClosePopup, this);
  }, 'layer')
});
