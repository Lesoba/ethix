function receiveData(data) {
    var output = '<ul data-role="listview" data-inset="false" data-theme="a" data-divider-theme="a">';
    $.each(data, function (key, val) {
        output += '<li data-role="list-divider">' + val.title.rendered + '</li>';
        output += '<li data-icon="false" class="quote">';
        output += val.content.rendered;
        output += '</li>';

    });
    output += '</ul>';
output += '<div class="ui-body ui-body-a greenhead"> <p style="font-size: 15px;">We will soon be asking you to contribute your favourite ethics quote... save to share!<strong> </strong></p></div>';
    $('#postlist').html(output);
	
	
}

