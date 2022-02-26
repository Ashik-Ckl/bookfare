$(document).ready(function () {
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
                var row = $("<tr />")
                $("#branchTable").append(row);
                row.append($("<td>" + rowData["name"] + "</td>"));
                row.append($("<td>" + rowData["phone"] + "</td>"));
                row.append($("<td>" + rowData["place"] + "</td>"));
                row.append($("<td>" + rowData["address"] + "</td>"));
                row.append($("<td>" + '<a href="/add-user/'+rowData['id']+'"><button type="button" value=' + rowData["id"] + ' class="btn btn-outline-primary">Add</button></a>' + "</td>"));
                row.append($("<td>" + '<button id="btnEdit" type="button" class="btn btn-outline-secondary" value=' + rowData["id"] + '  data-bs-toggle="modal" data-bs-target="#expedit"><i class="icofont-edit text-success"></i></button>' + "</td>"));
                row.append($("<td>" + '<button id="btnDelete" type="button" class="btn btn-outline-secondary" value=' + rowData["id"] + ' deleterow"><i class="icofont-ui-delete text-danger"></i></button>' + "</td>"));

            }
        }
    });
});
$("#branchForm").validate({
    rules: {
        name: {
            required: true,
        },
        type: {
            required: true,
        },
        messages: {
            name: {
                required: "This filed is required",
            },
            type: {
                required: "This field is required"
            }
        }
    },
    submitHandler: function (e) {
        var data = $(e).serializeArray();
        var editId = $("#editId").val();
        if (editId != 0) {
            $.ajax({
                url: "/warehouseapi/api/branch/" + editId + "/",
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
                    $("#branchForm").trigger("reset");
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
                url: "/warehouseapi/api/branch/",
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
                        $("#branchForm").trigger("reset");
                        setTimeout(function () {
                            $("#successAlert").hide();
                        }, 1500);
                        var row = $("<tr />")
                        $("#branchTable").append(row);
                        row.append($("<td>" + response["name"] + "</td>"));
                        row.append($("<td>" + response["phone"] + "</td>"));
                        row.append($("<td>" + response["place"] + "</td>"));
                        row.append($("<td>" + response["address"] + "</td>"));
                        row.append($("<td>" + '<a href="/add-user/'+response['id']+'"><button type="button" value=' + response["id"] + ' class="btn btn-outline-primary">Add</button></a>' + "</td>"));
                        row.append($("<td>" + '<button id="btnEdit" type="button" class="btn btn-outline-secondary" value=' + response["id"] + '  data-bs-toggle="modal" data-bs-target="#expedit"><i class="icofont-edit text-success"></i></button>' + "</td>"));
                        row.append($("<td>" + '<button id="btnDelete" type="button" class="btn btn-outline-secondary" value=' + response["id"] + ' deleterow"><i class="icofont-ui-delete text-danger"></i></button>' + "</td>"));
                    }
                }
            });
        }

        return false;
    }
});



$(document).on('click', '#btnEdit', function () {
    var name = $(this).closest('tr').find("td:eq(0)").html();
    var phone = $(this).closest('tr').find("td:eq(1)").html();
    var place = $(this).closest('tr').find("td:eq(2)").html();
    var address = $(this).closest('tr').find("td:eq(3)").html();
    var id = $(this).val();
    $('input[name=name]').val(name);
    $('input[name=phone]').val(phone);
    $('input[name=place]').val(place);
    $('textarea[name=address]').val(address);
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
                    url: "/warehouseapi/api/branch/" + id + "/",
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


