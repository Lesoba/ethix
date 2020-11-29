function receiveData(data) { 
    var output = "";
    $.each(data, function (key, val) {
        var typeoflink = val.categories;
		output += '<div class="ui-bar ui-bar-b">' + val.title.rendered + '</div>';
        output += '<div class="ui-body ui-body-a">';
        output += '<p>';
        output += val.content.rendered + '</p>';
        output += '</div>';
    });
    $('#postlist').html(output);
}
function getad(data) {
     
    var advone = "";
    $.each(data, function (key, val) {
	advone += val.content.rendered	
    });

	$('#ad1').html(advone);
}