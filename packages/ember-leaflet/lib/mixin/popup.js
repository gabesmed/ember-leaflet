var get = Ember.get, set = Ember.set, setProperties = Ember.setProperties;

/**
  `EmberLeaflet.PopupMixin` adds popup functionality to any
  `EmberLeaflet.Layer` class.
 
  @class PopupMixin
  @namespace EmberLeaflet
*/
EmberLeaflet.PopupMixin = Ember.Mixin.create({
  popupContent: '',
  popupViewClass: null,
  popupOptions: {offset: L.point(0, -36)},
  
  click: function(e) {
    if(this._super) { this._super(e); }
    this.openPopup(e);
  },

  dragstart: function(e) {
    if(this._super) { this._super(e); }
    this.closePopup();
  },

  openPopup: function(e) {
    this.willOpenPopup();
    var latLng;
    if (this._layer.getLatLng) { latLng = this._layer.getLatLng(); }
    else { latLng = L.latLngBounds(this._layer.getLatLngs()).getCenter(); }
    this._popup
      .setLatLng((e && e.latlng) || latLng)
      .openOn(this._layer._map);
    this._createPopupContent();
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

  _createPopupContent: function() {
    if(!this.get('popupViewClass')) {
      this._popup.setContent(this.get('popupContent'));
      return;
    }
    if(this._popupView) { this._destroyPopupContent(); }
    this._popupView = this.get('popupViewClass').create({
      container: this.get('container'),
      controller: this.get('controller'),
      context: this.get('controller')
    });
    var self = this;
    this._popupView._insertElementLater(function() {
      self._popupView.$().appendTo(self._popup._contentNode);
    });
  },

  _destroyPopupContent: function() {
    if(!this.get('popupViewClass')) { return; }
    if(this._popupView) {
      this._popupView.destroy();
      this._popupView = null;
    }
  },

  _createPopup: function() {
    this.willCreatePopup();
    this._popup = L.popup(this.get('popupOptions'), this._layer);
    var oldOnRemove = this._popup.onRemove, self = this;
    this._popup.onRemove = function(map) {
      self._destroyPopupContent();
      oldOnRemove.call(self._popup, map);
    };
    this.didCreatePopup();
  },

  _destroyPopup: function() {
    if(!this._popup) { return; }
    this.willDestroyPopup();
    // closing popup will call _destroyPopupContent
    if(this._popup._map && this._layer && this._layer._map) {
      this._layer._map.closePopup(); }
    this._popup = null;
    this.didDestroyPopup();
  },

  _updatePopup: Ember.observer(function() {
    if(!this._popup) { return; }
    this._popup.setContent(get(this, 'popupContent'));
  }, 'popupContent'),

  _removePopupObservers: Ember.beforeObserver(function() {
    if(!this._layer) { return; }
    this._destroyPopup();
  }, 'layer'),

  _addPopupObservers: Ember.observer(function() {
    if(!this._layer) { return; }
    this._createPopup();
  }, 'layer')
});
