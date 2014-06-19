require('ember-leaflet/~tests/test_helper');

var marker, MarkerClass, view, PopupViewClass, controller,
  locationsEqual = window.locationsEqual,
  locations = window.locations;

var get = Ember.get;

module("EmberLeaflet.PopupMixin (Marker with popupViewClass)", {
  setup: function() {

    PopupViewClass = Ember.View.extend({
      template: Ember.Handlebars.compile('value: {{value}}')
    });

    MarkerClass = EmberLeaflet.MarkerLayer.extend(
      EmberLeaflet.PopupMixin, {});
    
    marker = MarkerClass.create({
      content: {location: locations.nyc},
      popupViewClass: PopupViewClass
    });

    controller = Ember.Controller.create({
      value: true
    });

    view = EmberLeaflet.MapView.create({
      childLayers: [marker],
      controller: controller
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

test("Popup is created", function() {
  ok(marker._popup, "popup is created");
  equal(marker._popup._map, null, "popup not added until opened");  
});

test("Clicking shows popup", function() {
  marker._layer.fire('click', {latlng: marker.get('location')});
  ok(!!marker._popup._map, "marker added to map");
  locationsEqual(marker._popup._latlng, marker.get('location'));
  equal(Ember.$(marker._popup._contentNode).text(),
    'value: true', "popup content set");
});

test("Popup content updates", function() {
  marker._layer.fire('click', {latlng: marker.get('location')});
  Ember.run(function() {
    controller.set('value', false);
  });
  equal(Ember.$(marker._popup._contentNode).text(),
    'value: false', "popup content updated");
});

test("Closing popup destroys view", function() {
  marker._layer.fire('click', {latlng: marker.get('location')});
  var popupView = marker._popupView;
  ok(popupView, 'popup view created');
  Ember.run(function() {
    view._layer.closePopup();
  });
  equal(marker._popupView, null, 'popupView is nullified');
  equal(popupView.isDestroyed, true, 'popup view is destroyed');
});
