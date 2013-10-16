/**
  `EmberLeaflet.GeometryLayer` is a generic layer to be inherited
  by other geometry layer classes.
 
  @class GeometryLayer
  @namespace EmberLeaflet
  @extends EmberLeaflet.Layer
*/

EmberLeaflet.GeometryLayer = EmberLeaflet.Layer.extend({
	// Style options available to all L.Path layers
	stroke: EmberLeaflet.computed.styleProperty(),
	color: EmberLeaflet.computed.styleProperty(),
	weight: EmberLeaflet.computed.styleProperty(),
	opacity: EmberLeaflet.computed.styleProperty(),
	fill: EmberLeaflet.computed.styleProperty(),
	fillColor: EmberLeaflet.computed.styleProperty(),
	fillOpacity: EmberLeaflet.computed.styleProperty(),
	dashArray: EmberLeaflet.computed.styleProperty(),
	clickable: EmberLeaflet.computed.styleProperty(),
	pointerEvents: EmberLeaflet.computed.styleProperty()
});
