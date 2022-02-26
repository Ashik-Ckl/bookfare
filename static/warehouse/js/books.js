$("#bookTable").DataTable();

$(document).ready(function () {
    return bookdetails()
});

function bookdetails(){
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
            var table = $("#bookTable").DataTable();
            table.clear();
            drawTable(response);
            function drawTable(data) {
                for (var i = 0; i < data.length; i++) {
                    drawRow(data[i]);
                }

            }
            function drawRow(rowData) {
                var tableData = [];
                var id = ''
                if (rowData['quantity'] != 0){
                    var id = "<input type='checkbox' id='bkChkID' class='cbCheck' value="+ rowData['id']+">"
                }
                else{
                    var id = "<input type='checkbox' id='bkChkID' class='cbCheck' disabled value="+ rowData['id']+">"
                }
                var nowAt = '<button id="btnView" type="button" class="btn btn-outline-secondary" value=' + rowData["id"] + '  data-bs-toggle=""><i class="icofont-eye-alt text-primary"></i></button>' 
                var edit = '<button id="btnEdit" type="button" class="btn btn-outline-secondary" value=' + rowData["id"] + '  data-bs-toggle="modal" data-bs-target="#expedit"><i class="icofont-edit text-success"></i></button>'
                var deleteBk = '<button id="btnDelete" type="button" class="btn btn-outline-secondary" value=' + rowData["id"] + ' deleterow"><i class="icofont-ui-delete text-danger"></i></button>'
                tableData.push([id,rowData['barcode'],rowData["name"],rowData["author"],nowAt,rowData['purchase_rate'],rowData['sales_rate'], rowData["quantity"],edit,deleteBk])
                table.draw();
                table.rows.add(tableData).draw();
            }
        }
    });
}
$("#bookForm").validate({
    rules: {
        name: {
            required: true,
        },
        author: {
            required: true,
        },
        barcode: {
            required: true,
        },
        sales_rate: {
            required: true,
        },
        quantity: {
            required: true,
        },
        messages: {
            name: {
                required: "This filed is required",
            },
            author: {
                required: "This field is required"
            },
            purchase_rate: {
                required: "This filed is required",
            },
            sales_rate: {
                required: "This field is required"
            },
            quantity: {
                required: "This field is required"
            }
        }
    },
    submitHandler: function (e) {
        var data = $(e).serializeArray();
        var editId = $("#editId").val();
        if (editId != 0) {
            $.ajax({
                url: "/warehouseapi/api/book/" + editId + "/",
                type: "PUT",
                data: data,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader(
                        "Authorization",
                        "Token " + localStorage.getItem("admin_token")
                    );
                },
                success: function () {
                    $("#expadd").modal('hide');
                    $("#bookForm").trigger("reset");
                    swal("Poof! Updated Successfully!", {
                        icon: "success",
                    });
                    setTimeout(function () {
                        location.reload();
                    }, 100);
                }

            });
        }
        else {
            $.ajax({
                url: "/warehouseapi/api/book/",
                type: "POST",
                data: data,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader(
                        "Authorization",
                        "Token " + localStorage.getItem("admin_token")
                    );
                },
                statusCode: {
                    201: function (response) {
                        $("#expadd").modal('hide');
                        swal("Poof! Created Successfully!", {
                            icon: "success",
                        });
                        $("#bookForm").trigger("reset");
                        setTimeout(function () {
                            $("#successAlert").hide();
                        }, 1500);
                        var table = $("#bookTable").DataTable();
                        var tableData = [];
                        var id = "<input id='bkChkID' type='checkbox' value="+ response['id']+">"
                        var nowAt = '<button id="btnView" type="button" class="btn btn-outline-secondary" value=' + response["id"] + '  data-bs-toggle=""><i class="icofont-eye-alt text-primary"></i></button>' 
                        var edit = '<button id="btnEdit" type="button" class="btn btn-outline-secondary" value=' + response["id"] + '  data-bs-toggle="modal" data-bs-target="#expedit"><i class="icofont-edit text-success"></i></button>'
                        var deleteBk = '<button id="btnDelete" type="button" class="btn btn-outline-secondary" value=' + response["id"] + ' deleterow"><i class="icofont-ui-delete text-danger"></i></button>'
                        tableData.push([id,response['barcode'],response["name"],response["author"],nowAt,response['purchase_rate'],response['sales_rate'], response["quantity"],edit,deleteBk])
                        table.draw();
                        table.rows.add(tableData).draw();
                    }
                }
            });
        }

        return false;
    }
});

$(document).on('click', '#btnEdit', function () {
    var barcode = $(this).closest('tr').find("td:eq(1)").html();
    var name = $(this).closest('tr').find("td:eq(2)").html();
    var author = $(this).closest('tr').find("td:eq(3)").html();
    var purchaseRate = $(this).closest('tr').find("td:eq(5)").html();
    var salesRate = $(this).closest('tr').find("td:eq(6)").html();
    var quantity = $(this).closest('tr').find("td:eq(7)").html();
    var id = $(this).val();
    $('input[name=barcode]').val(barcode);
    $('input[name=name]').val(name);
    $('input[name=author]').val(author);
    $('input[name=purchase_rate]').val(purchaseRate);
    $('input[name=sales_rate]').val(salesRate);
    $('input[name=quantity]').val(quantity);
    $("#editId").val(id)
    $("#expadd").modal('show');
    $("#btnSubmit").html('Update')
});


$(document).on('click', '#btnDelete', function () {
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this datas!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                var id = $(this).val();
                $(this).closest('tr').remove();
                $.ajax({
                    url: "/warehouseapi/api/book/" + id + "/",
                    type: "DELETE",
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader(
                            "Authorization",
                            "Token " + localStorage.getItem("admin_token")
                        );
                    },
                    success: function () {
                        swal("Poof! Deleted Successfully!", {
                            icon: "success",
                        });
                    }
                })

            } else {
                swal("Your imaginary file is safe!");
            }
        });

});

$("#btnReset").click(function () {
    $("#branchForm").trigger("reset");
});




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
        success: function (response) {
            drawTable(response);

            function drawTable(data) {
                for (var i = 0; i < data.length; i++) {
                    drawRow(data[i]);
                }

            }
            function drawRow(rowData) {
                $("#branch1").append($('<option>').text(rowData['name']).attr('value', rowData['id']));
            }
        }
    });
})


$(document).on('click', '#btnView', function () {
    $.ajax({
        url: "/warehouseapi/api/transfer-books-get/?book_id="+$(this).val(),
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Token " + localStorage.getItem("admin_token")
            );
        },
        success: function (response) {
            $("#tbodyMBV").empty();
            for(var i =0 ; i<response.length; i++){
                var row = $("<tr />")
                $("#manageBookViewTable").append(row);
                row.append($("<td>" + response[i].book['name'] + "</td>"));
                row.append($("<td>" + response[i].branch['name'] + "</td>"));
                row.append($("<td>" + response[i].quantity + "</td>")); 
            }
            $("#view-book").modal('show');
        }
    });
});