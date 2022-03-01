$("#bookTable").DataTable();

$(document).ready(function(){
    invoices()
});

function invoices(){
    $.ajax({
        url: "/branchapi/api/customer/",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Token " + localStorage.getItem("token")
            );
        },
        success: function (response) {
            console.log(response)
            var table = $("#invoiceTable").DataTable();
            table.clear();
            drawTable(response);
            function drawTable(data) {
                for (var i = 0; i < data.length; i++) {
                    drawRow(data[i]);
                }
            }
            function drawRow(rowData) {
                var count = 1;
                var tableData = [];
                var invoiceNumber = 'WBF'+rowData['id']
                var sumTotal = rowData['total_amount'].reduce(function(a, b){
                    return a + b;
                }, 0);
                var tootal = '00'+sumTotal
                var view = '<a href="/branch/invoice/?invoice_no='+rowData['id']+'"><button id="btnEdit" type="button" class="btn btn-outline-secondary" value=' + rowData["id"] + '  data-bs-toggle="modal" data-bs-target="#expadd"><i class="icofont-eye-alt text-primary"></i></button></a>'
                tableData.push([invoiceNumber,rowData['address'],rowData['phone'],'00'+sumTotal,view])
                table.draw()
                table.rows.add(tableData).draw();
                
            }
        }
    });
}

$(document).on('click', '#btnEdit', function () {
    $("#editId").val($(this).val())
    var qty = $(this).closest('tr').find("td:eq(4)").html();
    $("#qty").val(qty)
});



$("#bookForm").submit(function(){
    var data = $(this).serializeArray();
    console.log(data)
    var quantity = $("input[name=quantity]").val();
    var previousQty = $("#qty").val();
    var id = $("#editId").val();
    console.log(quantity)
    console.log(previousQty)
    if(parseInt(quantity) > parseInt(previousQty)){
        $('.error').html('quantiy cannot be greater than stock')
    }
    else{
        $('.error').html('')
        $.ajax({
            url: "/branchapi/api/get-books/"+id+"/",
            type: "PUT",
            data:data,
            beforeSend: function (xhr) {
                xhr.setRequestHeader(
                    "Authorization",
                    "Token " + localStorage.getItem("token")
                );
            },
            success: function (response) {
                books()
                $("#expadd").modal('hide');
                $("#bookForm").trigger("reset");
                swal("Poof! Transfered Successfully!", {
                    icon: "success",
                });
            }
        });

    }
    return false;
});