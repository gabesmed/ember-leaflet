var get = Ember.get, set = Ember.set, setProperties = Ember.setProperties;

/**
  `EmberLeaflet.DraggableMixin` adds drag and drop functionality to
  `EmberLeaflet.MarkerLayer` classes.
 
  @class DraggableMixin
  @namespace EmberLeaflet
*/
EmberLeaflet.DraggableMixin = Ember.Mixin.create({
  isDragging: true,
  isDraggable: true,

  _onDragStart: function() {
    set(this, 'isDragging', true);
  },

  _onDragEnd: function() {
    setProperties(this, {
      location: this._layer.getLatLng(),
      isDragging: false
    });
  },

  isDraggableDidChange: Ember.observer(function() {
    if(!this._layer || !this._layer._map) { return; }
    if(get(this, 'isDraggable')) {
      this._layer.dragging.enable();
    } else {
      this._layer.dragging.disable();
    }
  }, 'isDraggable'),

  layerWillChange: Ember.beforeObserver(function() {
    if(!this._layer) { return; }
    this._layer.off('dragstart', this._onDragStart, this);
    this._layer.off('dragend', this._onDragEnd, this);
  }, 'layer'),

  layerDidChange: Ember.observer(function() {
    if(!this._layer) { return; }
    this._layer.on('dragstart', this._onDragStart, this);
    this._layer.on('dragend', this._onDragEnd, this);
    this.propertyDidChange('isDraggable');
  }, 'layer')

});
