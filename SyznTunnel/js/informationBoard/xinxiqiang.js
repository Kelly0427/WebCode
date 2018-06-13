//控件的高度
size();
$(window).resize(function(){
	size();
})
function size(){
	var height = $(window).height()-$('.breadcrumb').outerHeight(true)-$('.page-title').outerHeight(true);
	$('#playdiv').height(height);
}
//找的关联的摄像机
findByDeviceCode(localStorage.getItem('linkagedevice'));

//要播放的摄像机的cameraID,areaCode
var cameraID,areaCode = null;
function findByDeviceCode(deviceCode){
	$.ajax({
		url: "/video/findByDeviceCode",
		type: "get",
		dataType: "json",
		data:{
			'deviceCode':deviceCode
		},
		success: function(data) {
			console.log(data);
			cameraID = data.cameraID;
			areaCode = data.areaCode;
			//初始化控件
			initVideoActive(cameraID,areaCode);
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

//检查控件
function initVideoActive(videoSource,videoSourceAreaCode){
	g_imosActivePlayer = document.all.h3c_IMOS_ActiveX;
	g_PlayFrame = document.all.Play_Frame;
	if(!g_imosActivePlayer) {
		alert("未安装控件，请先安装后控件！");
	}
	var xmldoc;
	try{
		xmldoc = new ActiveXObject("Microsoft.XMLDOM");
		if(!xmldoc){
		   xmldoc = new ActiveXObject("MSXML2.DOMDocument.3.0");  
		}
	}catch(e){   
	     
	}
	g_xmlActive = xmldoc;
	if(!g_xmlActive){
		alert("xml解析器获取错误，将导致某些功能不可用");
	}else{
		g_xmlActive.async = "false";  
	}
	//IMOS控件的底部控制栏不显示
	g_imosActivePlayer.IMOSAX_ShowToolBar(2,0);
	//查询服务器参数
	//消除视频上锯齿
	g_imosActivePlayer.IMOSAX_SetSingleCfgParam("RenderMode","0");
	getServerConfInfo(videoSourceAreaCode,videoSource);
}	

//查询服务器参数
function getServerConfInfo(areaCode,source){      
	console.log(areaCode);
	$.ajax({
		url: "/serverconfmanage/getServerConfInfo",
		type: "get",
		dataType: "json",
		data:{
			'type':'131',
			'areaCode':areaCode
		},
		success: function(data) {
			console.log(data);
			getServerConfInfoBack(data);
		},
		error:function(){
			HiddenLoading();
			var box = $("#mb-save-row");
	        box.addClass("open");
	        box.find('.faIcon').removeClass('fa-check').addClass('fa-times');
	        box.find('.fontCon').html('加载用户设备异常');
	        box.find('.mb-footer').show();
	        box.find(".mb-control-yes").on("click",function(){
	          box.removeClass("open");
	        })
		}
	})
}


//查询服务器参数回调函数，登录服务器
function getServerConfInfoBack(serverList){
	//alert('服务器');
	if(!g_imosActivePlayer){
        alert("未安装控件，请先安装后控件！");
        return;
    }
	if(serverList.length < 1){
		alert('请先配置视频服务器！');
		return;
	}
    var serverIP = serverList.config.split(';')[0];
    var serverPort = serverList.config.split(';')[1];
	var userName = serverList.config.split(';')[2];
    var passWd = serverList.config.split(';')[3];
    g_isLogin = g_imosActivePlayer.IMOSAX_InitOCX(serverIP, serverPort, userName, passWd, 1);
	if(g_isLogin != 0){
		var msg = "宇视IMOS平台"+serverIP+"登录失败，用户名:"+userName+"请联系管理员!";
		alert(msg);
		//getErrorMessage(g_isLogin);
		return;
	}
	var retStr = g_imosActivePlayer.IMOSAX_GetUserLoginInfo();
    var userObj = loadXML(retStr);
    g_UserLoginId = userObj.documentElement.selectNodes("//LOGININFO/UserLoginIDInfo/UserLoginCode")[0].text;

    playVideo(cameraID);
//    playVideo('LZGS-HIC7621HX22-709');
}
function playVideo(curCameraID){
	setScreenNum(1);
	 g_imosActivePlayer.IMOSAX_StartFrameLive(1,curCameraID);
	 g_imosActivePlayer.IMOSAX_UsePtzPreset(curCameraID, '2'); //调用预置点
}

function loadXML(xmlString){
    if(!g_xmlActive){
        return;
    }
    g_xmlActive.loadXML(xmlString);
    if(0 == g_xmlActive.parseError.errorCode){
        return g_xmlActive;
    }
    else{
        alert("xml解析错误:" + g_xmlActive.parseError.reason);
        return null;
    } 
} 
//退出登录
$('.backBtn').click(function(){
	DoLogout();
	deleteItem();
})
function deleteItem(){
    localStorage.removeItem('linkagedevice');
}
function DoLogout(){
  	if(g_imosActivePlayer){
		for(var i = 1; i <= 25;i++)
			g_imosActivePlayer.IMOSAX_StopFrameLive(i);
			g_isLogin=1;
    		 var flag = g_imosActivePlayer.IMOSAX_UnregOCX();
	      if(0 != flag){
	      
	      }
  	}
}


//设置窗口的多画面显示模式
function setScreenNum(frameNum)
{
	var focusFrame = g_imosActivePlayer.IMOSAX_GetFocusFrame();
	switch (frameNum)
	{
		case 1:
			
			//g_imosActivePlayer.IMOSAX_MaxFrame(focusFrame);
			g_imosActivePlayer.IMOSAX_ChangeLayout(frameNum);
			
			break;
		case 0:
			g_imosActivePlayer.IMOSAX_FullScreen();
			break;
		default:
			g_imosActivePlayer.IMOSAX_ChangeLayout(frameNum);
			break;
		
	}
}
