$(document).ready(function(){
    $.ajax({
        url: "/warehouseapi/api/branch/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Token " + localStorage.getItem("admin_token")
            );
        },
        success: function (obj) {
            var response    = JSON.parse(JSON.stringify(obj));
            var qty
            var book 
            for (var i= 0; i<response.length; i++){
                if(response[i].stocks[0]['quantity'] != null){
                    qty = response[i].stocks[0]['quantity']
                }
                else{
                    qty = 0
                }
                if(response[i].stocks[0]['bkcnt'] != null){
                    book = response[i].stocks[0]['bkcnt']
                }
                else{
                    book = 0
                }
            $("#branchBasedBookDetailsDiv").append("<div class='col-xl-4 col-lg-6'>\
            <div class='card l-bg-blue-dark'>\
                <div class='card-statistic-3 p-4'>\
                    <div class='card-icon card-icon-large'><i class='fas fa-users'></i></div>\
                    <div class='mb-4'>\
                        <h5 class='card-title mb-0'>"+ response[i].name+"</h5>\
                    </div>\
                    <div class='row align-items-center mb-2 d-flex'>\
                        <div class='col-8'>\
                        <h2 class='d-flex align-items-center mb-0'>Books:"+book+"</h2>\
                            <h2 class='d-flex align-items-center mb-0'>quantity:"+qty+"</h2>\
                        </div>\
                    </div>\
                </div>\
            </div>\
        </div>")
        }
    }
    })
});

$(document).ready(function(){
    $.ajax({
        url: "/warehouseapi/api/book/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Token " + localStorage.getItem("admin_token")
            );
        },
        success: function (response) {
            $("#totalBooks").html(response.length)
        }
    });
})