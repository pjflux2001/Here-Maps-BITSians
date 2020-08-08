     /*Your web app's Firebase configuration*/
     var firebaseConfig = {
        apiKey: "AIzaSyChax-RIyl8an4nKJA0XLdIc8CyU3jeGgY",
        authDomain: "here-maps-bitsians.firebaseapp.com",
        databaseURL: "https://here-maps-bitsians.firebaseio.com",
        projectId: "here-maps-bitsians",
        storageBucket: "here-maps-bitsians.appspot.com",
        messagingSenderId: "517005193635",
        appId: "1:517005193635:web:846d53aebc789427b0ea16"
        };
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);


/*===========================adding locations to database - start==================================*/ 
function add_location(){
    function add_loc(h){
        firebase.database().ref('location/' + h.user_id).set(h);
    }
    
    var location = {
      user_id: firebase.auth().currentUser.uid,
      mob: firebase.auth().currentUser.phoneNumber,
      time: new Date().toLocaleString(),
      latitude: user_lat,
      longitude: user_lng
    };
    
    console.log(user_lat + " @ "+ user_lng);
    
    add_loc(location);
    }
/*===========================adding locations to database - end==================================*/ 

/*===========================fetching locations from database - start==================================*/
    

    var addonref = firebase.database().ref().child("location");

    addonref.on("value", function(snapshot) {

      var currentUserPhoneNumber = firebase.auth().currentUser.phoneNumber;
      
      map.removeObjects(map.getObjects());
      
      snapshot.forEach(function(childsnapshot){
        var item = childsnapshot.val();

        var userPosition = {lat: item.latitude , lng: item.longitude };
        console.log(userPosition);

        //var checkUser = ((user_lat.toFixed(2)) == (item.latitude.toFixed(2)) && (user_lng.toFixed(2)) == (item.longitude.toFixed(2)));
        var checkUser = (currentUserPhoneNumber == item.mob);
        var userIcon = (checkUser) ? (new H.map.Icon('./beta_icons/icons8-standing-man-48.png')) : (new H.map.Icon('./beta_icons/icons8-man-50 (1).png'));
        console.log(checkUser);

        let userMarker = new H.map.Marker(userPosition, {icon: userIcon});
        map.addObject(userMarker);
        map.addObject(circle); // adding green circle around user
	    userMarker.setData(firebase.auth().currentUser.phoneNumber);  
    });

  });

/*===========================fetching locations from database - end==================================*/

/*===========================checking other's coordinate status - start==================================*/


// This checks to see whether the Sydney Harbour Bridge is contained somewhere in Sydney
poly = new H.map.Polygon(new H.geo.LineString([150.64, -34.08, 0, 150.64, -33.53, 0, 151.33, -33.53, 0, 151.33, -34.08, 0]),
    {
        style: { fillColor: 'rgba(150, 100, 0, .8)', lineWidth: 0 }
    }
)

point = new H.geo.Point(151.21, -33.84);

console.log(turf.booleanPointInPolygon(point.toGeoJSON(), poly.toGeoJSON()));