$(document).ready(function(){
    var table = $("#entryDetails").DataTable();
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
                "Token " + localStorage.getItem("token")
            );
        },
        success: function (data) {
            tableData = [];
            for (var i = 0; i < data.length; i++) {
                tableData.push([data[i].date,data[i].transfer_type,data[i].stock])
                table.draw();
                table.rows.add(tableData).draw();
               
            }
        }
    });
});