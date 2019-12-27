function tplawesome(e,t){res=e;for(var n=0;n<t.length;n++){res=res.replace(/\{\{(.*?)\}\}/g,function(e,r){return t[n][r]})}return res}
var append;
var results;
//get the url that the client used to connect the server
var url = window.location.href;
// initializing socket, connection to server
var socket = io.connect(url);
socket.on("connect", data => {
  socket.emit("join", url);
});
$(function() {
    $("form").on("submit", function(e) {
       e.preventDefault();
       // prepare the request
       var request = gapi.client.youtube.search.list({
            part: "snippet",
            type: "video",
            q: encodeURIComponent($("#search").val()).replace(/%20/g, "+"),
            maxResults: 13,
            order: "viewCount",
            publishedAfter: "2015-01-01T00:00:00Z"
       }); 
       // execute the request
       request.execute(function(response) {
          results = response.result;
          $("#results").html("");
          var rb = 'R';
          $.each(results.items, function(index, item) {
            $.get("/public/viralvideos-master/tpl/item.html", function(data) {
                $()
                console.log(data);
                if (index % 2 == 0){
                    rb = 'R';
                } else {
                    rb = 'B';
                }
                append = tplawesome(data, [{"title":item.snippet.title,"itemId":index, "videoid":item.id.videoId, "color":rb}]);
                $("#results").append(append);
            });
          });
          resetVideoHeight();
       });
    });
    
    $(window).on("resize", resetVideoHeight);
});
/*
function send(id,title) {
    console.log(`ID: ${id} | Title: ${title}`);
    socket.emit('youtube',id,title);
}*/
function resetVideoHeight() {
    $(".video").css("height", $("#results").width() * 9/16);
}

function init() {
    gapi.client.setApiKey("AIzaSyDBVyWiLx3Sxt9Kdc0F8KhEMbdlOJ9mZ_s");
    gapi.client.load("youtube", "v3", function() {
        // yt api is ready
    });
}
