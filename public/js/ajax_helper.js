  function fuzzynameGet(){
    var search_query = {
      HOSPITAL_NAME : $("#hospital").val(),
      STATE_NAME : "",
      COUNTY_NAME : "",
      HQ_CITY : "",
    }
    $.ajax({
      type : "GET",
      contentType: "application/json",
      url : "/api/fuzzy",
      data : search_query,
      dataType:"json",
      success: function(result){
        $('#result .cards').empty();
        $.each(result, function(i, hospital){
          $('#result .ui.cards').append("<div class='card'> <div class='content'> <strong>"+hospital.HOSPITAL_NAME + "</strong><div>Object Id:" + hospital._id +  "<i class='copy outline icon'></i></div>" +  "<div><div class='ui right floated red button' >Delete</div><div class='ui right floated black button' >Edit</div></div></div></div>");
        });
        console.log("Success: ", result);
      },
      error : function(e) {
        $("#result").html("<strong>Error</strong>");
        console.log("ERROR: ", e);
      }
    });  
  }