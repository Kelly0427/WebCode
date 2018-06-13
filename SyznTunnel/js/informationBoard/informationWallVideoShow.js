//上元控件
var g_activePlayer=null;
g_activePlayer=document.getElementById("videoobj");
g_activePlayer.SetFrameMode(1,1); 
var controlLimit=0;
$.ajax({
	type : 'get',
	dataType : "json",
	url : "/operator/isCanControlleDevice",
	success : function(res) { 
		console.log(res);
		if(res){
			controlLimit=1;	
		}
		//alert("查询用户权限正常");
	},
	error : function() {
//		var box = $("#mb-remove-error");
//		box.addClass("open");
//		box.find(".mb-control-yes").on("click", function() {
//			box.removeClass("open");
//		})
		alert("用户权限查询异常");}
	});



//获取联动视频资源
function findByDeviceCode(deviceCode){
	$.ajax({
		url: "/video/findByDeviceCode",
		type: "get",
		dataType: "json",
		data:{
			'deviceCode':deviceCode
		},
		async:false,
		success: function(data) {
			console.log(JSON.stringify(data));
			startPlay(0,data);
			 
//			startPlay(SelectedChannel,videoSource);
		},
		error:function(data){
			$('#showVideoModal').modal('hide');
			var box = $("#mb-remove-row");
            box.addClass("open");
            $('.alertFont').html('请求失败！');
            box.find(".mb-control-yes").on("click",function(){
                 box.removeClass("open");
            })
		}
	})
}

//控件初始化
//function initVideoActive(){   
//	g_activePlayer=document.getElementById("videoobj");
//	g_activePlayer.SetFrameMode(1,1); //此函数有问题20180206
//}

function startPlay(nChannel,deviceInfo){
	setTimeout(showVideo,1000);
    function showVideo(){
    	console.log(deviceInfo);
    }
	//var deviceInfo = parent.VideoSourceHashTable.getValue(SelectedDeviceNo);
	//DeviceArr[nChannel] = deviceInfo;//记录当前播放通道的设备信息
	
	var chServerIP = deviceInfo.liveServerConfig.iP;
	var nServerPort = deviceInfo.liveServerConfig.port;
	var chLiveStreamName = deviceInfo.liveStreamName;
	var chLiveStreamName2 = deviceInfo.liveStreamName2;
	var chDeviceIP = deviceInfo.deviceIP;
	var nDevicePort = deviceInfo.devicePort;
	var chStreamName = deviceInfo.streamName
	var streamNameSmall = deviceInfo.subStreamName;			
	var chDevName = deviceInfo.deviceName;
	var chUser = deviceInfo.deviceLoginName;
	var chPwd = deviceInfo.deviceLoginPwd;
	var chProtocol = deviceInfo.streamProtocolName;
	var frameSpeed = 25;
	var nPtzCtrl = deviceInfo.ptzControlFlag;
	var nPtzPort = deviceInfo.ptzPort;
	var chDeviceCode=deviceInfo.deviceCode;
	if(chServerIP != null && nServerPort != null && chStreamName != null && chDevName != null && chProtocol != null)
	{
		var flag;
//		if(BeforePlayFlag == 3)
//		{
//			flag = 0;
//		}
//		else
//		{
//			flag = BeforePlayFlag;
//		}
		//如果相机没有子码流，传两个主码流名称，标志位设置为1主码流高清
		if(streamNameSmall == null || streamNameSmall == "")
		{
			streamNameSmall = chStreamName;
			flag = 1;
		}
		if(chLiveStreamName2 == null || chLiveStreamName2 == "")
		{
			chLiveStreamName2 = chLiveStreamName;
			flag = 1;
		}	
		
		//alert("进入播放函数了");
		
		if(controlLimit == 1){
			
			g_activePlayer.StartPlay(nChannel, 
					chDeviceIP, nDevicePort,
					chStreamName, chDevName,
					chUser, chPwd,
					chProtocol,frameSpeed,streamNameSmall,flag,
					nPtzCtrl,chDeviceCode,nPtzPort);
		}
		else {
			g_activePlayer.StartPlay(nChannel, 
										chServerIP, nServerPort,
										chLiveStreamName, chLiveStreamName2,
										chUser, chPwd,
										chProtocol,frameSpeed,chLiveStreamName2,flag,
										controlLimit,chDeviceCode,nPtzPort);				
		}
		
		
		
//		var playInfo = new CurrChannelPlayInfo(SelectedDeviceNo,flag);
//		ChannelInfo.setValue(nChannel,playInfo);//保存指定通道上的信息
	}
	//记录播放通道的设备编号 控件屏蔽 cxp
	//videoSourceSelected(nChannel,chStreamName);
	//清空被选中的设备编号将鼠标恢复默认形状
//	parent.SelectedDeviceNo = null;
//	$("body").css({cursor:"default"});
//	parent.setCurDefault();
//	setCursorType(0);
	
}