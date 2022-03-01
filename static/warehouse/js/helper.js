

// if($(localStorage.getItem('admin_token') != null)){

// }
// else{
//   window.location("/")
// }

$("#logout").click(function(){
    $.ajax({
        url: "/warehouseapi/logout/",
        type: "GET",
        beforeSend: function (xhr) {
          xhr.setRequestHeader(
            "Authorization",
            "Token " + localStorage.getItem("admin_token")
          );
        },
        statusCode: {
            403: function(response) {
            },
            200:function(response){                
            },
        },
        success:function(){
            localStorage.removeItem("admin_token")
            window.location="/"
        }
    });
  });