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

document.getElementById('search_bar').addEventListener('input', function(element) {

    console.log(element.target.value);
    $.ajax({
        type:'POST',
        url:'http://www.alex-werner.com/search',
        body: JSON.stringify({'input':element.target.value,"test":"test data"}),
        headers; {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        success:function(response) {
            console.log(response);
        },
        error:function(response) {
            console.log("Couldnt search");
        }
    });

})

function playlistClicked() {
    
    if(document.getElementById('panel').style.display == "none") {
        document.getElementById('panel').style.display = "block";
        document.getElementById('search_bar').style.display = "none";
        document.getElementById('main_div').style.top = "50%";
        $('#playlist').html("Add a song to my playlist");        
    } else {
        document.getElementById('panel').style.display = "none";
        document.getElementById('search_bar').style.display = "initial";
        document.getElementById('main_div').style.top = "20%";
        $('#playlist').html("Return to current song");
    }
}