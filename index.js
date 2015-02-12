/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-leaflet',
  included: function(app) {
    //import javascript
    app.import('bower_components/leaflet/dist/leaflet-src.js');

    app.import('bower_components/leaflet/dist/leaflet.css');

    var imagesDestDir = '/assets/images';
    app.import('bower_components/leaflet/dist/images/layers-2x.png', { destDir: imagesDestDir });
    app.import('bower_components/leaflet/dist/images/layers.png', { destDir: imagesDestDir });
    app.import('bower_components/leaflet/dist/images/marker-icon-2x.png', { destDir: imagesDestDir });
    app.import('bower_components/leaflet/dist/images/marker-icon.png', { destDir: imagesDestDir });
    app.import('bower_components/leaflet/dist/images/marker-shadow.png', { destDir: imagesDestDir });
  }
};
