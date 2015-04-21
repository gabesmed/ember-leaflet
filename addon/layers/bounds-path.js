import ArrayPathLayer from './array-path';
import BoundsMixin from '../mixins/bounds';

/**
 * `BoundsPathLayer` is a base class that takes a list
 * of locations and computed the bounding box.
 *
 * @class BoundsPathLayer
 * @extends ArrayPathLayer
 * @uses BoundsMixin
 */
export default ArrayPathLayer.extend(BoundsMixin, {});
