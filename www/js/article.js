//ARTICLES
// TOP 10 Articles
 
function receiveData(data) {
    var output = '<ul data-role="listview" data-inset="false" data-theme="b" data-divider-theme="b">';
    $.each(data, function (key, val) {
        output += '<li data-role="list-divider">' + val.metadata.PublishDate;
        output += '<p class="ui-li-aside"> ' + val.metadata.Writer + '</p> </li>';
		
        output += '<li data-icon="false">';
        output += '<a href="#blogpost" onclick="showPost(' + val.id + ')" data-transition="slide">';
        output += '<p><strong>' + val.title.rendered + '</strong><br>';
        output += val.excerpt.rendered + '</p>';
        output += '</a></li>';
    });
    output += '</ul>';

    $('#postlist').html(output);
}
// Article Detail and Comments
function showPost(id) {
// AddTrack	
	$.ajax({
            url: 'https://ethix.app/wpapp/query.php?id=' + id + '' ,
            data: {
                
            },
            dataType : 'json'
        });
// Detail
    $.getJSON('https://ethix.app/wpapp/wp-json/wp/v2/posts/' + id + '',
        function (data) {
            var artdet = '';
            artdet += '<div class="ui-bar ui-bar-b">' + data.title.rendered + '</div>';
            artdet += '<div class="ui-body ui-body-a">';
            artdet += '<div class="artmeta">' + data.metadata.PublishDate + '<strong> | </strong>' + data.metadata.Writer + '</div>';
            artdet += '<br><p>' + data.content.rendered + '</p></div>';
            $('#mypost').html(artdet);
// Comment Fields	
		var currentdate = new Date(); 
    var datetime = currentdate.getFullYear() + "-"
                + (currentdate.getMonth()+1)  + "-" 
                + currentdate.getDate() + "  "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();

$(document).ready(function(){
	$('#commentUserID').val(localStorage.getItem("userID"));
	$('#commentAuthor').val(localStorage.getItem("userUser"));
	$('#commentEmail').val(localStorage.getItem("userEmail"));
	$('#commentDate').val(datetime);
	$('#commentArticleID').val(id);
});
        });

var maxLength = 256;
$('#articleComment').keyup(function() {
  var textlen = maxLength - $(this).val().length;
  $('#rchars').text(textlen  + " remaining");
});	
	
// Comments
    $.getJSON('https://ethix.app/wpapp/wp-json/wp/v2/comments?post=' + id + '',
        function (comment) {
            var artcomment = '<div class="ui-body ui-body-a">';
            $.each(comment, function (key, val) {
				if (val.content.rendered !== '') {
                var replaced = val.content.rendered.replace(/<p[^>]*>/g, "");
				
                artcomment += '<span class="aside">@' + val.author_name + val.author + '</span>' + replaced + '<hr>';
					}
            });
            artcomment += '<p>&nbsp;</p></div>';
            $('#mycomment').html(artcomment);
        });
}
