// Get an instance of the routing service version 8:
var router = platform.getRoutingService(null, 8);
    
// Create the parameters for the routing request:
var routingParameters = {
  transportMode:'car',
  routingMode: 'fast',
  origin: '18.5,73.8',
  destination: '19,73',
  return:'polyline',
  };
  
  // Define a callback function to process the routing response:
var onResult = function(result) {
  console.log(result);
};

// error callback function
var onError = function(error) {
  alert(error.message);
};
  
// Call calculateRoute() with the routing parameters,
// the callback and an error callback function 

router.calculateRoute(routingParameters, onResult, onError);