import Ember from 'ember';
import PathLayer from './path';
import convert from '../utils/convert';

const { get } = Ember;

/**
 * `ArrayPathLayer` is a base geometry on the map that
 * adjusts based on a content object that should be an array of
 * LatLng objects.
 *
 * @class ArrayPathLayer
 * @extends PathLayer
 */
export default PathLayer.extend({
  init() {
    this._super();
    this._setupLocationObservers();
  },

  destroy() {
    this._teardownLocationObservers();
    return this._super();
  },

  /**
  If this property is null, watch the content object for location updates.
  If this property is set, look inside this property of the content object
  for the locations array.
  */
  locationsProperty: null,

  /**
  If this property is null, each item in the locations array (whether it
  is the content object or a subitem of it) is a LatLng object. If this is
  set, then look inside this property of each item in the array for its
  location.
  */
  locationProperty: null,

  /**
  The computed array of locations.
  */
  locations: Ember.computed(function() {
    let locationProperty = get(this, 'locationProperty'),
        locationsProperty = get(this, 'locationsProperty'),
        locationsPath = 'content' + (locationsProperty ? `.${locationsProperty}` : ''),
        locations = get(this, locationsPath) || Ember.A();
    if(locationProperty) {
      locations = locations.mapBy(locationProperty); }
    locations = locations.filter(function(i) { return !!i; });
    // Convert any arrays that somehow made it through to latLngs.
    locations = locations.map(convert.latLngFromLatLngArray);
    return locations;
  }).property('content', 'locationProperty', 'locationsProperty').volatile(),

  _contentWillChange: Ember.beforeObserver('content', 'locationsProperty', 'locationProperty', function() {
    this._contentLocationsWillChange();
    this._teardownLocationObservers();
  }),

  _contentDidChange: Ember.observer('content', 'locationsProperty', 'locationProperty', function() {
    this._setupLocationObservers();
    this._contentLocationsDidChange();
  }),

  _setupLocationObservers() {
    var content = get(this, 'content'),
      locationProperty = get(this, 'locationProperty'),
      locationsProperty = get(this, 'locationsProperty');
    if(!content) { return; }

    // Add observer on locations property of content if relevant.
    var contentLocationsProperty = locationsProperty ?
      `content.${locationsProperty}` : 'content';
    if (locationsProperty) {
      Ember.addBeforeObserver(this, contentLocationsProperty, this,
        '_contentLocationsWillChange');
      Ember.addObserver(this, contentLocationsProperty, this,
        '_contentLocationsDidChange');
    }

    // Add array observer for new/removed items in content list
    const arr = locationsProperty ? get(content, locationsProperty) : content;
    Ember.assert("Content object or locations property must be array-like",
      !arr || !!arr.addArrayObserver);
    if(arr) { arr.addArrayObserver(this); }

    // Add @each chain observer for location property on array.
    if(locationProperty) {
      const contentLocationsChainProperty = `${contentLocationsProperty}.@each.${locationProperty}`;
      Ember.addBeforeObserver(this, contentLocationsChainProperty, this,
        '_contentLocationsWillChange');
      Ember.addObserver(this, contentLocationsChainProperty, this,
        '_contentLocationsDidChange');
    }
  },

  _teardownLocationObservers: function() {
    const content = get(this, 'content'),
      locationProperty = get(this, 'locationProperty'),
      locationsProperty = get(this, 'locationsProperty');
    if(!content) { return; }

    // Remove observer on locations property of content.
    const contentLocationsProperty = locationsProperty ? `content.${locationsProperty}` : 'content';
    if (locationsProperty) {
      Ember.addBeforeObserver(this, contentLocationsProperty, this,
        '_contentLocationsWillChange');
      Ember.addObserver(this, contentLocationsProperty, this,
        '_contentLocationsDidChange');
    }

    // Remove array observer for new/removed items in content list
    const arr = locationsProperty ? get(content, locationsProperty) : content;
    if(arr) { arr.removeArrayObserver(this); }

    // Remove @each chain observer for location property on array.
    if(locationProperty) {
      const contentLocationsChainProperty = `${contentLocationsProperty}.@each.${locationProperty}`;
      Ember.removeBeforeObserver(this, contentLocationsChainProperty, this,
        '_contentLocationsWillChange');
      Ember.removeObserver(this, contentLocationsChainProperty, this,
        '_contentLocationsDidChange');
    }
  },

  _contentLocationsWillChange() {
    this.propertyWillChange('locations');
  },

  _contentLocationsDidChange() {
    this.propertyDidChange('locations');
  },

  /** On any change to the array, just update the entire leaflet path,
  as it reprocesses the whole thing anyway. */

  // arrayWillChange(array, idx, removedCount, addedCount)
  arrayWillChange() {
    this.propertyWillChange('locations');
  },

  // arrayDidChange(array, idx, removedCount, addedCount)
  arrayDidChange() {
    this.propertyDidChange('locations');
  }
});
