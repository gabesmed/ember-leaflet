import TileLayer from './tile';

/**
 * A `DefaultTileLayer` is a tile layer that is used when no
 * tile layer is specied on a map.
 *
 * @class ContainerLayer
 * @extends TileLayer
 */
export default TileLayer.extend({
  tileUrl: '//a.tiles.mapbox.com/v3/examples.map-zr0njcqy/{z}/{x}/{y}.png'
});
