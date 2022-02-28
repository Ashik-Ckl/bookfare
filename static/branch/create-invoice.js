var data = {}

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
                console.log(response[0][1].book['barcode'])
                for (var n = 0; n < data.length; n++) {
                    if (data[n].id == response['id']) {
                        data[n].quantity = parseInt(data[n].quantity) + parseInt(1)
                        console.log('0')
                        console.log(data)
                    }
                    else{
                        console.log('not')
                        obj = {
                            'id': response['id'],
                            'name': response['name'],
                            'quantity': 1,
                            'rate' : response.book['sales_rate']
                        }
                        data.push(obj)
                        console.log('1')
                        console.log(data)
                    }
                  
                }
            }
        }
    });
    return false
});