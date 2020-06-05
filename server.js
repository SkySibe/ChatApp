let express = require("express");
//functon to check if msg is a img url 
const isUrlImage = require('is-image-url');
const isUrl = require('is-url');
let app = express();
let server = require("http").createServer(app);
let io = require("socket.io")(server);
let nameAndId = {};
let messagesAndId = {};
let likesAndId = {};
let port = process.env.PORT;
if (port == null || port == "") {
  port = 80;
}
let requestIp = require('request-ip');

let os = require('os');
let hostname = os.hostname();
let messageId = 0;
let rp = '';
let ips =[];
//app.set('view engine', 'ejs');
let count = 0;
let nindex = 2;
let countIp = 0;
io.on('connection', client => {
    if (client) {
      count++;
      console.log("User connected, user count: " + count );
      io.emit("updateCount", count);
      countIp = ips.length;
    }
    //io.emit("updateCount", countIp);
    client.on('disconnect', () => {
      let id = client.id;
      delete nameAndId[id];
      count--;
      io.emit("updateCount", count);
    	console.log("User disconnected, user count: " + count );
      countIp = ips.length;
      //io.emit("updateCount", countIp);
    });
});
//get server ip
let interfaces = os.networkInterfaces();
let addresses = [];
for (let k in interfaces) {
    for (let k2 in interfaces[k]) {
        let address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}
let getRandomColor = () => {
  let letters = '0123456789ABCDEF';
  let color = '';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
let colorNames = (name) => {
  let colors = {
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
    'תכלת': '3399ff',
    'זהב': 'ffd700',
    'כסף': 'c0c0c0',
    'חום': 'a52a2a',
    'ורוד': 'ffc0cb',
    'pink': 'ffc0cb',
    'blue': '0000ff',
    'red': 'ff0000',
    'green': '008000',
    'lime': '00ff00',
    'violet': '800080',
    'black': '000000',
    'white': 'ffffff',
    'magenta': 'ff00ff',
    'orange': 'ffa500',
    'gray': '808080',
    'azure': '3399ff',
    'gold': 'ffd700',
    'silver': 'c0c0c0',
    'brown': 'a52a2a',
    'yellow': 'ffff00'
  };
  return (colors[name] || getRandomColor());
}
let getIp = req => {
  let ip;
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
app.get("/language/en.json", (req, res, next) => {
  res.sendFile(__dirname + "/public/language/en.json");
});
app.get("/language/he.json", (req, res, next) => {
  res.sendFile(__dirname + "/public/language/he.json");
});
app.use(express.static("public"));
var roomes = ['$'];
var roomno = 1;
io.on("connection", client => {
  client.join(roomes[0]);
  console.log(`Client: ${client.id} ,in room: main.`);
  client.on('create', function(room) {
    room = room.toString();
    console.log(`Clients in room ${room}: ${io.sockets.in(room)}`);
    if(roomes.includes(room)){
      client.leaveAll();
      client.join(room);
      client.emit('connectToRoom', "You are in room: "+room);
      client.emit("sendsys","joindRoom", room);
      io.sockets.in(Object.keys(io.sockets.adapter.sids[client.id])[0]).emit('connectToRoom','Another one joined the room.')
    } else {
      client.leaveAll();
      roomes.push(room);
      console.log(`New room has been created: ${room}, All the rooms ${JSON.stringify(roomes)}.`);
      client.join(room);
      io.sockets.in(room).emit('connectToRoom', "You are in room: "+room);
      client.emit("sendsys","createdRoom", room);
      roomno++;
    }
    console.log(`Client joined room: ${room}.`);
    console.log(Object.keys(io.sockets.adapter.sids[client.id])[0]);
  });
  io.emit('upNindex',nindex);
  io.emit('nameList',Object.values(nameAndId));
  console.log("Client connected...");
  client.on("join", data => {
    console.log(data);
  });
  client.on('saveName', name => {
    if (name == null ) {
      return false;
    } else {
      let id = client.id;
      nameAndId[id] = name;
      io.emit('nameList',Object.values(nameAndId));
    }
  });
  client.on("messages", (color, name , msg, reply) => {
    msg = msg.toString();
    let copy = msg.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    if (typeof name === "string") {
      name = name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    } else if (typeof reply === "string") {
      reply = reply.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    let hl = msg.match(/[\u0590-\u05FF]/gi);
    let el = msg.match(/[a-zA-Z]/gi);
    if (hl == null) {
      hl = 0;
    }
    if (el == null) {
      el = 0;
    }
    let imgapi = false;
    let privateMsg = [];

    let reverse = s => {
        return s.split("").reverse().join("");
    }
    let reverseHe = txt => {
      let he = /[\u0590-\u05FF]+/g;
      let wl = txt.match(he);
      let i = 0;
        while (match = he.exec(txt) !== null) {
          let word = wl[i];
          i++;
          console.log(`original: ${word}, full text: ${txt}`);
          txt = txt.replace(word,reverse(word));
          console.log(`new: ${reverse(word)}, full text: ${txt}`);
        }
      if (hl.length >= el.length || el == 0 && hl !== 0) {
        let ary = txt.split(" ");
        ary.reverse();
        txt = ary.join(' ');
      }
        return txt;
    }
    let sendType = (type,heb,tit,id) => {
      if (id !== undefined && id.length < 9) {
        id = null,tit = null;
      }
      if(privateMsg.length > 0) {
          for (let i = 0; i < privateMsg.length; i++) {
            io.to(privateMsg[i]).emit("sound", 1);
            io.to(privateMsg[i]).emit("thread", color, name, msg, heb, type, false, messageId, reply, copy,tit,id);
          }
      } else {
        if(Object.keys(io.sockets.adapter.sids[client.id])[1] == 'main') {
          client.broadcast.to('main').emit("sound", 1);
          client.broadcast.to('main').emit("thread", color, name, msg, heb, type, false, messageId, reply, copy,tit,id);
        } else {
          client.broadcast.to(Object.keys(io.sockets.adapter.sids[client.id])[0]).emit("sound", 1);
          client.broadcast.to(Object.keys(io.sockets.adapter.sids[client.id])[0]).emit("thread", color, name, msg, heb, type, false, messageId, reply, copy,tit,id)
        }
      }
      client.emit("thread", color, name, msg, heb, type, true, messageId, reply, copy,tit,id);
    }
    
    if (msg.startsWith('(')) {
      let mayName = msg.split('(').pop().split(')')[0];
      let array = mayName.split(",");
      if (array.length > 0) {
        for (let i = 0; i < array.length; i++) {
          let index = Object.values(nameAndId).indexOf(array[i]);
          if (index > -1) {
            if (msg.startsWith(`(${array})`)) {
              let keyNames = Object.keys(nameAndId);
              if (keyNames.includes(Object.keys(nameAndId)[index])) {
                privateMsg.push(Object.keys(nameAndId)[index]);
              }
            }
          }
        }
      }
      msg = msg.replace(`(${array})`,'');
    } else if (msg.startsWith('[')) {
      let mayName = msg.split('[').pop().split(']')[0];
      let array = mayName.split(",");
        if (array.length > 0) {
          for (let i = 0 ; i < Object.keys(nameAndId).length ; i++) {
            privateMsg.push(Object.keys(nameAndId)[i]);
          }
          for (let i = 0; i < privateMsg.length; i++) {
            let index = Object.values(nameAndId).indexOf(array[i]);
            if (index > -1) {
              let thisId = Object.keys(nameAndId)[index];
              let keyNames = Object.keys(nameAndId);
              if (keyNames.includes(thisId)) {
                let ioi = privateMsg.indexOf(thisId);
                privateMsg.splice(ioi,1);
              }
            }
          }
        }
        msg = msg.replace(`[${array}]`,'');
      }
    //serach images
    if (msg.startsWith('@')) {
      let num = Math.floor(Math.random() * 100) + 1;
      msg = msg.replace(msg,`http://loremflickr.com/320/240/${msg.slice(1,msg.length)}?lock=${messageId}?random=${messageId}`);
      imgapi = true;
    }
    //text image
    if (msg.startsWith('#')) {
      let txt,bc,tc;
      if (msg.includes('=') && msg.includes('+')) {
        txt = msg.split('#').pop().split('=')[0];
        txt = reverseHe(txt);
        bc = msg.toLowerCase().split('=').pop().split('+')[0];
        tc = msg.toLowerCase().substring(msg.indexOf("+") + 1, msg.length);
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
    if (isUrlImage(msg) || imgapi) {
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
    let id = client.id;
    messagesAndId[messageId] = id;
    if (msg == 'אחלה אתר') {
      let num = Math.floor(Math.random() * 12345) + 234;
      for (let i = 0 ; i < num; i++) {
        io.emit("likePu",messageId);
      }
    }
    messageId++;
    rp = '';
  });
  client.on('replayData', replayId => {
    rp = replayData;
  });
  client.on('sysmsg', (msg) => {
    if(msg===true) {
      client.emit("sendsys", msg,null);
    } else if(msg===false) {
      client.emit("sendsys", msg,null);
    }
  });
  client.on('typing', name => {
    if(nameAndId[client.id] == name || name === 'ללא שם') {
      if(Object.keys(io.sockets.adapter.sids[client.id])[1] == 'main') {
        client.broadcast.to('main').emit('type' ,name);
      } else {
        client.broadcast.to(Object.keys(io.sockets.adapter.sids[client.id])[0]).emit('type' ,name);
      }
    }
  });
  client.on('stopType', name => {
    if(Object.keys(io.sockets.adapter.sids[client.id])[1] == 'main') {
      client.broadcast.to('main').emit('stype' ,name);
    } else {
      client.broadcast.to(Object.keys(io.sockets.adapter.sids[client.id])[0]).emit('stype' ,name);
    }
  });
  client.on('like', mseId => {
    let id = client.id;
    if (messagesAndId[mseId] == id) {
      console.log("Can't like self msgs");
    } else if (likesAndId[mseId] == id) {
      console.log("Can't multy like");
    } else {
      io.emit("likePu",mseId);
      client.emit("likePr",mseId);
      likesAndId[mseId] = id;
    }
  });
  client.on('trash', mseId => {
    let id = client.id;
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
});
console.log(`Server running on: ${addresses[0]}:${port}`);
server.listen(port);