var data = [];

$("#bookTable").on("change", ".cbCheck", function () {
    var id = $(this).attr("value");
    if ($(this).prop('checked') == true) {
        $.ajax({
            url: "/warehouseapi/api/book/" + id + "/",
            type: "GET",
            data: data,
            beforeSend: function (xhr) {
                xhr.setRequestHeader(
                    "Authorization",
                    "Token " + localStorage.getItem("admin_token")
                );
            },
            statusCode: {
                200: function (response) {
                    obj = {
                        'id': id,
                        'name': response['name'],
                        'quantity': response['quantity'],
                        'transfer_quantity': '1',
                    }
                    data.push(obj)
                }
            }
        });
    }
    else {
        remvoveIds(id)
    }

});

$("#btnManageBooks").click(function () {
    if(data.length > 0){
    $("#manage-book").modal('show');
    $("#tbodyMB").empty();
    for (var i = 0; i < data.length; i++) {
        var row = $("<tr />")
        $("#manageBookTable").append(row);
        row.append($("<td>" + data[i].id + "</td>"));
        row.append($("<td>" + data[i].name + "</td>"));
        row.append($("<td>" + data[i].quantity + "</td>"));
        row.append($("<td><input type='number' min='1' name='qty-input' class='input-qty inp-bk' max=" + data[i].quantity + " value=" + data[i].transfer_quantity + " id=" + data[i].id + "></td>"));
        row.append($("<td>" + '<button id="btnDeleteMBk" type="button" class="btn btn-outline-secondary" value=' + data[i].id + ' deleterow"><i class="icofont-ui-delete text-danger"></i></button>' + "</td>"));
    }
}
else{
    alert('Please select books')
}
})


// $('body').on('keyup', 'input[type=number]', function (e) {
//     var id = $(this).attr('id')
//     setTimeout(function () {
//         var qty = $("#" + id).val();
//         for (var n = 0; n < data.length; n++) {
//             if (data[n].id == id) {
//                 data[n].transfer_quantity = qty
//             }
//         }
//     }, 500);
// });




$("#btnSubmitMB").click(function () {
    if($("#branch1").val() != null ){
        if(data.length > 0){
            obj = {
                'data1':data,
                'branch':$("#branch1").val()
            }
            obj['data1'] = JSON.stringify(obj['data1'])
            $.ajax({
                url: "/warehouseapi/transfer-books/",
                type: "POST",
                data: obj,       
                beforeSend: function (xhr) {
                    xhr.setRequestHeader(
                        "Authorization",
                        "Token " + localStorage.getItem("admin_token")
                    );
                },
                statusCode: {
                    201: function (response) {
                        bookdetails()
                        $("#manage-book").modal('hide');
                        swal("Poof! Transfered Successfully!", {
                            icon: "success",
                        });
                        data = [];
                       
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(textStatus, errorThrown);
                  }
        
            });
        }
        else{
            $("#manage-book").modal('hide');
            swal("Poof! Please select...!", {
                icon: "error",
            });

        }
      
    }
    else{
        alert('select branch')
    }
    
});

$(document).on('click', '#btnDeleteMBk', function () {
    remvoveIds($(this).val())
    $(this).closest('tr').remove();

});

function remvoveIds(id){
    for (var n = 0; n < data.length; n++) {
        if (data[n].id == id) {
            var removedObject = data.splice(n, 1);
            removedObject = null;
            break;
        }
    }
}

$(document).on("change paste keyup", "input[name='qty-input']", function(){
    var maxLength = $(this).attr('max')
    var id = $(this).attr('id')
    setTimeout(function () {
        var qty = $("#" + id).val();
        console.log(qty)
        console.log(maxLength)
        if (parseInt(qty)> parseInt(maxLength)){
            alert('Availabe quantity is'+maxLength)
            var qty = $("#" + id).val(maxLength);
        }
        else{
            for (var n = 0; n < data.length; n++) {
                if (data[n].id == id) {
                    data[n].transfer_quantity = qty
                }
            }
        }
    }, 500);
});