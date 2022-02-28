var data = [];
$("#invoiceForm").submit(function(){
    var barcode = $('input[name=barcode]').val();
    var quantity = $('input[name=quantity]').val();
    $.ajax({
        url: "/branchapi/api/get-books/?barcode=" + barcode,
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Token " + localStorage.getItem("token")
            );
        },
        statusCode: {
            200: function (response) {
                if(response[0] == null){
                    $('.error').html('Barcode is invalid')
                }
                if(quantity > response[0]['quantity']){
                    $('.error').html('Available quantity is '+response[0]['quantity'] )
                }
                else{
                    if(data.length > 0){
                        var index= data.findIndex(x => x.id == response[0]['id'])
                        if(index === -1){
                            addData(barcode,response[0]['id'],response[0].book['name'],response[0].book['author'],response[0].book['id'],response[0].book['sales_rate'])
                        }
                        else{
                            udpdateData(response[0]['id'])
                        }
                    }
                    if(data.length === 0){
                        obj = {
                            'barcode':barcode,
                            'id': response[0]['id'],
                            'name': response[0].book['name'],
                            'author': response[0].book['author'],
                            'book_id': response[0].book['id'],
                            'quantity': '1',
                            'rate' : response[0].book['sales_rate']
                        }
                        data.push(obj)
    
                    }
                   return viewTable()
                }
            }
        }
    });
    return false
});

function udpdateData(id){
    for(var n = 0; n < data.length; n++) {
        if(data[n].id == id) {
            data[n].quantity = $('input[name=quantity]').val();
            viewTable()
        }
    }
    return false;
   
}
function addData(barcode,id,book,author,book_id,rate){
    obj1 = {
        'barcode':barcode,
        'id': id,
        'name': book,
        'author':author,
        'book_id':book_id,
        'quantity': $('input[name=quantity]').val(),
        'rate' : rate
    }
    data.push(obj1)
    return false;

}
function viewTable (){
    totalSum = [];
    $("#invoiceForm").trigger("reset");
    $("#tbodyMB").empty();
    for (var i = 0; i < data.length; i++) {
        var total = data[i].quantity * data[i].rate
        totalSum.push(total)
        var row = $("<tr />")
        $("#invoiceTable").append(row);
        row.append($("<td>" + data[i].name + "</td>"));
        row.append($("<td>" + data[i].quantity + "</td>"));
        row.append($("<td>" + data[i].rate + "</td>"));
        row.append($("<td>" + total + "</td>"));
        row.append($("<td>" + '<button id="btnDelete" type="button" class="btn btn-outline-secondary" value=' + data[i].id + ' deleterow"><i class="icofont-ui-delete text-danger"></i></button>' + "</td>"));
    }
    var sumCalc = totalSum.reduce(function(a, b){
        return a + b;
    }, 0);
    $('#invoiceTable').find('tbody')
    .append('<tr>').append('<td style="font-weight: bold;" colspan="3">Total:</td>')
    .append('<td style="font-weight: bold;">' + sumCalc + '</td>')
    .append('<tr>');
    return false
}

$(document).on('click', '#btnDelete', function () {
    remvoveIds($(this).val())
    $(this).closest('tr').remove();

});

function remvoveIds(id){
    for (var n = 0; n < data.length; n++) {
        if (data[n].id == id) {
            var removedObject = data.splice(n, 1);
            removedObject = null;
            viewTable();
        }
    }
}

$("#btnSubmit").click(function(){
    if(data.length > 0){
        $("#expadd").modal('show')

    }
    else{
        alert('No data')
    }
});

$("#customerForm").submit(function(){
    var data = $(this).serializeArray();
    $.ajax({
        url: "/branchapi/api/customer/",
        type: "POST",
        data: data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Token " + localStorage.getItem("token")
            );
        },
        statusCode: {
            201: function (response) {
                $("#expadd").modal('hide');
                $("#customerForm").trigger("reset");
                createInvoice(response['id'])

            }
        }
       
    })
    return false;
});

function createInvoice(customer){
    obj = {
        'data1':data,
        'customer':customer
    }
    obj['data1'] = JSON.stringify(obj['data1'])
    $.ajax({
        url: "/branchapi/create-invoice/",
        type: "POST",
        data: obj,       
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Token " + localStorage.getItem("token")
            );
        },
        statusCode: {
            201: function (response) {
                swal("Invoice Number is WBF"+customer, {
                    buttons: {
                      cancel: "Cancel!",
                      catch: {
                        text: "Print!",
                        value: "catch",
                      },
                    },
                  })
                  .then((value) => {
                    switch (value) {
                   
                      case "defeat":
                        swal("Pikachu fainted! You gained 500 XP!");
                        break;
                   
                      case "catch":
                        window.location('/branch/print/')
                    }
                  });
                  data = [];
                  viewTable()
               
            }
        },
    });

}

$('#barcode').keyup(function(){
    $('.error').html('')
});


$('#quantity').keyup(function(){
    $('.error').html('')
});