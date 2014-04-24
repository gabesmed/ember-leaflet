require('ember-leaflet/~tests/test_helper');

var content, pathClass, path, view, locations = window.locations,
  get = Ember.get;

module("EmberLeaflet.PathLayer", {
  setup: function() {
    content = Ember.Object.create({location: locations.sf, radius:10});
    pathClass = EmberLeaflet.PathLayer.extend({
      _newLayer: function() {
        return L.circle(get(this, 'content.location'),
          get(this, 'content.radius'), get(this, 'options'));
      },
      _destroyLayer: function() { if(this._layer) { this._super(); } }
    });
    path = pathClass.create({content: content});
    view = EmberLeaflet.MapView.create({
      childLayers: [path]
    });
    Ember.run(function() {
      view.appendTo('#qunit-fixture');
    });
  },
  teardown: function() {
    Ember.run(function() {
      view.destroy();      
    });
  }
});

test("path is created", function() {
  ok(!!path._layer);
  equal(path._layer._map, view._layer);
});

test("set styles through property", function() {
  var values = {
    stroke: true, color: '#f00', weight: 5, opacity: 0.6, fill: true,
    fillColor: '#0f0', fillOpacity: 0.8, dashArray: '5, 10'};
  for(var key in values) {
    path.set(key, values[key]);
    strictEqual(path._layer.options[key], values[key],
      key + ' option set on layer');
    strictEqual(path.get('options')[key], values[key],
      key + ' option set on object');
  }
  // test SVG values set correctly.
  var svg = path._layer._path;
  strictEqual(svg.getAttribute('stroke'), values.color.toString());
  strictEqual(svg.getAttribute('stroke-opacity'), values.opacity.toString());
  strictEqual(svg.getAttribute('stroke-width'), values.weight.toString());
  strictEqual(svg.getAttribute('stroke-dasharray'), values.dashArray);
  strictEqual(svg.getAttribute('fill'), values.fillColor.toString());
  strictEqual(svg.getAttribute('fill-opacity'), values.fillOpacity.toString());
});

test("get styles through property", function() {
  var values = {
    stroke: true, color: '#f00', weight: 5, opacity: 0.6, fill: true,
    fillColor: '#0f0', fillOpacity: 0.8, dashArray: '5, 10'};
  path._layer.setStyle(values);
  for(var key in values) {
    strictEqual(path.get(key), values[key],
      key + ' option should be accessible through property');
  }
});

test("set style, then create", function() {
  path._destroyLayer();
  path.set('color', '#00f');
  path._createLayer();
  strictEqual(path._layer.options.color, '#00f');
});

test("create, set style, destroy & recreate", function() {
  path.set('color', '#00f');
  path._destroyLayer();
  path._createLayer();
  strictEqual(path._layer.options.color, '#00f');
});
