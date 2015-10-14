import Ember from 'ember';
import PathLayer from './path';
import convert from '../utils/convert';

const { get, computed } = Ember;

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
  locations: computed('content', 'locationProperty', 'locationsProperty', function() {
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
  }).volatile(),

  _contentDidChange: Ember.observer('content', 'locationsProperty', 'locationProperty', function() {
    this._teardownLocationObservers();
    this._setupLocationObservers();
    this._contentLocationsDidChange();
  }),

  _setupLocationObservers() {
    const content = get(this, 'content'),
      locationProperty = get(this, 'locationProperty'),
      locationsProperty = get(this, 'locationsProperty');
    if(!content) { return; }

    const observers = [];

    // Add observer on locations property of content if relevant.
    if (locationsProperty) {
      observers.push([content, locationsProperty, this,
        '_contentLocationsDidChange']);
    }

    // Add array observer for new/removed items in content list
    const arr = locationsProperty ? get(content, locationsProperty) : content;
    Ember.assert("Content object or locations property must be array-like",
      !arr || !!arr.addArrayObserver);
    if(arr) { arr.addArrayObserver(this); }

    // Add @each chain observer for location property on array.
    if(arr && locationProperty) {
      const arrayLocationsChainProperty = '@each.' + locationProperty;
      observers.push([arr, arrayLocationsChainProperty, this,
        '_contentLocationsDidChange']);
    }

    observers.forEach(function(args) {
      Ember.addObserver.apply(Ember, args);
    });

    this._arr = arr;
    this._observers = observers;
  },

  _teardownLocationObservers() {
    // Remove array observer
    if (this._arr) {
      this._arr.removeArrayObserver(this);
      this._arr = null;
    }

    // And remove all chained observers
    if (this._observers) {
      this._observers.forEach(function(args) {
        Ember.removeObserver.apply(Ember, args);
      });
      this._observers = null;
    }
  },

  _contentLocationsDidChange() {
    this.propertyWillChange('locations');
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
