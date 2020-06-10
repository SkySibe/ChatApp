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
//client.handshake.address
let os = require('os');
let hostname = os.hostname();
let rp = '';
let ips =[];
//app.set('view engine', 'ejs');
let count = 0;
let nindex = 2;
let countIp = 0;
require("dotenv").config();
var admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert({
    "type": process.env.FIREBASE_TYPE,
    "project_id": process.env.FIREBASE_PROJECT_ID,
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": process.env.FIREBASE_AUTH_URI,
    "token_uri": process.env.FIREBASE_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL,
  }),
  databaseURL: "https://chatapp-skysibe.firebaseio.com"
});
var db = admin.database();
var messageId;
ref = db.ref("messageIdIndex");
ref.on("value", function(snapshot) {
  let dt = snapshot.val();
  messageId = dt;
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});
let updateMsgIndex = (index) => {
  db.ref().update({"messageIdIndex": index.toString()});
}
let writeMessage = (time,date,hebrew,message,name,reply,room,copy,userid,private,color,type,likes) => {
  let dmsgId = "m"+messageId;
  db.ref(`messages/${dmsgId}`).set({
    time: time,
    date: date,
    dir: hebrew,
    message: message,
    name: name,
    reply: reply,
    room: room,
    userid: userid,
    copy: copy,
    private: private,
    color: color,
    type: type,
    likes: likes
  });
}
// var ref = db.ref("messages");
// ref.on("value", function(snapshot) {
//   let dt = snapshot.val();
//   console.log(dt.m0.date);
// }, function (errorObject) {
//   console.log("The read failed: " + errorObject.code);
// });
var clientIds = [];
io.on('connection', client => {
  if (!clientIds.includes(client.id)) {
    console.log(client.id);
    clientIds.push(client.id);
    count++;
    console.log("User connected, user count: " + count );
    io.emit("updateCount", count);
    countIp = ips.length;
  }
  //io.emit("updateCount", countIp);
  client.on('disconnect', () => {
    io.emit('updateD');
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
app.get("/img/favicon.ico", (req, res, next) => {
  res.sendFile(__dirname + "/public/img/favicon.ico");
});
app.get("/img/favicon24x24.ico", (req, res, next) => {
  res.sendFile(__dirname + "/public/img/favicon24x24.ico");
});
app.get("/img/favicon32x32.ico", (req, res, next) => {
  res.sendFile(__dirname + "/public/img/favicon32x32.ico");
});
app.get("/img/favicon48x48.ico", (req, res, next) => {
  res.sendFile(__dirname + "/public/img/favicon48x48.ico");
});
app.get("/img/favicon64x64.ico", (req, res, next) => {
  res.sendFile(__dirname + "/public/img/favicon64x64.ico");
});
app.get("/img/logo.png", (req, res, next) => {
  res.sendFile(__dirname + "/public/img/logo.png");
});
app.use(express.static("public"));
var roomes = ['$'];
var roomno = 1;
var clientsRu = {};
io.on("connection", client => {
  client.on('create', function(room) {
    room = room.toString();
    io.of('/').in(room).clients(function(error,clients){
      console.log(`Clients in room ${room} | ${clients.length}`);;
    });
    if(clientsRu[client.id] !== room) {
      clientsRu[client.id] = undefined;
      client.emit('clearAll');
      client.emit("sendsys",true,null);
      client.emit("sendsys",false,null);
      var messagesLength;
      ref = db.ref("messages");
      ref.on("value", function(snapshot) {
        messagesLength = snapshot.numChildren();
      });
      for(let i = 0; i < messagesLength; i++){
        ref = db.ref("messages");
        ref.on("value", function(snapshot) {
          let dt = snapshot.val();
          let indexM = Object.keys(dt)[i];
          if(dt[indexM].room == room && clientsRu[client.id] == undefined) {
            client.emit("thread", dt[indexM].color, dt[indexM].name, dt[indexM].message, dt[indexM].dir, dt[indexM].type, false, Object.keys(dt)[i].substring(1), dt[indexM].reply, dt[indexM].copy,null,null,dt[indexM].time+" | "+dt[indexM].date, dt[indexM].likes);
          }
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
      }
    }
    if(roomes.includes(room)){
      client.leaveAll();
      client.join(room);
      clientsRu[client.id] = room;
      io.of('/').in(Object.keys(io.sockets.adapter.sids[client.id])[0]).clients(function(error,clients){
        io.emit('updateRoom',clients.length);
      });
      client.emit("sendsys","joindRoom", room);
      io.sockets.in(Object.keys(io.sockets.adapter.sids[client.id])[0]).emit('connectToRoom','Another one joined the room.');
    } else {
      client.leaveAll();
      roomes.push(room);
      console.log(`New room has been created: ${room}, All the rooms ${JSON.stringify(roomes)}.`);
      client.join(room);
      clientsRu[client.id] = room;
      io.of('/').in(Object.keys(io.sockets.adapter.sids[client.id])[0]).clients(function(error,clients){
        io.emit('updateRoom',clients.length);
      });
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
      let time = new Date();
      let hour = time.getHours()+":"+time.getMinutes();
      let date = time.getDate()+"/"+(time.getMonth()+1)+"/"+time.getFullYear();
      if(privateMsg.length > 0) {
          for (let i = 0; i < privateMsg.length; i++) {
            if(privateMsg[i] !== client.id) {
              io.sockets.connected[ privateMsg[i] ].emit("sound", 1);
              io.sockets.connected[ privateMsg[i] ].emit("thread", color, name, msg, heb, type, false, messageId, reply, copy,tit,id,null);
              writeMessage(hour,date,heb,msg,name,reply,null,copy,client.id,privateMsg[i],color,type,0);
            }
          }
      } else {
        if(Object.keys(io.sockets.adapter.sids[client.id])[1] == '$') {
          client.broadcast.to('$').emit("sound", 1);
          client.broadcast.to('$').emit("thread", color, name, msg, heb, type, false, messageId, reply, copy,tit,id,null);
          writeMessage(hour,date,heb,msg,name,reply,'$',copy,client.id,null,color,type,0);
        } else {
          client.broadcast.to(Object.keys(io.sockets.adapter.sids[client.id])[0]).emit("sound", 1);
          client.broadcast.to(Object.keys(io.sockets.adapter.sids[client.id])[0]).emit("thread", color, name, msg, heb, type, false, messageId, reply, copy,tit,id,null);
          writeMessage(hour,date,heb,msg,name,reply,Object.keys(io.sockets.adapter.sids[client.id])[0],copy,client.id,null,color,type,0);
        }
      }
      client.emit("thread", color, name, msg, heb, type, true, messageId, reply, copy,id,null);
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
    updateMsgIndex(messageId);
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
      if(Object.keys(io.sockets.adapter.sids[client.id])[1] == '$') {
        client.broadcast.to('$').emit('type' ,name);
      } else {
        client.broadcast.to(Object.keys(io.sockets.adapter.sids[client.id])[0]).emit('type' ,name);
      }
    }
  });
  client.on('stopType', name => {
    if(Object.keys(io.sockets.adapter.sids[client.id])[1] == '$') {
      client.broadcast.to('$').emit('stype' ,name);
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
      likesAndId[mseId] = id;
      let likes;
      db.ref(`messages/m${mseId}`).on("value", function(snapshot) {
        likes = snapshot.val().likes;
      });
      console.log(likes);
      if(likes !== null || likes !== undefined){
        likes++;
        console.log("aFTER: "+likes);
        db.ref(`messages/m${mseId}`).update({
          "likes": likes
        });
      //   let room;
      //   if(Object.keys(io.sockets.adapter.sids[client.id])[1] == '$') {
      //     room == '$';
      //   } else {
      //     room = Object.keys(io.sockets.adapter.sids[client.id])[0];
      //   }
      //   var messagesLength;
      //   ref = db.ref("messages");
      //   ref.on("value", function(snapshot) {
      //     messagesLength = snapshot.numChildren();
      //   });
      //   for(let i = 0; i < messagesLength+1; i++){
      //     ref = db.ref("messages");
      //     ref.on("value", function(snapshot) {
      //       let dt = snapshot.val();
      //       let indexM = Object.keys(dt)[i];
      //       if(dt[indexM].room == room) {
      //         client.emit("delLastMessage");
      //         client.broadcast.to(Object.keys(io.sockets.adapter.sids[client.id])[0]).emit("delLastMessage");
      //       }
      //     }, function (errorObject) {
      //       console.log("The read failed: " + errorObject.code);
      //     });
      // }
    }
      io.emit("likePu", mseId);
      client.emit("likePr", mseId);
    }
  });
  client.on('trash', mseId => {
    let id = client.id;
    if (messagesAndId[mseId] == id) {
      io.emit("delThis",mseId);
      db.ref(`messages/m${mseId}`).remove();
    } else {
      console.log(`Can't delete others messages, client id: ${id}, message id: ${mseId}, messages and ids: `);
      console.log(messagesAndId);
    }
  });
  client.on('updateI', () => {
    nindex++;
    io.emit('upNindex',nindex);
  });
  client.on('updateRc', () => {
    io.of('/').in(Object.keys(io.sockets.adapter.sids[client.id])[0]).clients(function(error,clients){
      io.emit('updateRoom',clients.length);
    });
  });
});
console.log(`Server running on: ${addresses[0]}:${port} | ${hostname}`);
server.listen(port);