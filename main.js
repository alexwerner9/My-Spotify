console.log("beginning");

console.log(encodeURIComponent('https://www.google.com/'));

let url = 'https://accounts.spotify.com/authorize?';
let params = new URLSearchParams({client_id:'d8f5f88f01a644ee803480f73bda4708',
                                  response_type:'code',
                                  redirect_uri:encodeURIComponent('http://localhost:8080/')});

console.log(url+params);
console.log(encodeURIComponent('http://localhost:8080/'));