var get = Ember.get;

/**
  `EmberLeaflet.HashLayer` is like 'EmberLeaflet.CollectionLayer'
  except it combines items that share the same location, and the `content`
  object for each item is an array of objects, not the single object.
 
  @class HashLayer
  @namespace EmberLeaflet
  @extends EmberLeaflet.Layer
*/
EmberLeaflet.HashLayer = EmberLeaflet.CollectionLayer.extend({

  hashByProperty: 'location',
  hashIsLocation: true,

  _compareLocations: function(loc1, loc2) {
    if(!loc1 || !loc2) { return false; }
    if(loc1.lat.toFixed(6) !== loc2.lat.toFixed(6)) { return false; }
    if(loc1.lng.toFixed(6) !== loc2.lng.toFixed(6)) { return false; }
    return true;
  },

  _getChildLayerIndexByObject: function(obj) {
    var hashByProperty = get(this, 'hashByProperty'),
        hashIsLocation = get(this, 'hashIsLocation');
    for(var i = 0, l = this._childLayers.length; i < l; i++) {
      var layerKey = get(this._childLayers[i], hashByProperty);
      var objKey = get(obj, hashByProperty);
      if(hashIsLocation) {
        if(this._compareLocations(layerKey, objKey)) { return i; }        
      } else {
        if(layerKey === objKey) { return i; }
      }
    }
    return -1;
  },

  _getChildLayerByObject: function(obj) {
    var index = this._getChildLayerIndexByObject(obj);
    return index === -1 ? null : this._childLayers[index];
  },

  objectWasAdded: function(obj) {
    var childLayer = this._getChildLayerByObject(obj),
        itemLayerClass = get(this, 'itemLayerClass'),
        hashByProperty = get(this, 'hashByProperty'),
        objKey = get(obj, hashByProperty), props;
    if(childLayer) {
      get(childLayer, 'content').addObject(obj);
    } else {
      props = {content: Ember.A([obj])};
      props[hashByProperty] = objKey;
      childLayer = this._createChildLayer(itemLayerClass, props);
      this._childLayers.push(childLayer);
    }
  },

  objectWasRemvoed: function(obj) {
    var layer;
    for(var i = 0, l = this._childLayers.length; i < l; i++) {
      layer = this._childLayers[i];
      if(get(layer, 'content').indexOf(obj) !== -1) {
        get(layer, 'content').removeObject(obj);
      }
      if(get(layer, 'content.length') === 0) {
        layer._destroyLayer();
        layer.destroy();
        this._childLayers.splice(i, 1);
        return;
      }
    }
  }  
});
