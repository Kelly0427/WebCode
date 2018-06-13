var public =  '/img/tunnelIcons';
var tunnelMonitoringTop = $('#container').offset().top;
deviceSystem('#isSystem');
areaSearchList('#area');
getTunnel('#getTunnel');
var marginTop,marginLeft,scale,containerTop;
scale1();
getDeviceList();
draggable();
$(window).resize(function(){
	scale1();
	$('.bgImg').css({"margin-top":marginTop+"px"});
	containerTop = $('#container').offset().top+marginTop;
})
function scale1(){
	var all  = $(window).width();
	scale = all/1700;
	marginLeft = (all - 1700)/2;
	marginTop = -(500 - (500 * scale))/2;
	$('.tunnelMap').css({"width":"1700px","transform": "scale("+scale+")","margin-left":marginLeft+"px","margin-top":marginTop+"px"});
}
var tunnelName;
$('#getTunnel').change(function(){
	haveDevice();
	tunnelName = $('#getTunnel option:selected').text();
	$('.tunnelName').text(tunnelName+'管理');
})
//获取基础设备列表
function getDeviceList(){
	$.ajax({
		type:"get",
		url:"/device/findAllDeviceLconType",
		async:false,
		dataType:'json',
		success:function(res){
			var html = '';
			var html1 = '';
			$.each(res,function(index,item){
				if(item.typeName == '交通信号灯'){
					html1 += '<li style="margin-bottom:8px;" class="deviceList"><div id="draggable'+index+'" style="float:left;height:40px;"><img src="/img/tunnelIcons'+item.comment+'" alt="" index="'+item.comment+'" name="'+item.typeName+'" style="cursor:pointer;height:40px;"/></div><div style="float:left;font-size:15px;color:#5B6073;line-height:35px;margin-left:25px;width:120px;">'+item.typeName+'</div></li>';
				}else{
					html += '<li style="margin-bottom:8px;" class="deviceList"><div id="draggable'+index+'" style="float:left;height:35px;width:35px"><img src="/img/tunnelIcons'+item.comment+'" alt="" index="'+item.comment+'" name="'+item.typeName+'" style="width:100%;height:100%;cursor:pointer;"/></div><div style="float:left;font-size:15px;color:#5B6073;line-height:35px;margin-left:10px;width:120px;">'+item.typeName+'</div></li>';
				}
			})
			$('.list-tags').html(html+html1);
		},
		error:function(res){
			console.log("获取数据失败，请重试");
		}
})
}
//初始化设备
haveDevice();
function haveDevice(){
	 $.ajax({
	   	type:"get",
	   	url:"/device/deviceData1",
	  	async:true,
	  	dataType:'json',
	  	data:{
	  		'mapNum':$('#getTunnel').val()
	  	},
	  	success:function(res){
	  		console.log(res);
		 	 var html = '';
		 	 $.each(res,function(index,item){	
		 	 	var deleteLeft = item.x - 16;
		 	 	var iconId = item.id;   
		 	 	var status = switchStatus(parseInt((item.device).status));
		 	 	var deviceIcons = (item.device).deviceLconTypeList;
		 	 	var iconSrc = '';
		 	 	$.each(deviceIcons,function(index,item){
		 	 		if(status == item.lconStatus){
		 	 			iconSrc = public + item.comment;
		 	 		}
		 	 	})
		 	 	if((((item.device).deviceLconType).typeName) == '交通信号灯'){
			 	 	html += "<img title='设备名称："+(item.device).deviceTypeName+"&#13设备编号："+(item.device).devicecode+"' src='"+iconSrc+"' style='cursor:pointer;position:absolute;top:"+item.y+"px;left:"+item.x+"px;height:40px' conJson='"+JSON.stringify(item)+"' class='showDevice' onmousedown='mousedown(this)' onmouseout='mouseup(this)' name='"+((item.device).deviceLconType).typeName+"'/><img src='/img/icons/btn_delete.png' style='cursor:pointer;display: block;position:absolute;top:"+item.y+"px;left:"+deleteLeft+"px;' class='btn_delete' onclick='btnDelete(this)' index="+iconId+">";
		 	 	}else if((((item.device).deviceLconType).typeName) == '车道指示器'){
		 	 		if((item.device).position == 1){
				 	 	html += "<img title='设备名称："+(item.device).deviceTypeName+"&#13设备编号："+(item.device).devicecode+"' src='/img/tunnelIcons/LSImage/LS_Left.png' style='cursor:pointer;position:absolute;top:"+item.y+"px;left:"+item.x+"px;height:35px;width:35px' conJson='"+JSON.stringify(item)+"' class='showDevice' onmousedown='mousedown(this)' onmouseout='mouseup(this)' name='"+((item.device).deviceLconType).typeName+"'/><img src='/img/icons/btn_delete.png' style='cursor:pointer;display: block;position:absolute;top:"+item.y+"px;left:"+deleteLeft+"px;' class='btn_delete' onclick='btnDelete(this)' index="+iconId+">";
		 	 		}else{
				 	 	html += "<img title='设备名称："+(item.device).deviceTypeName+"&#13设备编号："+(item.device).devicecode+"' src='/img/tunnelIcons/LSImage/LS_Right.png' style='cursor:pointer;position:absolute;top:"+item.y+"px;left:"+item.x+"px;height:35px;width:35px' conJson='"+JSON.stringify(item)+"' class='showDevice' onmousedown='mousedown(this)' onmouseout='mouseup(this)' name='"+((item.device).deviceLconType).typeName+"'/><img src='/img/icons/btn_delete.png' style='cursor:pointer;display: block;position:absolute;top:"+item.y+"px;left:"+deleteLeft+"px;' class='btn_delete' onclick='btnDelete(this)' index="+iconId+">";
		 	 		}
		 	 	}else{
			 	 	html += "<img title='设备名称："+(item.device).deviceTypeName+"&#13设备编号："+(item.device).devicecode+"' src='"+iconSrc+"' style='cursor:pointer;position:absolute;top:"+item.y+"px;left:"+item.x+"px;height:35px;width:35px' conJson='"+JSON.stringify(item)+"' class='showDevice' onmousedown='mousedown(this)' onmouseout='mouseup(this)' name='"+((item.device).deviceLconType).typeName+"'/><img src='/img/icons/btn_delete.png' style='cursor:pointer;display: block;position:absolute;top:"+item.y+"px;left:"+deleteLeft+"px;' class='btn_delete' onclick='btnDelete(this)' index="+iconId+">";
		 	 	}
		 	 })
		 	 //html += '<img alt="" src="'+res[0].imgType+'" class="bgImg" style="width:100%;">';
		 	$('#container').html(html+'<img alt="" src="/img/tunnelIcons/bg.png" class="bgImg" style="width:100%;margin-top:'+marginTop+'px;"/>');
	  	},
	  	error:function(res){
	    	console.log(res);
	  	}
	});
}

