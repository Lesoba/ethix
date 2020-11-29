//ARTICLES
// TOP 10 Articles
 
function receiveData(data) {
    var output = '<ul data-role="listview" data-inset="false" data-theme="b" data-divider-theme="b">';
    $.each(data, function (key, val) {
        output += '<li data-role="list-divider">' + val.metadata.PublishDate + ' <img src="images/tei.png" class="ui-li-icon" />';
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
// Detail
    $.getJSON('https://netresult.co.za/ethix/wp-json/wp/v2/posts/' + id + '',
        function (data) {
            var artdet = '';
            artdet += '<div class="ui-bar ui-bar-b">' + data.title.rendered + '</div>';
            artdet += '<div class="ui-body ui-body-a">';
            artdet += '<div class="artmeta">' + data.metadata.PublishDate + '<strong> | </strong>' + data.metadata.Writer + '</div>';
            artdet += '<br><p>' + data.content.rendered + '</p></div>';
            $('#mypost').html(artdet);

        });
}
