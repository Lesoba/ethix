//ARTICLES
// TOP 10 Articles
 
function receiveData(data) {
    
    var output = '<ul data-role="listview" data-inset="false" data-theme="a" data-divider-theme="a">';
    $.each(data, function (key, val) {
        showPost(val.id)
        output += '<li data-role="list-divider">' + val.title.rendered + '</li>';
		output += '<div class="ui-body ui-body-a">';
        output += '<li data-icon="false"><p>';
        output += val.content.rendered;
        output += '</p></li>';
		output += '</div>';
    });
    output += '</ul>';

    $('#postlist').html(output);
}
// Article Detail and Comments
function showPost(id) {
// Detail
    $.getJSON('https://ethix.app/wpapp/wp-json/wp/v2/posts/' + id + '',
        function (data) {

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

var maxLength = 512;
$('#articleComment').keyup(function() {
  var textlen = maxLength - $(this).val().length;
  $('#rchars').text(textlen  + " remaining");
});	
	
// Comments
    $.getJSON('https://ethix.app/wpapp/wp-json/wp/v2/comments?post=' + id + '',
        function (comment) {
            var artcomment = '<div class="ui-body ui-body-a">';
            $.each(comment, function (key, val) {
                var replaced = val.content.rendered.replace(/<p[^>]*>/g, "");
                artcomment += '<span class="aside">@' + val.author_name + val.author + '</span>' + replaced + '<hr>';
            });
            artcomment += '</div>';
            $('#mycomment').html(artcomment);
        });
}
function getad(data) {
     
    var advone = "";
    $.each(data, function (key, val) {
	advone += val.content.rendered	
    });

	$('#ad2').html(advone);
}