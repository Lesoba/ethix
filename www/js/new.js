function receiveData(data) {
     
    var output = "";
	var dateadded = '<div class="ui-body ui-body-b">01 September 2020</div>';
	
	
    $.each(data, function (key, val) {
        var typeoflink = val.tags;
		output += '<div class="ui-bar ui-bar-b">' + val.title.rendered + '</div>';
        output += '<div class="ui-body ui-body-a">';
              
        output += '<p>';
        
		if (typeoflink.includes(6)) {
            output += '<a class="btnnew" href="#" onclick="window.location.href = \'video.html\'">Watch Videos</a>' ;      
        } 
        else if (typeoflink.includes(5)) {
            output += '<a class="btnnew" href="#" onclick="window.location.href = \'article.html\'">View Articles</a>' ;      
        }
        else if (typeoflink.includes(7)) {
            output += '<a class="btnnew" href="#" onclick="window.location.href = \'events.html\'">View Events</a>' ;      
        }
		output += val.content.rendered;
        output += '</p></div>';
   
    });

    $('#postlist').html(output);
	$('#dateadded').html(dateadded);
}

function getad(data) {
     
    var advone = "";
    $.each(data, function (key, val) {
	advone += val.content.rendered	
    });

	$('#ad1').html(advone);
}

