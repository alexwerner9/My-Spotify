var intervalId = window.setInterval(function(){
    $.ajax({
        type:'GET',
        url:'https://thawing-island-42941.herokuapp.com/updatesong',
        success:function(response) {
            $('#song').html(response.song);
            $('#artist').html(response.artist);
            $('#albumIMG').attr('src', response.albumIMG);
        },
        error:function(response) {
            console.log("error in AJAX");
        }
    });
}, 1000);