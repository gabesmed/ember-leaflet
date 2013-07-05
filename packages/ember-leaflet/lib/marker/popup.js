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
    this.openPopup();
  },

  _onDragStartClosePopup: function(e) {
    this.closePopup();
  },

  openPopup: function() {
    this.willOpenPopup();
    this._popup
      .setLatLng(this._layer.getLatLng())
      .setContent(this.get('popupContent'))
      .openOn(this._layer._map);
    this.didOpenPopup();    
  },

  closePopup: function() {
    this.willClosePopup();
    this._layer._map.closePopup();
    this.didClosePopup();    
  },

  willOpenPopup: Ember.K,
  didOpenPopup: Ember.K,

  willClosePopup: Ember.K,
  didClosePopup: Ember.K,

  willCreatePopup: Ember.K,
  didCreatePopup: Ember.K,

  willDestroyPopup: Ember.K,
  didDestroyPopup: Ember.K,

  _createPopup: function() {
    this.willCreatePopup();
    this._popup = L.popup(this.get('popupOptions'));
    this.didCreatePopup();
  },

  _destroyPopup: function() {
    if(!this._popup) { return; }
    this.willDestroyPopup();
    if(this._popup._map && this._layer && this._layer._map) {
      this._layer._map.closePopup(); }
    this._popup = null;
    this.didDestroyPopup();
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
