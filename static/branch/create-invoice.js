var data = [];

$("#invoiceForm").submit(function(){
    var barcode = $('input[name=barcode]').val();
    $.ajax({
        url: "/branchapi/api/get-books/?barcode=" + barcode,
        type: "GET",
        data: data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Token " + localStorage.getItem("token")
            );
        },
        statusCode: {
            200: function (response) {
                console.log(response[0]['id'])
                console.log(response[0].book['barcode'])
                if(data.length > 0){
                    for(var n = 0; n < data.length; n++) {
                        if(data[n].id == response[0]['id']) {
                            console.log('true')
                            data[n].quantity = $('input[name=quantity]').val();
                            console.log('0')
                            $("#tbodyMB").empty();
                            for (var i = 0; i < data.length; i++) {
                                var total = data[i].quantity * data[i].rate
                                var row = $("<tr />")
                                $("#invoiceTable").append(row);
                                row.append($("<td>" + data[i].name + "</td>"));
                                row.append($("<td>" + data[i].quantity + "</td>"));
                                row.append($("<td>" + data[i].rate + "</td>"));
                                row.append($("<td>" + total + "</td>"));
                                row.append($("<td>" + '<button id="btnDeleteMBk" type="button" class="btn btn-outline-secondary" value=' + data[i].id + ' deleterow"><i class="icofont-ui-delete text-danger"></i></button>' + "</td>"));
                            }
                        }
                        else{
                            obj = {
                                'id': response[0]['id'],
                                'name': response[0].book['name'],
                                'quantity': $('input[name=quantity]').val(),
                                'rate' : response[0].book['sales_rate']
                            }
                            data.push(obj)
                            console.log(data)
                            $("#tbodyMB").empty();
                            for (var i = 0; i < data.length; i++) {
                                var total = data[i].quantity * data[i].rate
                                var row = $("<tr />")
                                $("#invoiceTable").append(row);
                                row.append($("<td>" + data[i].name + "</td>"));
                                row.append($("<td>" + data[i].quantity + "</td>"));
                                row.append($("<td>" + data[i].rate + "</td>"));
                                row.append($("<td>" + total + "</td>"));
                                row.append($("<td>" + '<button id="btnDeleteMBk" type="button" class="btn btn-outline-secondary" value=' + data[i].id + ' deleterow"><i class="icofont-ui-delete text-danger"></i></button>' + "</td>"));
                            }
                        }
                    }
                }
                else{
                    obj = {
                        'id': response[0]['id'],
                        'name': response[0].book['name'],
                        'quantity': '1',
                        'rate' : response[0].book['sales_rate']
                    }
                    data.push(obj)
                    console.log(data)
                    $("#tbodyMB").empty();
                    for (var i = 0; i < data.length; i++) {
                        var total = data[i].quantity * data[i].rate
                        var row = $("<tr />")
                        $("#invoiceTable").append(row);
                        row.append($("<td>" + data[i].name + "</td>"));
                        row.append($("<td>" + data[i].quantity + "</td>"));
                        row.append($("<td>" + data[i].rate + "</td>"));
                        row.append($("<td>" + total + "</td>"));
                        row.append($("<td>" + '<button id="btnDeleteMBk" type="button" class="btn btn-outline-secondary" value=' + data[i].id + ' deleterow"><i class="icofont-ui-delete text-danger"></i></button>' + "</td>"));
                    }
                }
               
            }
        }
    });
    return false
});

function viewTable (){
    $("#tbodyMB").empty();
    for (var i = 0; i < data.length; i++) {
        var total = data[i].quantity * data[i].rate
        var row = $("<tr />")
        $("#invoiceTable").append(row);
        row.append($("<td>" + data[i].name + "</td>"));
        row.append($("<td>" + data[i].quantity + "</td>"));
        row.append($("<td>" + data[i].rate + "</td>"));
        row.append($("<td>" + total + "</td>"));
        row.append($("<td>" + '<button id="btnDeleteMBk" type="button" class="btn btn-outline-secondary" value=' + data[i].id + ' deleterow"><i class="icofont-ui-delete text-danger"></i></button>' + "</td>"));
    }
    return false
}