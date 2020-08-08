$(function() {
    $.getJSON("./faq_dump/faq1.json",
       function(json){

  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  var i;
  fetch("./faq_dump/faq1.json", requestOptions)
    .then(response => response.json())
    .then(results => console.log(results))
    .catch(error => console.log('error', error));
   }
  );
  });
