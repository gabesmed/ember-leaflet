$('body').tooltip({
    selector : 'a[rel="tooltip"], [data-toggle="tooltip"]'
});

Ember.TextSupport.reopen({
  attributeBindings: ['data-toggle','title'],
  didInsertElement:function(){
      this.$().tooltip();
  }
})

App = Ember.Application.create({
    rootElement : "#application"
});

App.Router = Ember.Router.extend({
    location : Ember.Location.create({
        implementation : 'none'
    })
});

App.IndexView = Ember.View.extend({
    didInsertElement : function() {
        $('body').tooltip({
            selector : 'a[rel="tooltip"], [data-toggle="tooltip"]'
        });
    }
});

/**
 * 
 */
App.IndexController = Ember.Controller.extend({
    zoom: 15,
    center: L.latLng(41.276387375928984, -8.371624946594238),
    latitude : function(key, value){
      // getter
      if (arguments.length === 1) {
        return this.get('center').lat;
      // setter
      } else {
        this.set('center', L.latLng(value,this.get('center').lng));
  
        return value;
      }
    }.property('center'),
    longitude : function(key,value){
      // getter
      if (arguments.length === 1) {
        return this.get('center').lng;
      // setter
      } else {
        this.set('center', L.latLng(this.get('center').lat,value));
  
        return value;
      }
    }.property('center'),
    zoomIn: function() {
        console.log(this.get('zoom'));
        this.incrementProperty('zoom');
    },
    zoomOut: function() {
        console.log(this.get('zoom'));
        this.decrementProperty('zoom');
    }
});

/**
 * 
 */

App.MarkerCollectionLayer = EmberLeaflet.MarkerCollectionLayer.extend({
    content: [
        {location: [41.276081,-8.356861]},
        {location: [41.276081,-8.366861]},
        {location: [41.276081, -8.376861]},
        {location: [41.276081, -8.386861]}
    ]
});

App.TileLayer = EmberLeaflet.TileLayer.extend({
    tileUrl : 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
    options : {
        attribution : '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }
});
App.MapView = EmberLeaflet.MapView.extend({
    options : {
        maxZoom : 19,
        minZoom : 0,
        attributionControl : true,
    },
    childLayers : [
        App.TileLayer
    ]
}); 
