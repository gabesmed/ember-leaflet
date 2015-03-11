import ArrayPathLayer from './array-path';
import BoundsMixin from '../mixins/bounds';

/**
  `EmberLeaflet.PathBoundsLayer` is a base class that takes a list
  of locations and computed the bounding box.

  @class PathBoundsLayer
  @namespace EmberLeaflet
  @extends EmberLeaflet.ArrayPathLayer
*/
export default ArrayPathLayer.extend(BoundsMixin, {});
