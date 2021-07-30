var intervalId = window.setInterval(function(){
    $.ajax({
        type:'GET',
        url:'https://thawing-island-42941.herokuapp.com/updatesong',
        success:function(response) {
            $('#song').html(response.song);
            $('#song').attr('href', response.songURL);
            $('#artist').html(response.artist);
            $('#albumIMG').attr('src', response.albumIMG);
            console.log(response.songURL);
        },
        error:function(response) {
            console.log("error in AJAX");
        }
    });
}, 1000);