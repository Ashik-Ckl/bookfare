$(document).ready(function(){
  $.ajax({
    url: "/branchapi/user/",
    type: "GET",
    beforeSend: function (xhr) {
      xhr.setRequestHeader(
        "Authorization",
        "Token " + localStorage.getItem("token")
      );
    },
    success:function(response){
      $("#userName").html(response['user'])
    }
})
})

$("#logout").click(function(){
    $.ajax({
        url: "/branchapi/logout/",
        type: "GET",
        beforeSend: function (xhr) {
          xhr.setRequestHeader(
            "Authorization",
            "Token " + localStorage.getItem("token")
          );
        },
        statusCode: {
            403: function(response) {
            },
            200:function(response){                
            },
        },
        success:function(){
            localStorage.removeItem("token")
            window.location="/branch/"
        }
    });
  });