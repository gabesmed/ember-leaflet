import Ember from 'ember';

const {
  get,
  run
} = Ember;
const { schedule } = run;

/**
 * `PopupMixin` adds popup functionality to any
 * `Layer` class.
 *
 * @class PopupMixin
 * @extends Ember.Mixin
 */
export default Ember.Mixin.create({
  popupContent: '',
  popupViewClass: null,
  popupOptions: {offset: L.point(0, -36)},

  click(e) {
    if(this._super) { this._super(e); }
    this.openPopup(e);
  },

  dragstart(e) {
    if(this._super) { this._super(e); }
    this.closePopup();
  },

  openPopup(e) {
    this.willOpenPopup();
    let latLng;
    if (this._layer.getLatLng) { latLng = this._layer.getLatLng(); }
    else { latLng = L.latLngBounds(this._layer.getLatLngs()).getCenter(); }
    this._popup
      .setLatLng((e && e.latlng) || latLng)
      .openOn(this._layer._map);
    this._createPopupContent();
    this.didOpenPopup();
  },

  closePopup() {
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

  _createPopupContent() {
    if(!get(this, 'popupViewClass')) {
      this._popup.setContent(get(this, 'popupContent'));
      return;
    }
    if(this._popupView) { this._destroyPopupContent(); }
    let viewClass = get(this, 'popupViewClass');
    if(Ember.typeOf(viewClass) === 'string') {
      viewClass = get(this, 'container').lookupFactory('view:' + viewClass);
    }
    this._popupView = viewClass.create({
      container: get(this, 'container'),
      controller: get(this, 'controller'),
      context: get(this, 'controller'),
      content: get(this, 'content')
    });
    // You can't call this._popupView.replaceIn because it erroneously detects
    // the view as an Ember View because the popup's parent map's parent view
    // is an Ember View. So we need to trick it by calling the renderer's
    // replace function.
    // In Ember 1.10 we need to access renderer through constructor.
    const renderer = this._popupView.constructor.renderer || this._popupView.renderer;
    renderer.replaceIn(this._popupView, this._popup._contentNode);
    this._popup.update();

    // After the view has rendered, call update to ensure
    // popup is visible with autoPan
    schedule('afterRender', this, () => {
      this._popup.update();
    });
  },

  _destroyPopupContent() {
    if(!get(this, 'popupViewClass')) { return; }
    if(this._popupView) {
      this._popupView.destroy();
      this._popupView = null;
    }
  },

  _createPopup() {
    this.willCreatePopup();
    this._popup = L.popup(get(this, 'popupOptions'), this._layer);
    const oldOnRemove = this._popup.onRemove;
    this._popup.onRemove = (map) => {
      this._destroyPopupContent();
      oldOnRemove.call(this._popup, map);
    };
    this.didCreatePopup();
  },

  _destroyPopup() {
    if(!this._popup) { return; }
    this.willDestroyPopup();
    // closing popup will call _destroyPopupContent
    if(this._popup._map && this._layer && this._layer._map) {
      this._layer._map.closePopup(); }
    this._popup = null;
    this.didDestroyPopup();
  },

  _updatePopup: Ember.observer('popupContent', function() {
    if(!this._popup) { return; }
    this._popup.setContent(get(this, 'popupContent'));
  }),

  _addPopupObservers: Ember.observer('layer', function() {
    if(!this._layer) { return; }
    this._destroyPopup();
    this._createPopup();
  }),

  _destroyLayer() {
    if (this._popup) {
      this._destroyPopup();
    }
    this._super();
  }
});
