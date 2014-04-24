var get = Ember.get, set = Ember.set;

/**
Convert a L.LatLng object to a [lat, lng] array.
*/
function latLngArrayFromLatLng(latLng) {
  return latLng ? [latLng.lat, latLng.lng] : null; }

/**
Convert a L.LatLng object to a [lng, lat] array.
*/
function lngLatArrayFromLatLng(latLng) {
  return latLng ? [latLng.lng, latLng.lat] : null; }

/**
Convert a [lat, lng] array to an L.LatLng object. If LatLng is passed in,
pass it through.
*/
function latLngFromLatLngArray(arr) {
  return arr ? (arr.lat ? arr : L.latLng(arr[0], arr[1])) : null; }

/**
Convert a [lng, lat] array to an L.LatLng object. If LatLng is passed in,
pass it through.
*/
function latLngFromLngLatArray(arr) {
  return arr ? (arr.lat ? arr : L.latLng(arr[1], arr[0])) : null; }


EmberLeaflet.convert = {
  latLngArrayFromLatLng: latLngArrayFromLatLng,
  lngLatArrayFromLatLng: lngLatArrayFromLatLng,
  latLngFromLatLngArray: latLngFromLatLngArray,
  latLngFromLngLatArray: latLngFromLngLatArray
};

EmberLeaflet.computed = {};

/**
  Define a computed property that converts a [longitude, latitude] array
  to a leaflet LatLng object.

  @method latlngFromLngLatArray
*/
EmberLeaflet.computed.latLngFromLngLatArray = function(coordKey) {
  return Ember.computed(coordKey, function(key, value) {
    if(arguments.length === 1) {
      return latLngFromLngLatArray(get(this, coordKey));
    } else {
      set(this, coordKey, lngLatArrayFromLatLng(value));
      return value;
    }
  });  
};

/**
  Define a computed property that converts a [latitude, longitude] array
  to a leaflet LatLng object.

  @method latlngFromLatLngArray
*/
EmberLeaflet.computed.latLngFromLatLngArray = function(coordKey) {
  return Ember.computed(coordKey, function(key, value) {
    if(arguments.length === 1) {
      return latLngFromLatLngArray(get(this, coordKey));
    } else {
      set(this, coordKey, value = latLngArrayFromLatLng(value));
      return value;
    }
  });  
};

/**
  Define a computed property that gets and sets a value from the
  options object.

  @method optionProperty
*/
EmberLeaflet.computed.optionProperty = function(optionKey) {
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
