$(function() {
    $.getJSON("https://extreme-ip-lookup.com/json/",
       function(json){

  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  var i;
  fetch("https://api.coronatracker.com/news/trending?limit=25&offset&country="+json.country+"&countryCode", requestOptions)
    .then(response => response.json())
    .then(results => console.log(results))
    .catch(error => console.log('error', error));
   }
  );
  });
