//音乐播放器前台显示页
var $search = $(".search-button");
var page = 1;
var pageSize = 20;
var currMusic = "";
chrome.runtime.sendMessage("getData",function(response) {
	if(response) {
		var jsonData = JSON.parse(response);
		var str = "";
		if(jsonData.data) {
			jsonData.data.lists.forEach(function(e,i) {
					str += "<li data-num='"+i+"' data-name='"+e.FileName+"' data-hash='"+e.FileHash+"' data-id='"+e.AlbumID+"'>";
					str += "<h3>";
					str += e.FileName;
					str += "</h3>";
					str += "<p>";
					str += e.Auxiliary;
					str += "</p>";
					str += "<span class='timeLength'>";
					str += conversionDate(e.Duration);
					str += "</span>";
			});
			$(".list ul").empty().append(str);
		}else {
			console.log(jsonData);
			jsonData.forEach(function(e,i) {
					str += "<li data-num='"+i+"' data-name='"+e.FileName+"' data-hash='"+e.FileHash+"' data-id='"+e.AlbumID+"'>";
					str += "<h3>";
					str += e.FileName;
					str += "</h3>";
					str += "<p>";
					str += e.Auxiliary;
					str += "</p>";
					str += "<span class='timeLength'>";
					str += conversionDate(e.Duration);
					str += "</span>";
			});
			$(".list ul").empty().append(str);
			$(".list ul [data-hash='"+currMusic+"']").css({
				"background-color": "#0099FF",
				"color": "#fff"
			}).siblings().css({
				"background-color": "transparent",
				"color": "#000"
			});
		}
	}
});
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	// console.log(message);
	if("data" in message) {
		$(".player-img").css({
				"background-image": "url("+message.data.img+")",
				"background-repeat": "no-repeat",
				"background-size": "cover"
			});
		$(".control-text").html(message.data.audio_name);
		currMusic = message.data.hash;
		
		sendResponse("成功");
		return ;
	}
	if("currentTime" in message) {
		// console.log(message);
		var jd = (message.currentTime/message.duration)*$(".control-jdt").width();
		$(".control-jd").width(jd);
		$(".control-jdt-col").css("left",jd);
		return ;
	}
	if("paused" in message) {
			if(message.paused) {
				$(".playing").removeClass("glyphicon-pause").addClass("glyphicon-play").data("state",false);
			}else {
				$(".playing").removeClass("glyphicon-play").addClass("glyphicon-pause").data("state",true);
			}
		return ;
	}
});
$(".playing").click(function() {
	console.log($(this).data("state"));
	chrome.runtime.sendMessage({state: $(this).data("state")},function(response) {
		if(response) {
				$(".playing").removeClass("glyphicon-pause").addClass("glyphicon-play").data("state",false);
			}else {
				$(".playing").removeClass("glyphicon-play").addClass("glyphicon-pause").data("state",true);
			}
	});
	
});
$(".nexting").click(function() {
	chrome.runtime.sendMessage("next",function(response) {
		if(response) {
				
		}
	});
});
$(".list ul").on("click","li",function() {
	console.log($(this));
	$(this).css({
		"background-color": "#0099FF",
		"color": "#fff"
	}).siblings().css({
				"background-color": "transparent",
				"color": "#000"
			});
	$(".playing").removeClass("glyphicon-pause").addClass("glyphicon-play").data("state",false);
	chrome.runtime.sendMessage({hash: $(this)[0].dataset.hash,id: $(this)[0].dataset.id,num: $(this)[0].dataset.num},function(response) {
		// console.log(response);

	});
});
$(".list ul").on("dblclick","li",function(e) {
	var self = this;
	var keyword = $(this).attr("data-name");
	e.stopPropagation();
	console.log(self);
	$.get("http://songsearch.kugou.com/song_search_v2?keyword="+keyword+"&page="+page+"&pagesize="+pageSize+"&userid=-1&clientver=&platform=WebFilter&tag=em&filter=2&iscorrection=1&privilege_filter=0&_=1498406253160",function(data) {
		var jsonData = JSON.parse(data);
		if(jsonData.status==1) {
			jsonData.data.lists.forEach(function(e) {
				if(e.AlbumID==$(self)[0].dataset.id&&e.FileHash==$(self)[0].dataset.hash) {
					e.scHash = true;
					chrome.runtime.sendMessage(e,function(response) {
						// console.log(response);

					});
				}
			});
		}
	});
	
});
$search.click(function() {
	var keyword = $(".search input").val();
	$.get("http://songsearch.kugou.com/song_search_v2?keyword="+keyword+"&page="+page+"&pagesize="+pageSize+"&userid=-1&clientver=&platform=WebFilter&tag=em&filter=2&iscorrection=1&privilege_filter=0&_=1498406253160",function(data) {
		var jsonData = JSON.parse(data);
		// console.log(jsonData);
		if(jsonData.status==1) {
			var str = "";
			console.log(jsonData);
			jsonData.data.lists.forEach(function(e,i) {
				str += "<li data-hash='"+e.FileHash+"' data-name='"+e.FileName+"' data-num='"+i+"' data-id='"+e.AlbumID+"'>";
				str += "<h3>";
				str += e.FileName;
				str += "</h3>";
				str += "<p>";
				str += e.Auxiliary;
				str += "</p>";
				str += "<span class='timeLength'>";
				str += conversionDate(e.Duration);
				str += "</span>";
			});
			$(".list ul").empty().append(str);
			chrome.runtime.sendMessage(jsonData,function(response) {
				// console.log(response);
				if(response) {
					console.log("写入成功");
				}
			});
		}

	});
});

function conversionDate(date) {
	// var date = date/1000;
	var second = parseInt(date%60)>=10?parseInt(date%60):"0"+parseInt(date%60);
	var minute = parseInt(date/60%60)>=10?parseInt(date/60%60):"0"+parseInt(date/60%60);
	return minute + ":" + second;
}