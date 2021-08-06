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
var doneTypingInterval = 200;
var bar = document.getElementById('search_bar');

bar.addEventListener('keyup', function() {
    clearTimeout(typingTimer);
    if(bar.value) {
        typingTimer = setTimeout(doneTyping, doneTypingInterval);
    }
    if(!bar.value) {
        document.getElementById('song_results').style.display = "none";
    }
});

var songURIs= {}

function doneTyping() {
    $('.songs').css("background-color", "rgb(39, 60, 39)");
    $('#song1').attr("onclick", "song1Clicked()");
    $('#song2').attr("onclick", "song2Clicked()");
    $('#song3').attr("onclick", "song3Clicked()");
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
            $('#song1').css("background-color","green");
            $('#song1').html("Added");
            $('#song1').attr("onclick", "");
        },
        error:function(response) {
            console.log("Couldnt add song");
        }
    });

}

function song2Clicked() {

    $.ajax({
        type:'POST',
        url:'http://www.alex-werner.com/addsong',
        data:JSON.stringify({"uri":songURIs.song2}),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        success:function(response) {
            console.log("Added song");
            $('#song2').css("background-color","green");
            $('#song2').html("Added");
            $('#song2').attr("onclick", "");
        },
        error:function(response) {
            console.log("Couldnt add song");
        }
    });

}

function song3Clicked() {

    $.ajax({
        type:'POST',
        url:'http://www.alex-werner.com/addsong',
        data:JSON.stringify({"uri":songURIs.song3}),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        success:function(response) {
            console.log("Added song");
            $('#song3').css("background-color","green");
            $('#song3').html("Added");
            $('#song3').attr("onclick", "");
        },
        error:function(response) {
            console.log("Couldnt add song");
        }
    });

}