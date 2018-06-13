	informationBase('');
	DoLogout();
	function informationBase(position) {
		ShowLoading();
		$.ajax({
			url: "/device/cmsScreenFindByPosition",
			async:true,
			type: "get",
			dataType: "json",
			data:{
	            'deviceType':'情报板',
	            'position':position
			},
			success: function(data) {
				HiddenLoading();	
				console.log(data);
		        var positionArr = [];   
		        var cmsSize,width,height,cmsSize;
        		var cmsSizeArr = [];
		        var cmsBar = ''; 
		        $.each(data,function(index,item){
		        	if(item.position){
				 		 positionArr.push(item.position);
						 positionArr = positionArr.distinct();
				 	}
				 	if(item.devconfig){
				 		 cmsSetting(item.devconfig);
				 		 width = itemCmsJson.w;
				 		 height = itemCmsJson.h;
				 		 cmsSize = width+'*'+height;
				 		 cmsSizeArr.push(cmsSize);
					 	 cmsSizeArr = cmsSizeArr.distinct();
				 	}
		        });       
		        console.log(positionArr);
		        console.log(cmsSizeArr);
		        $.each(positionArr,function(index,item){
		        	
		        	var positionAll = item;
		        	cmsBar +='<div class="row">';
                    cmsBar +='    <div class="col-md-12 mt20">';
                    cmsBar +='       <div class="panel panel-default">';
			        cmsBar +='         	<div class="panel-heading" style="padding:5px;">';
			        cmsBar +='                <h3 class="panel-title">'+positionAll+'</h3>';       
			        cmsBar +='            </div>';
			        $.each(cmsSizeArr,function(index,item){
			        	var cmsSizeArrAll = item;
		                    cmsBar +='            <div class="panel-body cmsWall">';
		        			cmsBar +='            <h4 style="margin-bottom:0px;margin-top:4px;margin-left:10px;">'+cmsSizeArrAll+'</h4>';
                			cmsBar +='                <ul class="wall-ul '+positionAll+' clearfix '+cmsSizeArrAll+'">';
				        	$.each(data,function(index,item){
					        	if(item.devconfig){
							 		cmsSetting(item.devconfig);
							 		width = itemCmsJson.w;
							 		height = itemCmsJson.h;
							 		cmsSize = width+'*'+height;
							 		if(positionAll == item.position && cmsSize == cmsSizeArrAll){
						        		cmsBar+='<li class="wall-li borderBlack" onclick="sendToThis(this)" id="'
						            		+item.devicecode+'" cmsId="'+item.id+'"><div class="wall-jiankongBar" style=""><div class="wall-jiankong" style="width:'
						            		+width+'px;height:'+height+'px;background:#000;text-align:center;margin:0 auto;color:#ddd;"><div class="cmsCon" style="position: relative;top: 50%;transform: translateY(-50%);">正在读取</div></div></div><p class="wall-name">'
						            		+item.comment;
						            	if(item.linkagedevice){
							            
						            	//		cmsBar+='<span class="fa fa-caret-square-o-right" onclick="showVideo(this)" title="查看实时视频" style="cursor:pointer;font-size:16px;margin-left:2px;" linkagedevice='+item.linkagedevice+'></span>';
						            	
						            		cmsBar+='<a href="/informationBoard/videoCheck"><span class="fa fa-caret-square-o-right"></span></a>';
						            	}
						            	cmsBar+='</p><span class="boardSize" style="display:none;">'
				          					+width+'*'+height+'</span></li>'
							 		}
							 	}
							 	
						 	})
							cmsBar +='			       </ul>';                             
		                    cmsBar +='           </div>';
                    });
                    cmsBar +='        </div>';
                   	cmsBar +='     </div>';
                  	cmsBar +=' </div>';
		        })
		        $('.cmsBar').html(cmsBar); 
		        for(var i = 0;i<$('.cmsWall').length;i++){
				 	console.log($(".cmsWall").eq(i).find("li").length);
					if($(".cmsWall").eq(i).find("li").length == '0'){
						$('.cmsWall').eq(i).hide();
					}
				}
		        
			},
			error:function(data){
				HiddenLoading();	
				var box = $("#mb-remove-row");
	            box.addClass("open");
	            $('.alertFont').html('请求失败！');
	            box.find(".mb-control-yes").on("click",function(){
	                 box.removeClass("open");
	            })
			}
		})
	}

	function informationBase1(num,position) {
		ShowLoading();
		nowNum = num;
		$.ajax({
			url: "/device/cmsScreenFindByPosition",
			type: "get",
			dataType: "json",
			data:{
				'page':num-1,
	            'size':13,
	            'deviceType':'情报板',
	            'position':position
			},
			success: function(data) {
				HiddenLoading();	
				console.log(data);
		        var positionArr = [];   
		        var cmsBar = ''; 
		        $.each(data,function(index,item){
		        	if(item.position){
				 		 positionArr.push(item.position);
						 positionArr = positionArr.distinct();
				 	}
		        });       
		        $.each(positionArr,function(index,item){
		        	var positionAll = item;
		        	cmsBar +='<div class="row">';
                    cmsBar +='    <div class="col-md-12 mt20">';
                    cmsBar +='       <div class="panel panel-default">';
			        cmsBar +='         	<div class="panel-heading">';
			        cmsBar +='                <h3 class="panel-title">'+positionAll+'</h3>';       
			        cmsBar +='            </div>';
                    cmsBar +='            <div class="panel-body">';
                    cmsBar +='                <ul class="wall-ul '+positionAll+' clearfix">';
		        	$.each(data,function(index,item){
		        		var cmsSize,width,height,cmsSize;
		        		var cmsSizeArr = [];
		        		if(item.devconfig){
					 		 cmsSetting(item.devconfig);
					 		 width = itemCmsJson.w;
					 		 height = itemCmsJson.h;
					 		 cmsSize = width+'*'+height;
					 		 cmsSizeArr.push(item.cmsSize);
						 	 cmsSizeArr = cmsSizeArr.distinct();
					 	}
		        		if(positionAll == item.position){
	        				cmsBar+='<li class="wall-li borderBlack" onclick="sendToThis(this)" id="'
		            			+item.devicecode+'" cmsId="'+item.id+'"><div class="wall-jiankongBar" style=""><div class="wall-jiankong" style="width:'
		            			+width+'px;height:'+height+'px;background:#000;text-align:center;margin:0 auto;color:#ddd;"><div class="cmsCon" style="position: relative;top: 50%;transform: translateY(-50%);">正在读取</div></div></div><p class="wall-name">'
		            			+item.comment;
		            		if(item.linkagedevice){
			            		cmsBar+='<span class="fa fa-caret-square-o-right" onclick="showVideo(this)" title="查看实时视频" style="cursor:pointer;font-size:16px;margin-left:2px;" linkagedevice='+item.linkagedevice+'></span>';
		            		}
		            		cmsBar+='</p><span class="boardSize" style="display:none;">'
          						+width+'*'+height+'</span></li>'
		        		}
		        	})
					cmsBar +='			       </ul>';                             
                    cmsBar +='           </div>';
                    cmsBar +='        </div>';
                   	cmsBar +='     </div>';
                  	cmsBar +=' </div>';
		        })
		        $('.cmsBar').html(cmsBar); 
		        
				//分页
				$("#page").paging({
					pageNo: num,
					totalPage: data.totalPages,
					totalSize: data.totalElements,
					callback: function(num) {
						informationBase(num,widthHeight);
					}
				})
			},
			error:function(data){
				HiddenLoading();	
				var box = $("#mb-remove-row");
	            box.addClass("open");
	            $('.alertFont').html('请求失败！');
	            box.find(".mb-control-yes").on("click",function(){
	                 box.removeClass("open");
	            })
			}
		})
	}

	 var sock = new SockJS("/endpointChat");
	 var stomp = Stomp.over(sock);
	 stomp.connect('guest', 'guest', function(frame){
	     stomp.subscribe("/queue/cmsText", cmsText);
	 });
	 function cmsText(message){
	 	console.log(message);
	 	var messsgeStr = JSON.parse(message.body);
	 	$.each(messsgeStr,function(index,item){
	 		var id = item.deviceCode;
	 		variantValue = item.variantValue;
	 		var variantNO = item.variantNO;
	 		
	 		cmsStatus(item.brokenDevice);
	 		Explain(id,variantValue,variantNO);
	 	});
	 }
	function Explain(thisId,variantValue,variantNO){
		variantValue = JSON.parse(variantValue);
		if(variantNO == 1){
			var myId = thisId;
			var thisBorad = document.getElementById(myId).getElementsByClassName('wall-jiankong')[0];
			var thisBoradCon = document.getElementById(myId).getElementsByClassName('cmsCon')[0];
			var myCountent = "";
			var myFontFamily = "";
			var myFontSize = "";
			var myFontcolor = "";
			var myCountentArr = [];  //定义坐标内容
			for(var i = 0; i < variantValue.length;i++){
			    myCountentArr.push(variantValue[i].content);          //内容数组
			    myCountent = myCountentArr.join('<br />');     //内容字符串
				myFontFamily = switchFont(parseInt(variantValue[0].font));
			    myFontcolor = switchColorCss(parseInt(variantValue[0].fontcolor));
			    myFontSize = switchFontSize(parseInt(variantValue[0].fontsize));
			}
		    
			thisBoradCon.innerHTML = myCountent;   
			thisBorad.style.fontFamily = myFontFamily;
			thisBorad.style.fontSize = myFontSize + 'px';
			thisBorad.style.lineHeight = myFontSize + 'px';
			thisBorad.style.color = myFontcolor;
		}
	}	
	
	function cmsStatus(statusArr){
		 $.each(statusArr,function(index,item){
			var cmsId =  '#'+item;
			$('body').find(cmsId).find('.cmsCon').html('通讯故障');
		})
	}
	
	
	
	//获取选中的情报板，id用于页面间传值，情报板尺寸用于判断选中的情报板是不是同一类型
	var sendId = [];
	var boardSize = [];
	function sendToThis(btn){
		 sendToThisId = $(btn).attr('cmsId');
		 sendToThisBoardSize = $(btn).find('.boardSize').text();
		 $(btn).toggleClass('checked');
		 if($(btn).hasClass("checked")){
			 sendId.push(sendToThisId);  
			 boardSize.push(sendToThisBoardSize);
		 }else{
			 sendId.splice($.inArray(sendToThisId,sendId),1); 
			 boardSize.splice($.inArray(sendToThisBoardSize,boardSize),1); 
		 }
		 localStorage.setItem('cmsSize',boardSize);
	}
	