//删除
function btnDelete(btn){
	$(btn).remove();
	var deleteId = $(btn).attr('index');
	console.log(deleteId);
	$.ajax({
            type:"delete",
            url:"/device/deviceTunnelDelete?id="+deleteId,          
            async:true,
            dataType:'json',
            success:function(res){
        		haveDevice();                 //删除后重新请求
        		var box = $("#mb-save-row");
		        box.addClass("open");
		        box.find('.faIcon').removeClass('fa-times').addClass('fa-check');
		        box.find('.fontCon').html('删除成功！');
		        box.find('.mb-footer').hide();
		        setTimeout(function(){
    		    	box.removeClass("open")
         		},1000);
            },
            error:function(res){
            console.log(res);
            	var box = $("#mb-save-row");
		        box.addClass("open");
		        box.find('.faIcon').removeClass('fa-check').addClass('fa-times');
		        box.find('.fontCon').html('删除失败，请重新操作！');
		        box.find('.mb-footer').show();
		        box.find(".mb-control-yes").on("click",function(){
		             box.removeClass("open");
		        })
            }     
          }); 
}
//在页面加载完之后加载jquery
   //$(document).ready(function(e) {
   function draggable(){
		containerTop = $('#container').offset().top;
       //拖拽复制体
       $('[id^="draggable"]').draggable({
		   helper:"clone",
		   cursor: "move",
		   cursorAt:{top:20,left:20},
		   zIndex:9999
		 });
		 $("#container .imgDiv").draggable({stack:"#container .imgDiv"});
		//释放后
	   $('#container').droppable({
			drop:function(event,ui){
				var source = ui.draggable.clone();
				$('<img/>', {
					src: '/img/icons/btn_delete.png',
					style:'display:none',
					class:'btn_delete',
					click: function() {
					  source.remove();
					}
				}).appendTo(source);
				
				source.mouseenter(function () { 
					$(this).find(".btn_delete").show();
				}); 
				source.mouseleave(function (e){
					$(this).find(".btn_delete").hide();
				}); 
				source.addClass("clone");
				source.css('position','absolute');
				source.css('left',ui.offset.left/scale);
   				source.css('top',(ui.offset.top-containerTop+marginTop)/scale);
   				source.attr('indexTop',(ui.offset.top-containerTop+marginTop)/scale);
   				source.attr('indexLeft',ui.offset.left/scale);
				$(this).append(source);
			}
		});
	}
         function getDeviceCode(){
         	$.ajax({
                type:"get",
                url:"/device/generateDeviceCode",          
                async:true,
                dataType:'json',
                success:function(res){
                	$('.content').val(res);
                },
                error:function(res){
                }     
              });
         }
	    var deviceArr = [];
	    var flag = true;
	    $('#container').off('click','img').on('click','img',function(){　　　　
	    	if(!tunnelName){
	    		var box = $("#mb-save-row");
		         box.addClass("open");
		         box.find('.faIcon').removeClass('fa-check').addClass('fa-times');
		         box.find('.fontCon').html('请先选择隧道名称！');
		         box.find('.mb-footer').show();
		         box.find(".mb-control-yes").on("click",function(){
		           	box.removeClass("open");
		         })
	   			return false;
	    	}
	   		if($(this).attr('class') == 'bgImg'){
	   			return false;
	   		};
	   		deviceTpye($(this).attr('name'),'#deviceClass');
	   		$('#myModal').modal('show');
	   		$('.id').val('');   
	   		$('#container').unbind("mousemove");
   			$('.nav-tabs li').removeClass('active');
	  		$('.nav-tabs li').eq(0).addClass('active');
	  		$('.tab-pane').removeClass('active');
	  		$('.tab-pane').eq(0).addClass('active');
	   		if($(this).attr('conJson') == undefined){
		  		$("input[name='communication']").eq(0).iCheck('check');
		  		$('.setDiv').hide();
			 	$('#myModal #tab-first,#tab-third input').val('');	
			 	$('#myModal #tab-second .setDiv input').val('');	
			 	$('#myModal textarea').val('');
				$('#myModal .selectpicker').selectpicker('deselectAll');
				$('#myModal .selectpicker').selectpicker('refresh'); 
		   		$(".top").val($(this).parent().attr('indexTop'));
		   		$(".left").val($(this).parent().attr('indexLeft'));
		   		$(".name").val($(this).attr('index'));
		   		getDeviceCode();
	   		}else{
	   			 var con = JSON.parse($(this).attr('conJson'));
	   			 
	   			 if(flag){
		   			 $(".left").val(con.x);
		   			 $(".top").val(con.y);
	   			 }
		   		 $(".name").val(con.imgContent);
		   		 $('.content').val((con.device).devicecode);                    //设备编号         
		         var deviceClass = (con.device).deviceTypeName;                //设备类型
         	     var deviceClassVal = $("#deviceClass option:contains('"+deviceClass+"')").val();
 	    		 $('#deviceClass').selectpicker('val',deviceClassVal);
 	    		 var site = (con.device).position;                   //所在位置（上行，下行）
 	    		 $('#site').selectpicker('val',site);
		         var status = (con.device).status;
 	    		 $('#currentStatus').selectpicker('val',status);        //当前状态   
		         var mapPosition = (con.device).mapPosition;         //设备位置（左侧右洞）
		         $('.mapPosition').selectpicker('val',mapPosition);
		         var areacode = (con.device).areacode;                //所在区域
 	    		 $('#area').selectpicker('val',areacode);
		         $('.acquisitionCycle').val((con.device).cycle);               //采集周期
		         var communicate = (con.device).commtype;
		         $("input[name='communication']").eq(communicate).iCheck('check');//通讯方式
		         
		         if(communicate == '7'){
			     	$('#tab-second .setDiv').eq(communicate-1).find('.devconfig').val(con.devconfig);
		     	 }else{
		     		if((con.device).devconfig){
			     		cmsSetting((con.device).devconfig);
			     		$('.width').val(itemCmsJson.w);
			     		$('.height').val(itemCmsJson.h);
			     		$('.stayTime').val(itemCmsJson.t);
			     		$('.fontFamily').val(itemCmsJson.f);
			     		$('.fontSize').val(itemCmsJson.e);
			     		$('.fontColor').val(itemCmsJson.c);
			     		$('.enterEffects').val((itemCmsJson.s).split(",")[0]);
			     		$('.outEffects').val((itemCmsJson.s).split(",")[1]);
		     		}else{
		     			$('#myModal #tab-third input').val('');	
						$('#myModal .selectpicker').selectpicker('deselectAll');
						$('#myModal .selectpicker').selectpicker('refresh'); 
		     		}
		     	}
		         $('#tab-second .setDiv input').val('');
     			 $('#tab-second .selectpicker').selectpicker('deselectAll');
		         $('#tab-second .setDiv').eq(communicate-1).find('.flag1').val((con.device).flag1);
		     	 $('#tab-second .setDiv').eq(communicate-1).find('.flag2').val((con.device).flag2);
		     	 $('#tab-second .setDiv').eq(communicate-1).find('.flag3').val((con.device).flag3);
		     	 $('#tab-second .setDiv').eq(communicate-1).find('.flag4').val((con.device).flag4);
		     	 $('#tab-second .setDiv').eq(communicate-1).find('.flag5').val((con.device).flag5);
		         $('.modalRemark').val((con.device).comment);    
		         $('.id').val(con.id);   
		         console.log((con.device).milimeter);
		         $('.milimeter').val((con.device).milimeter);    
		         $('.meter').val((con.device).meter);    
		         var isSystem = ((con.device).deviceSystem).systemName;
		         var isSystemVal = $("#isSystem option:contains('"+isSystem+"')").val();
 	    		 $('.isSystem').selectpicker('val',isSystemVal); 
 	    		 $('.selectpicker').selectpicker('refresh');
	   		}
	   		return false;
	    })
	    
	    function deviceTpye(Typename,div){
			$.ajax({
		      type:"get",
		      url:'/device/deviceTypeDataList',
		      async:false,
		      dataType:'json',
		      data:{
		      	'Typename':Typename
		      },
		      success:function(res){
		      	console.log(res);
		            var options = '';
		            $.each(res,function(index,item){
		              options+='<option value="'+item.id+'">'+item.typeName+'</option>'                 
		            });
		            $(div).html('<option value=" ">请选择</option>' + options); 
		            $('.selectpicker').selectpicker('refresh');
		      },
		      error:function(res){
		        console.log(res);
		      }
		  });
		}
	    
    //$(document).ready(function(){
	   $('.saveBtn').click(function(){
	   		 var top = $(".top").val();
	   		 var left = $(".left").val();
	   		 var name = $(".name").val();
	   		 var bgName = $(".bgImg").attr('src');
	   		 var devicecode = $('.content').val();                    //设备编号         
	         var deviceClass = $('#deviceClass').val();               //设备类型
	         var currentStatus = $('.currentStatus').val();           //当前状态   
	         var position = $('#site').val();                         //所在位置
	         var areacode = $('.area').val();                         //所在区域
	         var cycle  = $('.acquisitionCycle').val();              //采集周期
	         var commtype = $('.communicate').val();                 //通讯方式
	         var comment = $('.modalRemark').val();    
	         var id = $('.id').val();    
	         var isSystem = $('#isSystem').val(); 
	         var mapPosition = $('#mapPosition').val();
	         var milimeter = $('.milimeter').val();  
     		 var meter = $('.meter').val();  
	         var flag1 = $('#tab-second .setDiv').eq(setDivIndex).find('.flag1').val();
		     var flag2 = $('#tab-second .setDiv').eq(setDivIndex).find('.flag2').val();
		     var flag3 = $('#tab-second .setDiv').eq(setDivIndex).find('.flag3').val();
		     var flag4 = $('#tab-second .setDiv').eq(setDivIndex).find('.flag4').val();
		     var flag5 = $('#tab-second .setDiv').eq(setDivIndex).find('.flag5').val();
		     var protocol = $('#tab-second .setDiv').eq(setDivIndex).find('.protocol').val(); //协议
		     
		     var devconfig = ''; 
		     if(commType == '7'){  //OPC客户端参数配置
		     	devconfig = $('#tab-second .setDiv').eq(setDivIndex).find('.devconfig').val();
		     }else{
		     	//情报板含义：w 宽 h 高 t:停留时间  f:字体 s:特效 c：字体颜色 e：字体大小
		     	devconfig = 'w:'+$('.width').val()+';h:'+$('.height').val()+';t:'+$('.stayTime').val()
		     	+';f:'+$('#fontFamily').val()+';s:'+$('#enterEffects').val()+','+$('#outEffects').val()
		     	+';c:'+$('#fontColor').val()+';e:'+$('#fontSize').val()+';'
		     }
		     
		     //var devconfig = $('#tab-second .setDiv').eq(setDivIndex).find('.devconfig').val(); //OPC客户端参数配置
		     flag1 = (flag1 == undefined?'':flag1);
		     flag2 = (flag2 == undefined?'':flag2);
		     flag3 = (flag3 == undefined?'':flag3);
		     flag4 = (flag4 == undefined?'':flag4);
		     flag5 = (flag5 == undefined?'':flag5);
		     protocol = (protocol == undefined?'':protocol);
		     
		     devconfig = (devconfig == undefined?'':devconfig);
		     console.log(left);
		     console.log(position);
	    	  $.ajax({
	    	      type:"post",
	    	      url:"/device/deviceAdd1",
	    	       data:{
	    	       	   'id':id,
	    	       	   'mapNo':'1',
	    	       	   'mapNum':$('#getTunnel').val(),
	    	    	   'devicecode':devicecode,
	    	    	   'deviceTypeId':deviceClass,
	    	    	   'status':currentStatus,
	    	    	   'position':position,
	    	    	   'areacode':areacode,
	    	    	   'cycle':cycle,
	    	    	   'commtype':commType,
	    	    	   'comment':comment,
	    	    	   'x':left,
	    	    	   'y':top,
	    	    	   'imgContent':name,
	    	    	   'bgImg':bgName,
	    	    	   'deviceSystemId':isSystem,
	    	    	   'mapPosition':mapPosition,
	    	    	   'isTunnelDevice':'0',
	    	    	   'flag1':flag1,
			    	   'flag2':flag2,
			    	   'flag3':flag3,
			    	   'flag4':flag4,
			    	   'flag5':flag5,
			    	   'protocol':protocol,
			    	   'devconfig':devconfig,
			    	   'meter':meter,
	    	   		   'milimeter':milimeter
	    	       },
	    	      async:true,
	    	      dataType:'json',
	    	      success:function(res){
	    	      		haveDevice();
	    	      		flag = true;
	    	    	  	var box = $("#mb-save-row");
				         box.addClass("open");
				         box.find('.faIcon').removeClass('fa-times').addClass('fa-check');
				         box.find('.fontCon').html('保存成功！');
				         box.find('.mb-footer').hide();
				         setTimeout(function(){
					          box.removeClass("open")
					     },1000);
	    	      },
	    	      error:function(res){
	    	         var box = $("#mb-save-row");
			         box.addClass("open");
			         box.find('.faIcon').removeClass('fa-check').addClass('fa-times');
			         box.find('.fontCon').html('保存失败，请重新操作！');
			         box.find('.mb-footer').show();
			         box.find(".mb-control-yes").on("click",function(){
			           	box.removeClass("open");
			         })
			       }
    	    });   
	   })
     //})
 

 function mousedown(btn){
 	/* 获取需要拖动节点的坐标 */
    var offset_x = $(btn)[0].offsetLeft;//x坐标
    var offset_y = $(btn)[0].offsetTop;//y坐标
    /* 获取当前鼠标的坐标 */
    var mouse_x = event.pageX;
    var mouse_y = event.pageY;
    /* 绑定拖动事件 */
    /* 由于拖动时，可能鼠标会移出元素，所以应该使用全局（document）元素 */
    $('#container').on("mousemove",function(ev){
    	flag = false;
     // $(btn).next().hide();
      /* 计算鼠标移动了的位置 */
      var _x = ev.pageX - mouse_x;
      var _y = ev.pageY - mouse_y;
      /* 设置移动后的元素坐标 */
      var now_x = (offset_x + _x ) + "px";
      console.log(now_x);
      var nowDelete_x = (offset_x + _x ) -16 + "px";
      var now_y = (offset_y + _y ) + "px";
      console.log(now_y);
      $(".top").val(offset_y + _y);
	  $(".left").val(offset_x + _x);
	  console.log($(".top").val());
	  console.log($(".left").val());
      /* 改变目标元素的位置 */
      $(btn).css({
        top:now_y,
        left:now_x
      });
      $(btn).next().css({
        top:now_y,
        left:nowDelete_x
      });
    });
 }
function mouseup(btn){
	$('#container').bind("mouseup",function(){
        $(this).unbind("mousemove");
      });
}
