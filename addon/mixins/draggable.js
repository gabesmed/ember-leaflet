import Ember from 'ember';

const { get, set, setProperties } = Ember;

/**
 * `DraggableMixin` adds drag and drop functionality to
 * `MarkerLayer` classes.
 *
 * @class DraggableMixin
 * @extends Ember.Mixin
 */
export default Ember.Mixin.create({
  isDragging: false,
  isDraggable: true,

  dragstart() {
    set(this, 'isDragging', true);
  },

  dragend() {
    setProperties(this, {
      location: this._layer.getLatLng(),
      isDragging: false
    });
  },

  _updateDraggability: Ember.observer('isDraggable', 'layer', function() {
    if(!this._layer || !this._layer._map) { return; }
    if(get(this, 'isDraggable')) {
      this._layer.dragging.enable();
    } else {
      this._layer.dragging.disable();
    }
  })
});
