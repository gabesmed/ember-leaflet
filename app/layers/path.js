import Ember from 'ember';
import Layer from './layer';
import computed from '../utils/computed';

/**
  `EmberLeaflet.PathLayer` is a generic layer to be inherited
  by other geometry layer classes. Both CircleGeometry and PathGeometry
  layers derive from it.

  @class PathLayer
  @namespace EmberLeaflet
  @extends EmberLeaflet.Layer
*/
export default Layer.extend({

	// Style options available to all L.Path layers
	stroke: computed.pathStyleProperty(),
	color: computed.pathStyleProperty(),
	weight: computed.pathStyleProperty(),
	opacity: computed.pathStyleProperty(),
	fill: computed.pathStyleProperty(),
	fillColor: computed.pathStyleProperty(),
	fillOpacity: computed.pathStyleProperty(),
	dashArray: computed.pathStyleProperty()
});
