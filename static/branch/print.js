$(document).ready(function(){
    var searchParams = new URLSearchParams(window.location.search)
    var customer = searchParams.get('invoice_no')
    $.ajax({
        url: "/branchapi/api/invoices/?customer="+customer,
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Token " + localStorage.getItem("token")
            );
        },
        success: function (data) {
            console.log(data)
            var totalSum = []
            for (var i = 0; i < data.length; i++) {
                var total = parseInt(data[i].sales_rate) * parseInt(data[i].quantity)
                totalSum.push(total)
                var row = $("<tr />")
                $("#invoiceTable").append(row);
                row.append($("<td>" + data[i].book_name + "</td>"));
                row.append($("<td>" + data[i].quantity + "</td>"));
                row.append($("<td>" + data[i].sales_rate + "</td>"));
                row.append($("<td>" + total + "</td>"));
            }
            var sumCalc = totalSum.reduce(function(a, b){
                return a + b;
            }, 0);
            $('#invoiceTable').find('tbody')
            .append('<tr>').append('<td style="font-weight: bold;" colspan="2"></td>')
            .append('<td style="font-weight: bold;">Total:</td>')
            .append('<td style="font-weight: bold;">' + sumCalc + '</td>')
            .append('<tr>');
        }
    });
});