import Ember from 'ember';
import PathLayer from './path';
import convert from '../utils/convert';

var get = Ember.get;

/**
  `EmberLeaflet.ArrayPathLayer` is a base geometry on the map that
  adjusts based on a content object that should be an array of
  LatLng objects.

  @class ArrayPathLayer
  @namespace EmberLeaflet
  @extends EmberLeaflet.Layer
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
      locations = locations.mapProperty(locationProperty); }
    locations = locations.filter(function(i) { return !!i; });
    // Convert any arrays that somehow made it through to latLngs.
    locations = locations.map(convert.latLngFromLatLngArray);
    return locations;
  }).property('content', 'locationProperty', 'locationsProperty').volatile(),

  _contentWillChange: Ember.beforeObserver(function() {
    this._contentLocationsWillChange();
    this._teardownLocationObservers();
  }, 'content', 'locationsProperty', 'locationProperty'),

  _contentDidChange: Ember.observer(function() {
    this._setupLocationObservers();
    this._contentLocationsDidChange();
  }, 'content', 'locationsProperty', 'locationProperty'),

  _setupLocationObservers: function() {
    var content = get(this, 'content'),
      locationProperty = get(this, 'locationProperty'),
      locationsProperty = get(this, 'locationsProperty');
    if(!content) { return; }

    // Add observer on locations property of content if relevant.
    var contentLocationsProperty = locationsProperty ?
      'content.' + locationsProperty : 'content';
    if (locationsProperty) {
      Ember.addBeforeObserver(this, contentLocationsProperty, this,
        '_contentLocationsWillChange');
      Ember.addObserver(this, contentLocationsProperty, this,
        '_contentLocationsDidChange');
    }

    // Add array observer for new/removed items in content list
    var arr = locationsProperty ? get(content, locationsProperty) : content;
    Ember.assert("Content object or locations property must be array-like",
      !arr || !!arr.addArrayObserver);
    if(arr) { arr.addArrayObserver(this); }

    // Add @each chain observer for location property on array.
    if(locationProperty) {
      var contentLocationsChainProperty = contentLocationsProperty +
        '.@each.' + locationProperty;
      Ember.addBeforeObserver(this, contentLocationsChainProperty, this,
        '_contentLocationsWillChange');
      Ember.addObserver(this, contentLocationsChainProperty, this,
        '_contentLocationsDidChange');
    }
  },

  _teardownLocationObservers: function() {
    var content = get(this, 'content'),
      locationProperty = get(this, 'locationProperty'),
      locationsProperty = get(this, 'locationsProperty');
    if(!content) { return; }

    // Remove observer on locations property of content.
    var contentLocationsProperty = locationsProperty ?
      'content.' + locationsProperty : 'content';
    if (locationsProperty) {
      Ember.addBeforeObserver(this, contentLocationsProperty, this,
        '_contentLocationsWillChange');
      Ember.addObserver(this, contentLocationsProperty, this,
        '_contentLocationsDidChange');
    }

    // Remove array observer for new/removed items in content list
    var arr = locationsProperty ? get(content, locationsProperty) : content;
    if(arr) { arr.removeArrayObserver(this); }

    // Remove @each chain observer for location property on array.
    if(locationProperty) {
      var contentLocationsChainProperty = contentLocationsProperty +
        '.@each.' + locationProperty;
      Ember.removeBeforeObserver(this, contentLocationsChainProperty, this,
        '_contentLocationsWillChange');
      Ember.removeObserver(this, contentLocationsChainProperty, this,
        '_contentLocationsDidChange');
    }
  },

  _contentLocationsWillChange: function() {
    this.propertyWillChange('locations');
  },

  _contentLocationsDidChange: function() {
    this.propertyDidChange('locations');
  },

  /** On any change to the array, just update the entire leaflet path,
  as it reprocesses the whole thing anyway. */
  arrayWillChange: function(array, idx, removedCount, addedCount) {
    this.propertyWillChange('locations');
  },

  arrayDidChange: function(array, idx, removedCount, addedCount) {
    this.propertyDidChange('locations');
  }
});
