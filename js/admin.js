var audio = new Audio();
audio.volume = 0.1;
document.body.appendChild(audio);
var nextGetTo = true;
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    /*音乐播放*/
    if(sessionStorage.getItem("conentData")) {
    chrome.runtime.sendMessage(JSON.parse(sessionStorage.getItem("conentData")),function(response) {

    });
}
// chrome.runtime.sendMessage({sendIndex: });
audio.addEventListener("timeupdate",function() {
    if(audio.ended) {
        console.log(nextGetTo);
        var num = 0;
    if(sessionStorage.getItem("currentNum")) {
        num = sessionStorage.getItem("currentNum");
    }
    
    if(localStorage.getItem("scMusicData")) {
        var jsonData = JSON.parse(localStorage.getItem("scMusicData"));
        if(nextGetTo) {
            num++;
            nextGetTo = false;
            if(jsonData[num]) {
                $.get("http://www.kugou.com/yy/index.php?r=play/getdata&hash="+jsonData[num].FileHash+"&album_id="+jsonData[num].AlbumID+"&_=1498479025324",function(data) {
                    // console.log(data);
                    var gJsonData = JSON.parse(data);
                    sessionStorage.setItem("conentData",JSON.stringify(gJsonData));
                    audio.src = gJsonData.data.play_url;
                    audio.play();
                    nextGetTo = true;

                });
            }else {
                num = 0;
                 $.get("http://www.kugou.com/yy/index.php?r=play/getdata&hash="+jsonData[num].FileHash+"&album_id="+jsonData[num].AlbumID+"&_=1498479025324",function(data) {
                    // console.log(data);
                    var gJsonData = JSON.parse(data);
                    sessionStorage.setItem("conentData",JSON.stringify(gJsonData));
                    audio.src = gJsonData.data.play_url;
                    audio.play();
                    nextGetTo = true;
                });
            }
        }
    }
    sessionStorage.setItem("currentNum",num);
    return ;
    }
    chrome.runtime.sendMessage({currentTime: audio.currentTime,duration: audio.duration},function(response) {

    });
});
chrome.runtime.sendMessage({paused: audio.paused},function(response) {

});
    if(message=="getData") {
        if(sessionStorage.getItem("musicData")&&(!localStorage.getItem("scMusicData"))) {
            sendResponse(sessionStorage.getItem("musicData"));
        }else {
            if(localStorage.getItem("scMusicData")) {
                sendResponse(localStorage.getItem("scMusicData"));
            }else {
                sendResponse(null);
            }
            
        }
        return ;
    }
    if(message=="next") {
              var num = 0;
    if(sessionStorage.getItem("currentNum")) {
        num = sessionStorage.getItem("currentNum");
    }
    num++;
    if(localStorage.getItem("scMusicData")) {
        var jsonData = JSON.parse(localStorage.getItem("scMusicData"));
        console.log(jsonData[num]);
        if(jsonData[num]) {
            $.get("http://www.kugou.com/yy/index.php?r=play/getdata&hash="+jsonData[num].FileHash+"&album_id="+jsonData[num].AlbumID+"&_=1498479025324",function(data) {
                // console.log(data);
                var gJsonData = JSON.parse(data);
                sessionStorage.setItem("conentData",JSON.stringify(gJsonData));
                audio.src = gJsonData.data.play_url;
                audio.play()

            });
        }else {
            num = 0;
             $.get("http://www.kugou.com/yy/index.php?r=play/getdata&hash="+jsonData[num].FileHash+"&album_id="+jsonData[num].AlbumID+"&_=1498479025324",function(data) {
                // console.log(data);
                var gJsonData = JSON.parse(data);
                sessionStorage.setItem("conentData",JSON.stringify(gJsonData));
                audio.src = gJsonData.data.play_url;
                audio.play();

            });
        }
    }
    sessionStorage.setItem("currentNum",num);
        return ;
    }
      if(typeof message=="number") {
            audio.volume = message;
            console.log(message);
            sendResponse("设置成功");
            return ;
        }
        // console.log(message);
        if("songData" in message) {
                if(localStorage.getItem("scMusicData")) {
                    var retrunScArr = [];
                    var scMusicDataJson = JSON.parse(localStorage.getItem("scMusicData"));
                    if(message.songDataLength==-1) {
                        sendResponse(scMusicDataJson);
                    }else {
                        for(var i=message.songData*message.songDataLength;i<(message.songData*message.songDataLength)+message.songDataLength;i++) {
                            retrunScArr.push(scMusicDataJson[i]);
                        }
                        sendResponse(retrunScArr);
                    }
                    
                }else {
                    sendResponse(null);
                }
            return ;
        }
        if("delScData" in message) {
                var newScArr = [];
                if(localStorage.getItem("scMusicData")) {
                    var oldScArr = JSON.parse(localStorage.getItem("scMusicData"));
                    oldScArr.forEach(function(e) {
                        if(!(e.FileHash==message.delScData.hash&&e.AlbumID==message.delScData.id)) {
                            newScArr.push(e);
                        }
                    });
                    localStorage.setItem("scMusicData",JSON.stringify(newScArr));
                    sendResponse({state: 1,msg: "删除成功"});
                }
            return ;
        }
        if("scHash" in message) {
            var scArr = [];
            var isAdd = true;
            if(localStorage.getItem("scMusicData")) {
                scArr = JSON.parse(localStorage.getItem("scMusicData"));
            }
            scArr.forEach(function(e) {
                if(e.AlbumID==message.AlbumID&&e.FileHash==message.FileHash) {
                    isAdd = false;
                }
            });
            if(isAdd) {
                scArr.push(message);
            }
            
            localStorage.setItem("scMusicData",JSON.stringify(scArr));
            return ;
        }
        if("state" in message) {

            if(message.state) {
                audio.pause();
            }else {
                audio.play();
            }
            sendResponse(audio.paused);
            return ;
        }
    if("hash" in message) {
        sessionStorage.setItem("currentNum",message.num);
        $.get("http://www.kugou.com/yy/index.php?r=play/getdata&hash="+message.hash+"&album_id="+message.id+"&_=1498479025324",function(data) {
            // console.log(data);
            var jsonData = JSON.parse(data);
            sessionStorage.setItem("conentData",JSON.stringify(jsonData));
            chrome.runtime.sendMessage(jsonData,function(response) {
                if(response=="成功") {
                    audio.src = jsonData.data.play_url;
                    audio.play();
                }
            });
        });
        sendResponse("OK");
        return ;
    }
    sessionStorage.setItem("musicData",JSON.stringify(message));
    if(sessionStorage.getItem("musicData")) {
        sendResponse(sessionStorage.getItem("musicData"));
    }
});