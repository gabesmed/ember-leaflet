import Ember from 'ember';
import convert from './convert';
import computed from 'ember-new-computed';

var get = Ember.get, set = Ember.set;

var computedProperties = {};

/**
  Define a computed property that gets and sets a value from the
  options object.
  @method optionProperty
*/
computedProperties.optionProperty = function(optionKey) {
  return computed('options', {
    get(key) {
      // override given key with explicitly defined one if necessary
      key = optionKey || key;
      return this._layer.options[key];
    },
    set(key, value) {
      // override given key with explicitly defined one if necessary
      key = optionKey || key;
      var setterName = 'set' + Ember.String.classify(key);
      Ember.assert(
        this.constructor + " must have a " + setterName + " function.",
        !!this._layer[setterName]);
      this._layer[setterName].call(this._layer, value);
      return value;
    }
  });
};

computedProperties.pathStyleProperty = function(styleKey) {
  return computed('options', {
    get(key) {
      // override given key with explicitly defined one if necessary
      key = styleKey || key;
      return this._layer.options[key];
    },
    set(key, value) {
      // override given key with explicitly defined one if necessary
      key = styleKey || key;
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
    }
  });
};

/**
  Define a computed property that converts a [longitude, latitude] array
  to a leaflet LatLng object.
  @method latlngFromLngLatArray
*/
computedProperties.latLngFromLngLatArray = function(coordKey) {
  return computed(coordKey, {
    get() {
      return convert.latLngFromLngLatArray(get(this, coordKey));
    },
    set(key, value) {
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
computedProperties.latLngFromLatLngArray = function(coordKey) {
  return computed(coordKey, {
    get() {
      return convert.latLngFromLatLngArray(get(this, coordKey));
    },
    set(key, value) {
      set(this, coordKey, value = convert.latLngArrayFromLatLng(value));
      return value;
    }
  });
};

export default computedProperties;
