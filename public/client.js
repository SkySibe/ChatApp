//setting the page language to Hebrew by default
var pagelang = 'he';
//a function that switches the page language
var setLanguage = (language) => {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
    //if xml got the json response
    if (this.readyState == 4 && this.status == 200) {
        //sets a variable to the json
        var myObj = JSON.parse(this.responseText);
        //if language is not hebrew its switches to Left to Right yes this is kinda weird
        if(language == 'he') {
            document.body.dir = 'rtl';
            document.getElementsByClassName('systema')[1].dir ="rtl";
            document.getElementById('infobar').dir = "rtl";
        } else {
            document.body.dir = 'ltr';
            document.getElementsByClassName('systema')[1].dir ="ltl";
            document.getElementById('infobar').dir = "rtl";
        }
        //sets the page language to the current
        pagelang = language;
        //gets all elements with the tag 'data-lang' into an array
        var dtarr = document.querySelectorAll('[data-lang]');
        //for loop for changing every element language
        for (const elem of dtarr){
            //gets element label id from the tag specified
            var label = elem.getAttribute('data-lang');
            //another array for changing all elements with the same label id
            var dtmultarr = document.querySelectorAll(`[data-lang="${label}"]`);
            for(const elems of dtmultarr){
                //finally changes the element language
                if(elems.type == 'text'){
                    elems.placeholder = myObj[label];
                } else {
                    elems.innerHTML = myObj[label];
                }
            }
        }
    }
    };
    //call get to the json by language
    xmlhttp.open("GET", `/language/${language}.json`, true);
    xmlhttp.send();
}
//gonna use date next
var date = new Date();
//setting var to check if the user already chosed name and color
var set = false;
//array of random names if user don't pick a name
const randomNames = ["מים קופצים","פרעה","עץ מנגו מחייך","תפוז מעצבן","אנטיוכוס","בופי","משה","שמשון","דוק","זרובבל","תפוח","אגס","בננה","חומוס","דוד","שלמה","מוחמד","ישו","יזרעאל","מלכיאל","בוריטו","מר.תפודי","גברת תפודי","נזלת","חומוס","ספגטי","עגבנייה","חציל","מללפון","מיסטר נייס גאי","אבוקדו","תפוח אדמה","צ'יפס","שטריימל","בוטנים אמריקאים","666","שטן","מלאך","אריה","נמר","גויאבה","דג","ג'קי לוי","בובספוג","פטריק","סקווידוויד","קופיקו","שושנה","גר צדק","גלדיאטור","אביר","חתול","חתולה","דר.סוס","נמלה","אנטילופה","עמוד חשמל","שיניים תותבות","ידית","פסטה","אדון שוקו","גלגל ירוק","מוכר אוגרים","דילר","קופסת הפתעות","אזדרכת","עז"];
//get the url that the client used to connect the server
var url = window.location.href;
//loading message sound file
const newMsgAudio = new Audio('/audio/definite.mp3');
const clickAudio = new Audio('/audio/click.mp3');
//setting the name because if user typs it's will not show undefined
var name = "ללא שם";
//setting color at top for scope(to use in all this file)
var color;
//if user replay on message the data of the message will saved here
var replayData = "";
//array of names of typers
var typers = [];
//YouTubeAPI link
var ytLink = '';
//function fot chnging page colors
var changeProperty = (vr,colr) => {
    let root = document.documentElement;
    root.style.setProperty(vr,colr);
}
var corentColor = 0;
var changeColor = () => {
    switch(corentColor) {
        case 4:
            corentColor++;
            changeProperty('--rb','#ce1141');
            changeProperty('--db','#00386b');
            changeProperty('--lb','#eeb111');
            changeProperty('--lsk','#94ce08');
            changeProperty('--lbmsgtxt','#262626');
            changeProperty('--lskmsgtxt','#262626');
            changeProperty('--backco','#e87d1e');
            changeProperty('--intxtco','#101010');
            changeProperty('--intxtnrml','#ffff4d');
            changeProperty('--intxthov','#ffff66');
            changeProperty('--intxtfo','#ffff80');
            changeProperty('--bordrmsg','#00386b');
            changeProperty('--replaybackground','#ffff4d');
            changeProperty('--infobartxt', 'WhiteSmoke');
            changeProperty('--bordertbf', 'Black');
            break;
        case 1 :
            corentColor++;
            changeProperty('--rb','DarkSlateGray');
            changeProperty('--db','Black');
            changeProperty('--lb','#333333');
            changeProperty('--lsk','#292929');
            changeProperty('--lbmsgtxt','#f2f2f2');
            changeProperty('--lskmsgtxt','#f2f2f2');
            changeProperty('--backco','#1a1a1a');
            changeProperty('--intxtco','#dddddd');
            changeProperty('--intxtnrml','#404040');
            changeProperty('--intxthov','#4d4d4d');
            changeProperty('--intxtfo','#1a1a1a');
            changeProperty('--bordrmsg','Black');
            changeProperty('--replaybackground','#404040');
            changeProperty('--infobartxt', 'WhiteSmoke');
            changeProperty('--bordertbf', 'Silver');
            break;
        case 0:
            corentColor++;
            changeProperty('--rb', '#f3f3f3');
            changeProperty('--db', 'DarkCyan');
            changeProperty('--lb', 'Linen');
            changeProperty('--lsk', 'whitesmoke');
            changeProperty('--lbmsgtxt','#262626');
            changeProperty('--lskmsgtxt','#262626');
            changeProperty('--backco', '#d9d9d9');
            changeProperty('--intxtco', '');
            changeProperty('--intxtnrml', '');
            changeProperty('--intxthov', '');
            changeProperty('--intxtfo', '');
            changeProperty('--bordrmsg', 'Silver');
            changeProperty('--replaybackground', '');
            changeProperty('--infobartxt', 'DarkCyan');
            changeProperty('--bordertbf', '#bfbfbf');
            break;
        case 3:
            corentColor++;
            changeProperty('--rb', 'Aquamarine');
            changeProperty('--db', 'CornflowerBlue');
            changeProperty('--lb', '#3399ff');
            changeProperty('--lsk', '#0066ff');
            changeProperty('--lbmsgtxt','#262626');
            changeProperty('--lskmsgtxt','#262626');
            changeProperty('--backco', 'BurlyWood');
            changeProperty('--intxtco', '');
            changeProperty('--intxtnrml', 'SkyBlue');
            changeProperty('--intxthov', '#9bd6ee');
            changeProperty('--intxtfo', '');
            changeProperty('--bordrmsg', 'Blue');
            changeProperty('--replaybackground', 'LightBlue');
            changeProperty('--infobartxt', 'CornflowerBlue');
            changeProperty('--bordertbf', 'DarkBlue');
            break;
        case 2:
            corentColor++;
            changeProperty('--rb', '#0d0d0d');
            changeProperty('--db', 'RoyalBlue');
            changeProperty('--lb', 'PowderBlue');
            changeProperty('--lsk', 'DarkSlateGray');
            changeProperty('--lbmsgtxt','#262626');
            changeProperty('--lskmsgtxt','#fafafa');
            changeProperty('--backco','#1a1a1a');
            changeProperty('--intxtco','#dddddd');
            changeProperty('--intxtnrml','#404040');
            changeProperty('--intxthov','#4d4d4d');
            changeProperty('--intxtfo','#1a1a1a');
            changeProperty('--bordrmsg', 'Black');
            changeProperty('--replaybackground', 'gray');
            changeProperty('--infobartxt', '#e6e6e6');
            changeProperty('--bordertbf', '#1a1a1a');
            break;
        default:
            corentColor = 0;
            changeProperty('--rb','RoyalBlue');
            changeProperty('--db','DarkBlue');
            changeProperty('--lb','LightBlue');
            changeProperty('--lsk','LightSkyBlue');
            changeProperty('--lbmsgtxt','#262626');
            changeProperty('--lskmsgtxt','#262626');
            changeProperty('--backco','Gainsboro');
            changeProperty('--intxtco','#101010');
            changeProperty('--intxtnrml','gainsboro');
            changeProperty('--intxthov','lightgray');
            changeProperty('--intxtfo','mistyrose');
            changeProperty('--bordrmsg','RoyalBlue');
            changeProperty('--replaybackground','Gainsboro');
            changeProperty('--infobartxt', 'WhiteSmoke');
            changeProperty('--bordertbf', 'Black');
    }
}
//setting function to send system messages
var systemMsg = (msg) => {
    socket.emit('sysmsg', msg);
}
var names = [];
var nindex = 2;
var getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
const colors = {
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
var getPosition = (string, subString, index) => {
    return string.split(subString, index).join(subString).length;
}
// initializing socket, connection to server
var socket = io.connect(url);
systemMsg(true);
systemMsg(false);
socket.on("connect", data => {
  socket.emit("join",url);
});
if ($(window).width() < 340) {
    //remove text and show only icon on button on small screens
    $('#send').html('<i class="fa fa-send"></i>');
}
//load name that existed since the server started
socket.on('nameList', nameList => {
    names = nameList;
});
var fsys = true;
//system message function
socket.on("sendsys", (msg) => {
    if(fsys){
        if (msg) {
            $("#thread").append(`<li class="systema" dir="rtl"><span class="system" data-lang="system">מערכת</span><br><span data-lang="firstsysmsg"></span><br> <span style="font-size: 10px;">${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}</span> </li>`);
            setLanguage(pagelang);
        } else {
            $("#thread").append(`<li class="systema" dir="rtl"><span class="system" data-lang="system">מערכת</span><br><span data-lang="secondsysmsg"></span><br> <span style="font-size: 10px;">${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}</span> </li>`);
            setLanguage(pagelang);
            fsys = false;
        }
    }
});
function isEven(n) {
    return n % 2 == 0;
 }
 
 function isOdd(n) {
    return Math.abs(n % 2) == 1;
 }
//update user connected count from the server
socket.on("updateCount",  usco => {
    $("#uc").text(usco);
});

//get volume and play message sound
socket.on('sound',  vol => {
 newMsgAudio.volume = vol;
 newMsgAudio.play();
});

//function that verify url and make from it a link
var urlify = text => {
    var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlRegex, url => {
        return `<a target="_blank" rel="noopener noreferrer" href="${url}">${url.replace("http://","").replace("https://","").replace(/\/$/,"")}</a>`;
    })
}
socket.on("thread", (color, name, msg, rtl, type, you, msgid, replayData,tocopy,tit,id) => {
    if (type == 'ifr' && id !== null) {
        msg = `<h1>${tit}</h1><br><iframe value="${id}}" class="video w100" width="640" height="360" src="//www.youtube.com/embed/${id}" frameborder="0" allowfullscreen></iframe>`;
        type = 'code';
    }
    //update date
    date = new Date();
    //prevent xss
    if (type !== 'code') {
      msg = msg.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    //if message is url
    if(type == "url") {
        rtl = false;
        msg = `<a target="_blank" rel="noopener noreferrer" href="${msg}">${msg.replace("http://","").replace("https://","").replace(/\/$/,"")}</a>`;//<br><iframe src="${msg}"></iframe>
    }
    //if message is img
    if(type == "img") {
        rtl = false;
        msg = `<div class="imgbox"><img id="img-${msgid}" class="center-fit" src="${msg}"></div>`;
    }
    if(!rtl) {
        var str = 'dir="ltr"';
    } else {
        var str = 'dir="rtl"';
    }
    //diffrent between your message to other's
    if(!you) {
        var trash = "";
        var replayBtn = `<button id="replay-btn-(${msgid}" onClick="replay(${msgid})" class="replay-btn"><i class="fa fa-reply"></i></button>`
        var likeBtn = `<div id="cont-like-${msgid}"><button id="like-btn-${msgid}" onClick="like(${msgid})" class="like-btn"><i class="fa fa-heart"></i> <span id="count-${msgid}">0</span></button></div>`;
    } else {
        var trash = `<button class="trash-btn" onClick="deleteMsg(${msgid})"><i class="fa fa-trash"></i></button>`;
        var likeBtn = `<p class="p-like"><i class="fa fa-heart"></i> <span id="count-${msgid}">0</span></p>`;
        var replayBtn = "";
    }
    //if message type is text
    if(type == "msg") {
        //checks for urls in message and convert them to links
        msg = urlify(msg);
        //bold text
        var asterisks = msg.match(/\*([^\s*](?:(?: \* |[^*])+[^\s*])?)\*/gm);
        if (asterisks !== null) {
            if (asterisks.length > 0) {
                for (let i = 0; i < asterisks.length; i++) {
                    msg = msg.replace(`${asterisks[i]}`,`<b>${asterisks[i].substring(1,asterisks[i].length - 1)}</b>`);
                }
            }
        }
        //if name of a color in message
        for (let i = 0; i < Object.keys(colors).length; i++) {
            if (msg.toLowerCase().includes(Object.keys(colors)[i])) {
                let inco = msg.toLowerCase().indexOf(Object.keys(colors)[i]);
                let ts = msg.substring(inco,inco + Object.keys(colors)[i].length);
                let re = new RegExp(Object.keys(colors)[i], "ig");
                msg = msg.replace(re,`<span style="color: #${Object.values(colors)[i]}">${ts}</span>`);
            }
        }
        //צבע מזמן צבע רנדומלי לגמרי ואקראי מהרשימה של השמות של הצבעים
        //give random to color
        var ckw = 'אקראי';
        var re = new RegExp(ckw, "g");
            var i = 0, rndm = Math.floor((Math.random() * Object.keys(colors).length) + 0),
                str = "This is a simple string to test regex.",
            // result holds the resulting string after modification
            // by String.prototype.replace(); here we use the
            // anonymous callback function, with Arrow function
            // syntax, and return the match (the 's' character)
            // along with the index of that found character:
            result = msg.replace(re, (match) => {
                rndm = rndm = Math.floor((Math.random() * Object.keys(colors).length) + 0);
                return `<span style="color: #${Object.values(colors)[Number(rndm)]}">${ckw}</span>`;
            });
            msg = result;
        //give random to colors
        ckw = 'צבעים';
        re = new RegExp(ckw, "g");
        i = 0, rndm = Math.floor((Math.random() * Object.keys(colors).length) + 0),
        str = "This is a simple string to test regex.",
        result = msg.replace(re, (match) => {
            var str = ckw;
            var split = str.split(""); //Split out every char
            var recombinedStr = "";
            var count = 0;
            for(let i = 0; i < split.length; i++) {
                rndm = rndm = Math.floor((Math.random() * Object.keys(colors).length) + 0);
                recombinedStr += `<span style="color: #${Object.values(colors)[Number(rndm)]}">${split[i]}</span>`;
                count++;
            }
            console.log(recombinedStr);
            return recombinedStr;
        });
        msg = result;
        //give random to color
        ckw = 'צבע';
        re = new RegExp(ckw, "g");
            i = 0, rndm = getRandomColor(),
                str = "This is a simple string to test regex.",
            result = msg.replace(re, (match) => {
                rndm = getRandomColor();
                return `<span style="color: ${rndm}">${ckw}</span>`;
            });
            msg = result;
    }
    //set copy button
    //TODO: fix the bug when enterted ' and `
    if (tocopy.includes("'")) {
        tocopy = tocopy.replace(/"/,'&#34;').replace(/`/,'&#96;').replace(/'/,'&#39;');
        var copy = `<button class="copy" onClick="copy(${msgid},${'`'+tocopy+'`'})"><i class="fa fa-copy"></i></button>`;
    } else {
        tocopy = tocopy.replace(/"/,'&#34;').replace(/`/,'&#96;');
        var copy = `<button class="copy" onClick="copy(${msgid},'${tocopy}')"><i class="fa fa-copy"></i></button>`;
    }
    //adding the message to the user view
    $("#thread").append(`<li id="${msgid}">${replayData}<span id="name-span-${msgid}" class="names" style="color: ${color};">${name}</span><br><span id="msg-span-${msgid}" ${str}>${msg}</span><br><span style="font-size: 10px;">${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}</span>${likeBtn+trash+replayBtn+copy}</li>`);
    //scroll the view down the page
    document.getElementById('end').scrollIntoView();
    //resets the replay data
    replayData = "";
});
var replay = mId => {
	var nam = $('#name-span-'+mId).text();
	var namClr = $('#name-span-'+mId).css('color');
	var msgTxt = $('#msg-span-'+mId).html();
    msgTxt = msgTxt.replace('center-fit','rpcn');
    
	replayData = `<div style="height:5px;font-size:1px;">&nbsp;</div><div class="replay-div" ><span class="names" style="color: ${namClr};">${nam}</span><br>${msgTxt}<div style="height:2px;font-size:1px;">&nbsp;</div></div>`;
}
var copy = (mId,str) => {
    // Create new element
    String(str);
    var el = document.createElement('textarea');
    // Set value (string to be copied)
    el.value = str;
    // Set non-editable to avoid focus and move outside of view
    el.setAttribute('readonly', '');
    el.style = {position: 'absolute', left: '-9999px'};
    document.body.appendChild(el);
    // Select text inside element
    el.select();
    // Copy text to clipboard
    document.execCommand('copy');
    // Remove temporary element
    document.body.removeChild(el);
    return mId;
}
var deleteMsg = mId => {
	socket.emit("trash",mId);
}
var like = mId => {
	socket.emit("like",mId);
}
socket.on('delThis', messId => {
	$('#'+messId).remove();
});
socket.on('likePu', messId => {
	var count = Number(document.getElementById("count-"+messId).innerHTML);
	count = count + 1;
	$('#count-'+messId).text(String(count));
});
socket.on('likePr', messId => {
	var count = Number(document.getElementById("count-"+messId).innerHTML);
	$('#cont-like-'+messId).replaceWith(`<p class="p-like"><i class="fa fa-heart"></i> <span id="count-${messId}">${count}</span></p>`);
});
socket.on('replay',replay = mId => {
	var nam = $('#name-span-'+mId).text();
    var namClr = $('#name-span-'+mId).css('color');
	var msgTxt = $('#msg-span-'+mId).html();
    msgTxt = msgTxt.replace('center-fit','rpcn');
    
	replayData = `<div style="height:5px;font-size:1px;">&nbsp;</div><div class="replay-div"><span class="names" style="color: ${namClr};">${nam}</span><br>${msgTxt}<div style="height:2px;font-size:1px;">&nbsp;</div></div>`;
    socket.emit('upReplay', replayData);
});
socket.on('type', name => {
	typers.push(name);
    var theTypes = typers.join(', ');
    if(pagelang == 'he') {
        $('#typing').text(`${theTypes} מקליד/ה...`);
    } else {
        $('#typing').text(`${theTypes} typing...`);
    }
});

socket.on('stype', name => {
	typers.splice(typers.indexOf(name),1);
	if (typers.length <= 0) {
		$('#typing').text('');
	} else {
		var theTypes = typers.join(', ');
		if(pagelang == 'he') {
            $('#typing').text(`${theTypes} מקליד/ה...`);
        } else {
            $('#typing').text(`${theTypes} typing...`);
        }
	}
});

// sends message to server, resets & prevents default form action
socket.on('upNindex', i => {

    nindex = i;
});
var msgVal = $("#message").val();
var msgArr = ['#ברוך הבא !=3399ff+000099'];
var msgI = 0;

var typing = false;
var timeout = undefined;

var timeoutFunction = () => {
  typing = false;
  socket.emit('stopType',name);
}
//פונקציה כדאי לעשות רעש של קליקים שמקלידים
var playP = (p,e) => {
    var audio = document.getElementById('clickP');
    audio.volume = 0.5;
    if (audio.paused) {
        audio.play();
    } else if (audio.currentTime <= 0.1) {
        audio.currentTime = 0.2;
        audio.play();
    } else if (audio.currentTime >= 0.2) {
        audio.currentTime = 0.1;
        audio.play();
    }
}
var msgColr = document.getElementById("message");
    //כאשר נלחץ אות
    $("#message").keyup(e => {
        //ניגון צליל הקלדה
        playP(clickAudio,e);

        var msgVal = $("#message").val();
        msgColr = document.getElementById("message");
        if (msgVal.startsWith('[') || msgVal.startsWith('(')) {
            if (msgVal.endsWith(')') || msgVal.endsWith(']')){
                $(msgColr).css({"background-color":"Black"});
                $(msgColr).css({"color":"Lime"});
                if (msgVal.startsWith('(')) {
                    var mayName = msgVal.split('(').pop().split(')')[0];
                    mayName = mayName.split(/\s+/);
                    var array = mayName.filter(function (el) {
                        return el != null;
                    });
                    socket.emit('saveName',null);
                    if (!mayName.includes(null)) {
                        $(msgColr).css({"background-color":"RoyalBlue"});
                        $(msgColr).css({"color":"white"});
                    } else {
                        $(msgColr).css({"background-color":"black"});
                        $(msgColr).css({"color":"white"});
                    }
                    console.log(names);
                    console.log(mayName);    
                    if (mayName.length >= 0) {
                        for (var i = 0; i < names.length; i++) {
                            let re = new RegExp(names[i], "g");
                            let match = msgVal.match(re);
                        }
                    }
                  } else if (msgVal.startsWith('[')) {
                    var mayName = msgVal.split('[').pop().split(']')[0];
                    mayName = mayName.split(/\s+/);
                    array = mayName.filter(function (el) {
                        return el != null;
                    });
                    socket.emit('saveName',null);
                    if (!mayName.includes(null)) {
                        $(msgColr).css({"background-color":"RoyalBlue"});
                        $(msgColr).css({"color":"white"});
                    } else {
                        $(msgColr).css({"background-color":"black"});
                        $(msgColr).css({"color":"white"});
                    }
                    console.log(names);
                    console.log(mayName);    
                    if (mayName.length >= 0) {
                        for (var i = 0; i < names.length; i++) {
                            let re = new RegExp(names[i], "g");
                            let match = msgVal.match(re);
                        }
                    }
                }
            }
            $(msgColr).css({"background-color":"black"});
            $(msgColr).css({"color":"white"});
        } else if (msgVal.startsWith('#') || msgVal.startsWith('@')) {
            $(msgColr).css({"background-color":"black"});
            $(msgColr).css({"color":"white"});
        } else if (msgVal.startsWith('http://') || msgVal.startsWith('https://')) {
            $(msgColr).css({"background-color":"RoyalBlue"});
            $(msgColr).css({"color":"white"});
        } else {
            $(msgColr).css("background-color", "");
            $(msgColr).css("color", "");
            // $(msgColr).css({"background-color":"var(--intxtnrml)"});
            // $(msgColr).css({"color":"var(--intxtfo)"});
        }
        //ביטול המקליד/ה... כאשר פרטי
        if(typing == false && !msgVal.startsWith('[') && !msgVal.startsWith('(')) {
            typing = true;
            socket.emit('typing',name);
            timeout = setTimeout(timeoutFunction, 1000);
        } else {
            clearTimeout(timeout);
            timeout = setTimeout(timeoutFunction, 200);
        }
        if (e.keyCode == 13) {//enter
            sendMsg();
        }
        //מאפשר לעלות ולרדת עם החצים כדי לטעון הודעות קודמות
        if (e.keyCode == 40) {//down
            if (msgI >= 0 && msgArr.length >= msgI) {
                $("#message").val(msgArr[msgI]);
                console.log("Index "+msgI);
                msgI--;
            } else {
                msgI = msgArr.length - 1;
                $("#message").val(msgArr[msgI]);
                console.log("Index "+msgI);
                msgI--;
            }
        } else if (e.keyCode == 38) {//up
            if (msgI >= 0 && msgArr.length > msgI) {
                $("#message").val(msgArr[msgI]);
                console.log("Index "+msgI);
                msgI++;
            } else {
                msgI = 0;
                $("#message").val(msgArr[msgI]);
                console.log("Index "+msgI);
                msgI++;
            }
        }
    });
var sendMsg = () => {
    if (!set) {
            name = $("#name").val();
        if (name.length > 25) {
            name = name.substring(0, 25);
            alert('שם ארוך מידי !');
        }
        if ( name == "" || !name.replace(/\s/g, '').length) {
        name = randomNames[Math.floor(Math.random()*randomNames.length)];
        $("#name").text(name);
        }
        if (names.indexOf(name) > -1) {
        console.log('this name is already exist');
        socket.emit('updateI');
        name = name + String(nindex);
        console.log('yournew name');
        }
        name = name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        if($("#color").val() == "#e6ffff") {
        color = getRandomColor();
        } else {
        color = $("#color").val();
        }
        socket.emit('saveName',name);
    }
    var message = $("#message").val();
    var msgVal = document.getElementById("message").value;
    if (!msgArr.length == 0 && !msgVal.includes('#ברוך הבא !=3399ff+000099')) {    
        msgArr.push(String(msgVal));
        console.table(msgArr);
        msgI = msgArr.length;
        console.log('i: '+msgI);
    }
    if (message == "" || !message.replace(/\s/g, '').length || message.replace(`(${message.split('(').pop().split(')')[0]})`,'') == '' || message.replace(`[${message.split('[').pop().split(']')[0]}]`,'') == '') {
        if(pagelang == 'he') {
            alert("אין לשלוח הודעה ריקה");
        } else {
            alert("You can't send an empty message");
        }
        return false;
    } else {
        socket.emit('messages',color ,name ,message,replayData);
        $("#message").val('');
        replayData = "";
    }
    console.log(date.getHours()+''+date.getMinutes());
    var expendedMinutes = expendedTime(date.getMinutes());
    var expendedHours = expendedTime(date.getHours());
    var time = expendedHours +''+ expendedMinutes
    console.log(time);
    if (!set) {
        if (time >= 500 && time <= 1200) {
         systemMsg(`בוקר טוב ${name} !` , true);
        } else if (time >= 1200 && time <= 1700) {
         systemMsg(`צהריים טובים ${name} !`, true);
        } else if (time >= 1700 && time <= 2100) {
         systemMsg(`ערב טוב ${name} !`,  true);
        } else if (time >= 2100 || time >= 0 && time <= 100) {
         systemMsg(`ערב-לילה טוב ${name} !`, true);
        } else if (time >= 100 && time <= 500) {
         systemMsg(`ליל מנוחה ${name} !`, true);
        }
    }
    if (!set) {
        $("#name").remove();
        $("#color").remove();
        $("#send").css("cssText",`width: -webkit-calc(30% - 10px) !imortant; width: -moz-calc(30% - 10px) !important; width: calc(30% - 10px) !important;`);
        $("#message").css("cssText",'width: -webkit-calc(70% - 10px) !important; width: -moz-calc(70% - 10px) !important; width: calc(70% - 10px) !important;');
        set = true;
    }
    $(msgColr).css("background-color", "");
    $(msgColr).css("color", "");
}
socket.on();
$("#send").click(() => {
    var msgStr = $("#message").val();
});
var expendedTime = num => {
    num = String(num);
    if(num.length == 1) {
        num = '0' + num;
    }
    return num;
}