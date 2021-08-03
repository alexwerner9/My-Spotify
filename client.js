var intervalId = window.setInterval(function(){
    $.ajax({
        type:'GET',
        url:'http://www.alex-werner.com/updatesong',
        success:function(response) {
            $('#song').html(response.song);
            $('#title').html(response.song);
            $('#song').attr('href', response.songURL);
            $('#artist').html(response.artist);
            $('#albumIMG').attr('src', response.albumIMG);
            $('#panel').attr('href',response.songURL);
            $('#favicon').attr('href',response.albumIMG);
        },
        error:function(response) {
            console.log("error in AJAX");
        }
    });
}, 1000);