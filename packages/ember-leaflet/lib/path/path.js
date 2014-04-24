/**
  `EmberLeaflet.PathLayer` is a generic layer to be inherited
  by other geometry layer classes. Both CircleGeometry and PathGeometry
  layers derive from it.
 
  @class PathLayer
  @namespace EmberLeaflet
  @extends EmberLeaflet.Layer
*/
var set = Ember.set, get = Ember.get;


function pathStyleProperty(styleKey) {
  return Ember.computed('options', function(key, value) {
    // override given key with explicitly defined one if necessary
    key = styleKey || key;
    if(arguments.length > 1) { // set
      // Update style on existing object
      if(this._layer) {
        var styleObject = {};
        styleObject[key] = value;
        this._layer.setStyle(styleObject);
      }
      // Update options object for later initialization.
      if(!get(this, 'options')) { set(this, 'options', {}); }
      this.get('options')[key] = value;
      return value;
    } else { // get
      return this._layer.options[key];
    }
  });
}

EmberLeaflet.PathLayer = EmberLeaflet.Layer.extend({

	// Style options available to all L.Path layers
	stroke: pathStyleProperty(),
	color: pathStyleProperty(),
	weight: pathStyleProperty(),
	opacity: pathStyleProperty(),
	fill: pathStyleProperty(),
	fillColor: pathStyleProperty(),
	fillOpacity: pathStyleProperty(),
	dashArray: pathStyleProperty()
});