//选择发布信息的情报板
function sendMessage(){
	//找出所选的情报板的尺寸相同的个数与所选择的情报板的个数进行比较，若相同说明所选的情报板类型都是相同的
	 var num = 1;//用于保存相同的个数
	 for(var i = 0; i < boardSize.length;i++){
	     if(boardSize[i]==boardSize[i+1]){
	         num+=1;                    
	     }
	 }
	  if(sendId.length != 0){
		  if(boardSize.length ==num){
				 $('.sendIds').val(sendId);
				 $('#formSubmit').submit();
			 }else{
				 var box = $("#mb-remove-row");
			      box.addClass("open");
			      $('.alertFont').html('请选择相同尺寸的情报板！');
			      box.find(".mb-control-yes").off("click").on("click",function(){
			    	  box.removeClass("open");
			      });
			 }
	  }else{
		  var box = $("#mb-remove-row");
	      box.addClass("open");
	      $('.alertFont').html('请选择情报板！');
	      box.find(".mb-control-yes").off("click").on("click",function(){
	    	  box.removeClass("open");
	      });
	  }
};
function sendMessage1(){
	  if(boardSize.length < 1){
		  var box = $("#mb-remove-row");
	      box.addClass("open");
	      box.find('.alertFont').text('请选择情报板！');
	      box.find(".mb-control-yes").off("click").on("click",function(){
	    	  box.removeClass("open");
	      });
      }else{
      	  $('.sendIds').val(sendId);
		  $('#formSubmitAdd').submit();
		  $("input[name='id1[]']").prop('checked',false);
      }
 };
