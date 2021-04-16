var btn = document.querySelector("button");
var volume = document.querySelector("#volume");
var page = 1;
var songLength = -1;
btn.onclick = function() {
	chrome.runtime.sendMessage(Number(volume.value),function(response) {
		alert(response);
	});
}
chrome.runtime.sendMessage({songData: page,songDataLength: songLength},function(response) {
	console.log(response);
	if(response) {
		var str = "";
		response.forEach(function(e) {
			str += "<tr>";
			str += "<td>"+e.SongName+"</td>";
			str += "<td>"+e.Auxiliary+"</td>";
			str += "<td><button data-hash='"+e.FileHash+"' data-id='"+e.AlbumID+"' class='btn btn-primary delItem'>删除</button></td>";
			str += "</tr>";
		});
		$(".songList").append(str);
		$(".songList .delItem").click(function() {
			chrome.runtime.sendMessage({delScData: {hash: $(this).attr("data-hash"),id: $(this).attr("data-id")}},function(response) {
				if(response.state==1) {
					alert(response.msg);
					location.reload();
				}else {
					alert(response.msg);
				}
			});
		});
	}
});