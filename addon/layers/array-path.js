import Ember from 'ember';
import PathLayer from './path';
import convert from '../utils/convert';

var get = Ember.get;

/**
 * `ArrayPathLayer` is a base geometry on the map that
 * adjusts based on a content object that should be an array of
 * LatLng objects.
 *
 * @class ArrayPathLayer
 * @extends PathLayer
 */
export default PathLayer.extend({
  init: function() {
    this._super();
    this._setupLocationObservers();
  },

  destroy: function() {
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
    var locationProperty = get(this, 'locationProperty'),
        locationsProperty = get(this, 'locationsProperty'),
        locationsPath = 'content' + (locationsProperty ? '.' +
          locationsProperty : ''),
        locations = get(this, locationsPath) || Ember.A();
    if(locationProperty) {
      locations = locations.mapBy(locationProperty); }
    locations = locations.filter(function(i) { return !!i; });
    // Convert any arrays that somehow made it through to latLngs.
    locations = locations.map(convert.latLngFromLatLngArray);
    return locations;
  }).property('content', 'locationProperty', 'locationsProperty').volatile(),

  _contentDidChange: Ember.observer('content', 'locationsProperty', 'locationProperty', function() {
    this._teardownLocationObservers();
    this._setupLocationObservers();
    this._contentLocationsDidChange();
  }),

  _setupLocationObservers: function() {
    var content = get(this, 'content'),
      locationProperty = get(this, 'locationProperty'),
      locationsProperty = get(this, 'locationsProperty');
    if(!content) { return; }

    var observers = [];

    // Add observer on locations property of content if relevant.
    if (locationsProperty) {
      observers.push([content, locationsProperty, this,
        '_contentLocationsDidChange']);
    }

    // Add array observer for new/removed items in content list
    var arr = locationsProperty ? get(content, locationsProperty) : content;
    Ember.assert("Content object or locations property must be array-like",
      !arr || !!arr.addArrayObserver);
    if(arr) { arr.addArrayObserver(this); }

    // Add @each chain observer for location property on array.
    if(arr && locationProperty) {
      var arrayLocationsChainProperty = '@each.' + locationProperty;
      observers.push([arr, arrayLocationsChainProperty, this,
        '_contentLocationsDidChange']);
    }

    observers.forEach(function(args) {
      Ember.addObserver.apply(Ember, args);
    });

    this._arr = arr;
    this._observers = observers;
  },

  _teardownLocationObservers: function() {
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

  _contentLocationsDidChange: function() {
    this.propertyWillChange('locations');
    this.propertyDidChange('locations');
  },

  /** On any change to the array, just update the entire leaflet path,
  as it reprocesses the whole thing anyway. */

  // arrayWillChange(array, idx, removedCount, addedCount)
  arrayWillChange: function() {
    this.propertyWillChange('locations');
  },

  // arrayDidChange(array, idx, removedCount, addedCount)
  arrayDidChange: function() {
    this.propertyDidChange('locations');
  }
});
