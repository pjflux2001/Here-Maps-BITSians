var geocoder = platform.getSearchService();

function geocoderSearch(){
    var loc = prompt("Enter your location");
    if(loc==null)
        alert("Null is not accepted");
    
    let geocodeParam ={
        q: loc,
        limit: 5, //Search results limitation
        //Coutry limitation here
        in: 'countryCode:USA',
                
    }
    function onResult(result){
        console.log(result);
        if(result.items.length>0){
            for(var i =0 ; i < result.items.length ; i++){
            let mrk = new H.map.Marker(result.items[i].position);
             map.addObject(mrk);
             mrk.setData(result.items[i].title);
        }
        document.getElementById("status").innerHTML = result.items.length + " Results Found";
    }
            
        
    }
    if(loc!="")
        geocoder.geocode(geocodeParam,onResult, alert);
        
        
}

function geocodeAndSearch(){
    var rad = prompt("Define Search Radius (in meters) : ");
    let geocodeParam ={
        q: 'hospitals',
        in: 'circle:'+ map.getCenter().lat +',' + map.getCenter().lng +';r='+rad
                
    }
    function onResult(result){
        console.log(result);
        if(result.items.length>0){
            for(var i =0 ; i < result.items.length ; i++){
                var mkr = new H.map.Marker(result.items[i].position);
                map.addObject(mkr);
                mkr.setData(result.items[i].title + ' (' + result.items[i].distance +' m)');
            }
            
        }
        ui.addBubble(new H.ui.InfoBubble(result.items[0].position,{
            content: result.items[0].title + ' (' + result.items[0].distance +' m)'
        }));
        document.getElementById("status").innerHTML = result.items.length + " Hospitals Found in " + rad + " meters";        
        //info bubble
        
       
    }

    
    geocoder.discover(geocodeParam,onResult, alert);
        
        
}

function geocodeBrowse(){
    let geocodeParam ={
        name: 'hospitals',
        at: '18.6,73.7', //use this for facilities
        categories: '800-8000-0000,800-8000-0156,800-8000-0158,800-8000-0159', 
        limit: 5
                
    }
    function onResult(result){
        console.log(result);
        if(result.items.length>0)
            map.addObject(new H.map.Marker(result.items[0].position));
        
            //info bubble
        var i =0;
        while(result.items[i].distance < 6000){
            result.items.forEach(item =>{
            
                ui.addBubble(new H.ui.InfoBubble(item.position,{
                    content: item.title + ' (' + item.distance +' m)'
                }));
            });
            i = i+1;
        }
        
        
    }

        alert("Check console for result!");
    
    geocoder.browse(geocodeParam,onResult, alert);
}

function revGeocode(lat, lon){
    var sol = lat + "," + lon;
    let geocodeParam ={
        at: sol
                
    }

    function onResult(result){
        console.log(result);
        if(result.items.length>0){
            document.getElementById("status").innerHTML = result.items[0].title;
        }else if(result.items.length==0){
            document.getElementById("status").innerHTML = "Here Maps : BITSians";
        }
    }
   
    geocoder.reverseGeocode(geocodeParam,onResult, alert);

}