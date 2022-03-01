$(document).ready(function(){
    var searchParams = new URLSearchParams(window.location.search)
    var book_id = searchParams.get('book_id')
    var stock = searchParams.get('stock')
    $("#stock").html('Available stock: '+stock)
    $.ajax({
        url: "/warehouseapi/api/book-entries/?book_id="+book_id,
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Token " + localStorage.getItem("admin_token")
            );
        },
        success: function (data) {
            var table = $("#entryDetails").DataTable();
            table.clear();
            drawTable(data);
            function drawTable(data) {
                for (var i = 0; i < data.length; i++) {
                    drawRow(data[i]);
                }

            }
            function drawRow(rowData) {
                var tableData = [];
                tableData.push([rowData['date'],rowData['transfer_type'],rowData['stock']])
                table.draw();
                table.rows.add(tableData).draw();
               
        }
        }
    });
});