$('.sendMessageFromTunnel').click(function(){
	sendMessage();
});
$('.sendMessageAndAdd').click(function(){
	sendMessage1();
})
//数组去重
Array.prototype.distinct = function (){
  var arr = this,
    i,
    j,
    len = arr.length;
  for(i = 0; i < len; i++){
    for(j = i + 1; j < len; j++){
      if(arr[i] == arr[j]){
        arr.splice(j,1);
        len--;
        j--;
      }
    }
  }
  return arr;
}; 
//视频联动/video/findByDeviceCode，deviceCode





var linkVideoSource="";
var videoSourceArea="";
var g_imosActivePlayer = null;
var g_isLogin=1;

function showVideo(btn){
	
	linkVideoSource="";
	videoSourceArea="";
//	event.stopPropagation();
	//取消事件冒泡
     var e=arguments.callee.caller.arguments[0]||event; //若省略此句，下面的e改为event，IE运行可以，但是其他浏览器就不兼容
     if (e && e.stopPropagation) {
     // this code is for Mozilla and Opera
     e.stopPropagation();
     } else if (window.event) {
     // this code is for IE
      window.event.cancelBubble = true;
     }
	console.log($(btn).attr('linkagedevice'));
	//initVideoActive();
	
	$('#showVideoModal').modal('show');
	//findByDeviceCode1($(btn).attr('linkagedevice'));
	 initVideoActive('LZGS-HIC7621HX22-709','6');
	//setTimeout( initVideoActive(linkVideoSource,videoSourceArea),60000);
	
}
function findByDeviceCode1(deviceCode){
	$.ajax({
		url: "/video/findByDeviceCode",
		type: "get",
		dataType: "json",
		data:{
			'deviceCode':deviceCode
		},
		success: function(data) {
			//playVideo(0,data);
			linkVideoSource=data.cameraID;
			videoSourceArea=data.areaCode;
			// DoLogout();
		   
			 initVideoActive('LZGS-HIC7621HX22-709','6');
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
	//alert(localStorage.getItem('videoIndex'));
	//查询服务器参数
	//alert(localStorage.getItem('videoIndex'));
	getServerConfInfo(videoSourceAreaCode,videoSource);
	//getServerConfInfo('6');
	
	
}	

//查询服务器参数
function getServerConfInfo(areaCode,source){      
	console.log(areaCode);
	console.info('getServerConfInfo:'+areaCode+';'+source);
	//sendData("serverconfmanage/getServerConfInfo.do","type=131",getServerConfInfoBack,false);
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
			
			
			
			getServerConfInfoBack(data,source);
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
function getServerConfInfoBack(serverList,videoSourceID){
	//alert('服务器');
	if(!g_imosActivePlayer){
      alert("未安装控件，请先安装后控件！");
      return;
  }
	if(serverList.length < 1){
		alert('请先配置视频服务器！');
		return;
	}
	//alert(1);
  var serverIP = serverList.config.split(';')[0];
  var serverPort = serverList.config.split(';')[1];
	var userName = serverList.config.split(';')[2];
  var passWd = serverList.config.split(';')[3];
  
 
  g_isLogin = g_imosActivePlayer.IMOSAX_InitOCX(serverIP, serverPort, userName, passWd, 1);
	
 
  if(g_isLogin != 0){
		var msg = "宇视IMOS平台"+serverIP+"登录失败，用户名:"+userName+"请联系管理员!";
		//alert(msg);
		//getErrorMessage(g_isLogin);
		return;
	}
	var retStr = g_imosActivePlayer.IMOSAX_GetUserLoginInfo();
  var userObj = loadXML(retStr);
  g_UserLoginId = userObj.documentElement.selectNodes("//LOGININFO/UserLoginIDInfo/UserLoginCode")[0].text;
  if(linkVideoSource!=""){
	    playVideo(videoSourceID);}
  else{
  	alert("关联摄像机查询异常");
  }
}


//$('#videoCheckClose').click(DoLogout());





//退出登录
function DoLogout(){
  if(g_imosActivePlayer){
  	
		for(var i = 1; i <= 25;i++)
			g_imosActivePlayer.IMOSAX_StopFrameLive(i);
		g_isLogin=1;
     var flag = g_imosActivePlayer.IMOSAX_UnregOCX();
      if(0 != flag){
         //暂时不提示
      }
  }
}

function playVideo(curCameraID){
	console.info(curCameraID);
	// g_imosActivePlayer.IMOSAX_StartFrameLive(g_curFocusFrame,curCameraID);
	 g_imosActivePlayer.IMOSAX_StartFrameLive(1,curCameraID);
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

