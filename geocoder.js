var geocoder = platform.getSearchService();

function geocoderSearch(){
    var loc = prompt("Enter your location");
                   
    let geocodeParam ={
        q: loc,
        limit: 5, //Search results limitation
        //Coutry limitation here
        in: 'countryCode:USA',
                
    }
    function onResult(result){
        console.log(result);
    }
    if(loc!="")
        alert("Check console for result!");
    geocoder.geocode(geocodeParam,onResult, alert);
    
}

