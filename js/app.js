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
    }
}); 

/**
 * 
 */
App.IndexController = Ember.Controller.extend({
    zoom: 15,
    center: L.latLng(41.276387375928984, -8.371624946594238),
    markers : EmberLeaflet.MarkerCollectionLayer.create({
      content: [
            {location: [41.276081,-8.356861]},
            {location: [41.276081,-8.366861]},
            {location: [41.276081, -8.376861]},
            {location: [41.276081, -8.386861]}
          ]
    }),
    layers: function(){
      return [App.TileLayer, this.markers]
    }.property(),
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
        this.incrementProperty('zoom');
    },
    zoomOut: function() {
        this.decrementProperty('zoom');
    },
    remove : function(m) {
        this.get('markers.content').removeObject(m);
    },
    icons:[
        {
            label: 'Supermarket',
            icon: L.AwesomeMarkers.icon({
                icon : 'shopping-cart',
                color : 'blue'
            }),
        },
        {
            label: 'Rocket!',
            icon:L.AwesomeMarkers.icon({
                icon : 'rocket',
                color : 'orange'
            })
        },
        {
            label: 'Fire! Fire!',
            icon:L.AwesomeMarkers.icon({
                icon : 'fire-extinguisher',
                color : 'red'
            })
        },
        {
            label: 'Let\'s play!',
            icon:L.AwesomeMarkers.icon({
                icon : 'gamepad',
                color : 'cadetblue'
            })
        },
        {
            label: 'Ember',
            icon:L.AwesomeMarkers.icon({
                icon : 'fire',
                color : 'green'
            })
        }
    ],
    changeIcon : function(m, icon){
        m.set('icon',icon);
    }
});