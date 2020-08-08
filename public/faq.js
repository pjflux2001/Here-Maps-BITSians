
"use strict";

fetch("./faq_dump/faq1.json")
  .then(function(res){
    return res.json();
  })
  .then(function(data){
    console.log(data);
  });
