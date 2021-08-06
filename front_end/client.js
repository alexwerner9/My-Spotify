var intervalId = window.setInterval(function(){
    $.ajax({
        type:'GET',
        url:'http://www.alex-werner.com/updatesong',
        success:function(response) {
            $('#song').html(response.song);
            $('#title').html(response.song);
            $('#artist').html(response.artist);
            $('#albumIMG').attr('src', response.albumIMG);
            $('#panel').attr('href',response.songURL);
            $('#favicon').attr('href',response.albumIMG);
        },
        error:function(response) {
            console.log("error in AJAX");
        }
    });
}, 2000);

var typingTimer;
var doneTypingInterval = 1000;
var bar = document.getElementById('search_bar');

bar.addEventListener('keyup', function() {
    clearTimeout(typingTimer);
    if(bar.value) {
        typingTimer = setTimeout(doneTyping, doneTypingInterval);
    }
});

var songURIs= {}

function doneTyping() {
    $.ajax({
        type:'POST',
        url:'http://www.alex-werner.com/search',
        data: JSON.stringify({'input':document.getElementById('search_bar').value}),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        success:function(response) {
            if(document.getElementById('song_results').style.display = "none") {
                console.log('none');
                document.getElementById('song_results').style.display = "block";
            }
            $("#song1").html(response.song1.name + " - " + response.song1.artist);
            $("#song2").html(response.song2.name + " - " + response.song2.artist);
            $("#song3").html(response.song3.name + " - " + response.song3.artist);

            songURIs = {
                "song1":response.song1.uri,
                "song2":response.song2.uri,
                "song3":response.song3.uri
            }

        },
        error:function(response) {
            console.log("Couldnt search");
        }
    });
}


function playlistClicked() {
    
    if(document.getElementById('panel').style.display == "none") {
        document.getElementById('panel').style.display = "block";
        document.getElementById('search').style.display = "none";
        $('#playlist').html("Add a song to my playlist");        
    } else {
        document.getElementById('panel').style.display = "none";
        document.getElementById('search').style.display = "initial";
        $('#playlist').html("Return to current song");
    }
}

function song1Clicked() {

    console.log(songURIs.song1);

    $.ajax({
        type:'POST',
        url:'http://www.alex-werner.com/addsong',
        data:JSON.stringify({"uri":songURIs.song1}),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        success:function(response) {
            console.log("Added song");
        },
        error:function(response) {
            console.log("Couldnt add song");
        }
    });

}