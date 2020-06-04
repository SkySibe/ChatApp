var express = require("express");
//functon to check if msg is a img url 
const isUrlImage = require('is-image-url');
const isUrl = require('is-url');
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var nameAndId = {};
var messagesAndId = {};
var likesAndId = {};
var port = 80;
var requestIp = require('request-ip');

var os = require('os');
var hostname = os.hostname();
var messageId = 0;
var rp = '';
var ips =[];
//app.set('view engine', 'ejs');
var count = 0;
var nindex = 2;
var countIp = 0;
io.on('connection', client => {
    if (client) {
      count++;
      console.log("User connected, user count: " + count + " | " + client);
      io.emit("updateCount", count);
      countIp = ips.length;
    }
    //io.emit("updateCount", countIp);
    client.on('disconnect', () => {
      var id = client.id;
      delete nameAndId[id];
      count--;
      io.emit("updateCount", count);
    	console.log("User disconnected, user count: " + count + " | " + client);
      countIp = ips.length;
      //io.emit("updateCount", countIp);
    });
});
//get server ip
var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}
var getRandomColor = () => {
  var letters = '0123456789ABCDEF';
  var color = '';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
var colorNames = (name) => {
  var colors = {
    'כחול': '0000ff',
    'אדום': 'ff0000',
    'צהוב': 'ffff00',
    'ירוק': '008000',
    'ליים': '00ff00',
    'סגול': '800080',
    'שחור': '000000',
    'לבן': 'ffffff',
    "מגנטה": 'ff00ff',
    'כתום': 'ffa500',
    'אפור': '808080',
    'תכלת': 'add8e6',
    'זהב': 'ffd700',
    'כסף': 'c0c0c0',
    'חום': 'a52a2a'
  };
  return (colors[name] || getRandomColor());
}
var getIp = req => {
  var ip;
  if (req.headers.host == "127.0.0.1" || req.headers.host == "localhost" || req.headers.host == addresses[0] || req.headers.host == os.hostname().toLowerCase()) {
    ip = req.connection.remoteAddress;
    console.log("Client local IP: " + ip);
  } else {
    ip = req.headers['x-forwarded-for'];
    console.log("Client public IP: " + ip);
  }
  if (ips.includes(ip)) {
    console.log("already connected");
  } else {
    ips.push(ip);
    countIp++;
  }
  return ip;
}
app.get("/", (req, res, next) => {
  newip = getIp(req);
  res.sendFile(__dirname + "/public/index.html");
});
app.get("/public/audio/definite.mp3", (req, res, next) => {
  res.sendFile(__dirname + "/public/audio/definite.mp3");
});
app.get("/audio/click.mp3", (req, res, next) => {
  res.sendFile(__dirname + "/public/audio/click.mp3");
});
app.use(express.static("public"));
io.on("connection", client => {
  io.emit('upNindex',nindex);
  io.emit('nameList',Object.values(nameAndId));
  console.log("Client connected...");
  client.on("join", data => {
    console.log(data);
    if (data.includes("youtube")) {
      count--;
      io.emit("updateCount", count);
      console.log("User disconnected, becouse youtube: " + count);
    }
  });
  client.on('saveName', name => {
    if (name == null ) {
      return false;
    } else {
      var id = client.id;
      nameAndId[id] = name;
      io.emit('nameList',Object.values(nameAndId));
    }
  });
  client.on("messages", (color, name , msg, reply) => {
    var copy = msg.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var hl = msg.match(/[\u0590-\u05FF]/gi);
    var el = msg.match(/[a-zA-Z]/gi);
    if (hl == null) {
      hl = 0;
    }
    if (el == null) {
      el = 0;
    }
    var imgapi = false;
    var privateMsg = [];

    var reverse = s => {
        return s.split("").reverse().join("");
    }
    var reverseHe = txt => {
      var he = /[\u0590-\u05FF]+/g;
      var wl = txt.match(he);
      var i = 0;
        while (match = he.exec(txt) !== null) {
          var word = wl[i];
          i++;
          console.log(`original: ${word}, full text: ${txt}`);
          txt = txt.replace(word,reverse(word));
          console.log(`new: ${reverse(word)}, full text: ${txt}`);
        }
      if (hl.length >= el.length || el == 0 && hl !== 0) {
        var ary = txt.split(" ");
        ary.reverse();
        txt = ary.join(' ');
      }
        return txt;
    }
    var sendType = (type,heb,tit,id) => {
      if (id !== undefined && id.length < 9) {
        id = null,tit = null;
      }
      if(privateMsg.length > 0) {
          for (var i = 0; i < privateMsg.length; i++) {
            io.to(privateMsg[i]).emit("sound", 1);
            io.to(privateMsg[i]).emit("thread", color, name, msg, heb, type, false, messageId, reply, copy,tit,id);
          }
      } else {
          client.broadcast.emit("sound", 1);
          client.broadcast.emit("thread", color, name, msg, heb, type, false, messageId, reply, copy,tit,id);
      }
        client.emit("thread", color, name, msg, heb, type, true, messageId, reply, copy,tit,id);
    
    }
    
    if (msg.startsWith('(')) {
      var mayName = msg.split('(').pop().split(')')[0];
      var array = mayName.split(",");
      if (array.length > 0) {
        for (var i = 0; i < array.length; i++) {
          var index = Object.values(nameAndId).indexOf(array[i]);
          if (index > -1) {
            if (msg.startsWith(`(${array})`)) {
              var keyNames = Object.keys(nameAndId);
              if (keyNames.includes(Object.keys(nameAndId)[index])) {
                privateMsg.push(Object.keys(nameAndId)[index]);
              }
            }
          }
        }
      }
      msg = msg.replace(`(${array})`,'');
    } else if (msg.startsWith('[')) {
      var mayName = msg.split('[').pop().split(']')[0];
      var array = mayName.split(",");
        if (array.length > 0) {
          for (var i = 0 ; i < Object.keys(nameAndId).length ; i++) {
            privateMsg.push(Object.keys(nameAndId)[i]);
          }
          for (var i = 0; i < privateMsg.length; i++) {
            var index = Object.values(nameAndId).indexOf(array[i]);
            if (index > -1) {
              var thisId = Object.keys(nameAndId)[index];
              var keyNames = Object.keys(nameAndId);
              if (keyNames.includes(thisId)) {
                var ioi = privateMsg.indexOf(thisId);
                privateMsg.splice(ioi,1);
              }
            }
          }
        }
        msg = msg.replace(`[${array}]`,'');
      }
    //serach images
    if (msg.startsWith('@')) {
      var num = Math.floor(Math.random() * 100) + 1;
      msg = msg.replace(msg,`http://loremflickr.com/320/240/${msg.slice(1,msg.length)}?lock=${messageId}?random=${messageId}`);
      imgapi = true;
    }
    //text image
    if (msg.startsWith('#')) {
      var txt,bc,tc;
      if (msg.includes('=') && msg.includes('+')) {
        txt = msg.split('#').pop().split('=')[0];
        txt = reverseHe(txt);
        bc = msg.split('=').pop().split('+')[0];
        tc = msg.substring(msg.indexOf("+") + 1, msg.length);
        bc = colorNames(bc);
        tc = colorNames(tc);
        msg = msg.replace(msg,`http://dummyimage.com/666x666/${bc}/${tc}&text=${txt}`);
      } else {
        txt = msg.slice(1,msg.length);
        txt = reverseHe(txt);
        msg = msg.replace(msg,`http://dummyimage.com/666x666/${getRandomColor()}/${getRandomColor()}&text=${txt}`);
      }
      imgapi = true;
    }
    if (msg.startsWith("/מערכת/")) {
      msg = msg.slice(7,msg.length);
      if (hl.length >= el.length || el == 0 && hl !== 0) {
        heb = true;
      } else {
        heb = false;
      }
      io.emit("sendsys", msg  ,heb);
    } else if (isUrlImage(msg) || imgapi) {
      sendType('img',false);
    } else if (isUrl(msg)) {
      sendType('url',false);
} else if (msg.startsWith("/קוד/")) {
      msg = msg.slice(5,msg.length);
      sendType('code',false);
    } else {
      if (hl.length >= el.length || el == 0 && hl !== 0) {
        heb = true;
      } else {
        heb = false;
      }
      sendType('msg',heb);
    }
    //give every message id a user id
    var id = client.id;
    messagesAndId[messageId] = id;
    if (msg == 'אחלה אתר') {
      var num = Math.floor(Math.random() * 12345) + 234;
      for (var i = 0 ; i < num; i++) {
        io.emit("likePu",messageId);
      }
    }
    messageId++;
    rp = '';
  });
  client.on('replayData', replayId => {
    rp = replayData;
  });
  client.on('sysmsg', (msg,rtl) => {
    client.emit("sendsys", msg , rtl);
  });
  client.on('typing', name => {
    client.broadcast.emit('type' ,name);
  });
  client.on('stopType', name => {
    client.broadcast.emit('stype' ,name);
  });
  client.on('like', mseId => {
    var id = client.id;
    if (messagesAndId[mseId] == id) {
      console.log("Can't like self msgs");
    } else if (likesAndId[mseId] == id) {
      console.log("Can't multy like");
    } else {
      io.emit("likePu",mseId);
      client.emit("likePr",mseId);
      likesAndId[id] = mseId;
    }
  });
  client.on('trash', mseId => {
    var id = client.id;
    if (messagesAndId[mseId] == id) {
      io.emit("delThis",mseId);
    } else {
      console.log(`Can't delete others messages, client id: ${id}, message id: ${mseId}, messages and ids: `);
      console.log(messagesAndId);
    }
  });
  client.on('updateI', () => {
    nindex++;
    io.emit('upNindex',nindex);
  });
  client.on('youtube', (id,title) => {
    youtubeVideoId = id;
    youtubeVideoTitle = title;
    io.emit('upIdT', id,title);
  });
});
console.log(`Server running on: ${addresses[0]}:${port}`);
server.listen(port);