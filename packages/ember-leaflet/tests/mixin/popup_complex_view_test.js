require('ember-leaflet/~tests/test_helper');

var App, marker, MarkerClass, view, PopupViewClass, controller,
  locationsEqual = window.locationsEqual,
  locations = window.locations;

var get = Ember.get;

module("EmberLeaflet.PopupMixin (Marker with complex popupViewClass)", {
  setup: function() {

    Ember.run(function() {
      App = Ember.Application.create({});
    });

    Ember.TEMPLATES['customPopup'] = Ember.Handlebars.compile(
      '{{#if isActivated}}' +
        '{{#each item in items}}' +
          '#{{item.number}},' +
        '{{/each}}' +
      '{{else}}' +
        'not activated' +
      '{{/if}}');

    PopupViewClass = Ember.View.extend({
      templateName: 'customPopup'
    });

    MarkerClass = EmberLeaflet.MarkerLayer.extend(
      EmberLeaflet.PopupMixin, {});
    
    marker = MarkerClass.create({
      content: {location: locations.nyc},
      popupViewClass: PopupViewClass
    });

    controller = Ember.Controller.create({
      isActivated: true,
      items: Ember.A([{number: 40}, {number: 70}])
    });

    view = EmberLeaflet.MapView.create({
      childLayers: [marker],
      controller: controller,
      container: App.__container__
    });

    Ember.run(function() {
      view.appendTo('#qunit-fixture');
    });
  },
  teardown: function() {
    Ember.run(function() {
      view.destroy();
      App.destroy();
    });
    Ember.TEMPLATES = {};
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
    '#40,#70,', "popup content set");
});

test("Popup content updates", function() {
  marker._layer.fire('click', {latlng: marker.get('location')});
  Ember.run(function() {
    controller.set('isActivated', false);
  });
  equal(Ember.$(marker._popup._contentNode).text(),
    'not activated', "popup content updated");
  Ember.run(function() {
    controller.set('isActivated', true);
    controller.get('items').pushObject({number: 20});
  });
  equal(Ember.$(marker._popup._contentNode).text(),
    '#40,#70,#20,', "popup content updated");

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
