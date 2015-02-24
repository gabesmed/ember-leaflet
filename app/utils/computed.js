import Ember from 'ember';
import convert from './convert';

var get = Ember.get, set = Ember.set;

var computed = {};

/**
  Define a computed property that gets and sets a value from the
  options object.
  @method optionProperty
*/
computed.optionProperty = function(optionKey) {
  return Ember.computed('options', function(key, value) {
    // override given key with explicitly defined one if necessary
    key = optionKey || key;
    if(arguments.length > 1) { // set
      var setterName = 'set' + Ember.String.classify(key);
      Ember.assert(
        this.constructor + " must have a " + setterName + " function.",
        !!this._layer[setterName]);
      this._layer[setterName].call(this._layer, value);
      return value;
    } else { // get
      return this._layer.options[key];
    }
  });
};

computed.pathStyleProperty = function(styleKey) {
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
};

/**
  Define a computed property that converts a [longitude, latitude] array
  to a leaflet LatLng object.
  @method latlngFromLngLatArray
*/
computed.latLngFromLngLatArray = function(coordKey) {
  return Ember.computed(coordKey, function(key, value) {
    if(arguments.length === 1) {
      return convert.latLngFromLngLatArray(get(this, coordKey));
    } else {
      set(this, coordKey, convert.lngLatArrayFromLatLng(value));
      return value;
    }
  });
};

/**
  Define a computed property that converts a [latitude, longitude] array
  to a leaflet LatLng object.
  @method latlngFromLatLngArray
*/
computed.latLngFromLatLngArray = function(coordKey) {
  return Ember.computed(coordKey, function(key, value) {
    if(arguments.length === 1) {
      return convert.latLngFromLatLngArray(get(this, coordKey));
    } else {
      set(this, coordKey, value = convert.latLngArrayFromLatLng(value));
      return value;
    }
  });
};

export default computed;
