getDevicePosition('#site1');
checkAll("#checkAll","input[name='id[]']");
//选择发布信息的情报板
var sendIdArr = []; 
var cmsSizeArr = [];                             
$('.sendMessageFromTunnel').click(function(){
	  $("input[name='id[]']:checked").each(function() { 
		  sendIdArr.push($(this).val());      
		  cmsSizeArr.push($(this).attr('cmsSize'));      
	  });
	  localStorage.setItem('cmsSize',cmsSizeArr);
	  sendMessage1(sendIdArr,cmsSizeArr);
}); 
$('.sendMessageAndAdd').click(function(){
	  $("input[name='id[]']:checked").each(function() { 
		  sendIdArr.push($(this).val());      
		  cmsSizeArr.push($(this).attr('cmsSize'));      
	  });
	  localStorage.setItem('cmsSize',cmsSizeArr);
	  sendMessage(sendIdArr,$('#formSubmitAdd'));
}); 
function sendMessage1(sendId,cmsSize){
	//找出所选的情报板的尺寸相同的个数与所选择的情报板的个数进行比较，若相同说明所选的情报板类型都是相同的
	 var num = 1;//用于保存相同的个数
	 for(var i = 0; i < cmsSize.length;i++){
	     if(cmsSize[i]==cmsSize[i+1]){
	         num+=1;                    
	     }
	 }
	  if(sendId.length != 0){
		  if(cmsSize.length == num){
				  $('.sendIds').val(sendId);
				  $('#formSubmit').submit();
				  $("input[name='id1[]']").prop('checked',false);
		 }else{
			  var box = $("#mb-remove-row");
		      box.addClass("open");
		      box.find('.alertFont').text('请选择相同尺寸的情报板！');
		      box.find(".mb-control-yes").off("click").on("click",function(){
		    	  box.removeClass("open");
		    	  sendIdArr = []; 
				  cmsSizeArr = [];
		      });
		 }
	  }else{
		  var box = $("#mb-remove-row");
	      box.addClass("open");
	      box.find('.alertFont').text('请选择情报板！');
	      box.find(".mb-control-yes").off("click").on("click",function(){
	    	  box.removeClass("open");
	      });
	  }
 };
function sendMessage(sendId,formObj){
	  if(sendId.length < 1){
		  var box = $("#mb-remove-row");
	      box.addClass("open");
	      box.find('.alertFont').text('请选择情报板！');
	      box.find(".mb-control-yes").off("click").on("click",function(){
	    	  box.removeClass("open");
	      });
      }else{
      	  $('.sendIds').val(sendId);
		  formObj.submit();
		  $("input[name='id1[]']").prop('checked',false);
      }
 };
    //情报板尺寸
   boardSizeType('#boardSizeSearch');
   // 选择查询
   var widthHeight = $('#boardSizeSearch option:selected').text();
    $('.search').bind('click',function(){
      widthHeight = $('#boardSizeSearch option:selected').text();
      $("input[name='id1[]']").prop('checked',false);
      var postion = $('#site1').val();
      informationBase(1,widthHeight,postion);  
    }) 
	var nowNum;
	informationBase(1,widthHeight,'');
	function informationBase(num,widthHeight,position) {
	      if(widthHeight == '请选择'){
	      	widthHeight = '';
	      }
		ShowLoading();
		nowNum = num;
		$.ajax({
			url: "/device/searchByDeviceTypeAndWith",
			type: "get",
			dataType: "json",
			data:{
				//'page':num-1,
//	            'size':13,
	            'deviceType':'情报板',
	            'widthHeight':widthHeight,
	            'position':position
			},
			success: function(data) {
			   HiddenLoading();	
              // var val = data.content;
               var tabelPage = '';
               $.each(data,function(index,item){    
	              var conJson = JSON.stringify(item);
	              var cmsSize,width,height;
        		  if(item.devconfig){
			 		 cmsSetting(item.devconfig);
			 		 width = itemCmsJson.w;
			 		 height = itemCmsJson.h;
			 		 cmsSize = width+'*'+height;
			 	  }
             	  tabelPage+="<tr><td style='text-align:left;'><input type='checkbox' name='id[]' value='"
             		  +item.id+"' class='self-input' id='"
              		  +item.devicecode+"' conJson='"+conJson+"' cmsSize='"+cmsSize+"'/><span class='self-id'>"
             		  +(index+1)+"</span></td><td><a href='' class='devicecode' data-target='#myModal' data-toggle='modal' conJson='"+conJson+"'>"
                      +item.devicecode+"</a></td><td style='text-align:left;'>"
                      +item.comment+"</td><td>"
                      +cmsSize+"</td><td>"
                      +item.position+"</td><td>"
                      +(item.milimeter==null?'':'K'+item.milimeter+'+'+item.meter)+"</td><td>"
                      +item.commdata+"</td></tr>";  
               });
	            $('.selfTbody').html(tabelPage);
	            
	            modalFun();
				//分页
				//$("#page").paging({
//					pageNo: num,
//					totalPage: data.totalPages,
//					totalSize: data.totalElements,
//					callback: function(num) {
//						informationBase(num,widthHeight);
//					}
//				})
			},
			error:function(data) {
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
var nowDeviceCode = null;
function modalFun(){
	$('.devicecode').click(function(){
		$('#preview1').html('正在读取');
		$('#preview1').css("color",'#ddd');
		$('#preview1').css("font-family",'');
		$('#preview1').css("font-size",'');
		var conObj = JSON.parse($(this).attr('conJson'));
 		$('.deviceCode').val(conObj.devicecode);    
 		nowDeviceCode = conObj.devicecode;
 		$('.managementOrganization').val(conObj.devicecode);          
 		$('.position').val(conObj.position);          
 		$('.deviceType').val(conObj.deviceTypes);         
 		$('.deiveName').val(conObj.comment);   
 		$('.belongsHighway').val(conObj.areacodeStr);             
 		$('.stakeMark').val('K'+conObj.milimeter+'+'+conObj.meter);               
 		$('.cmsType').val(conObj.deviceTypeName);          
		if(conObj.devconfig){
			cmsSetting(conObj.devconfig);
	 		$('.width').val(itemCmsJson.w);        
	 		$('.height').val(itemCmsJson.h);          
	 		$('#preview1').attr('class',conObj.devicecode);
	 		$("#previewBar1").css("width",itemCmsJson.w+'px');
	        $("#previewBar1").css("height",itemCmsJson.h+'px');
	        getCms();
		}else{
			$('.width').val('');        
	 		$('.height').val('');          
	 		$('#preview1').removeAttr('class');
	 		$("#previewBar1").css("width",'');
	        $("#previewBar1").css("height",'');
	        $("#preview1").css("line-height",''); 
		}
	})
}
function getCms(){
	var sock = new SockJS("/endpointChat");
	var stomp = Stomp.over(sock);
	stomp.connect('guest', 'guest', function(frame){
	    stomp.subscribe("/queue/cmsText", informationBoardPublish);
	});
	function informationBoardPublish(message){
		var messsgeStr = eval('('+ message.body+')');
		$.each(messsgeStr,function(index,item){
			cmsStatus(item.brokenDevice);
			if(item.deviceCode == nowDeviceCode){
				variantValue = item.variantValue;
				var variantNO = item.variantNO;
				Explain(variantValue,variantNO);
			}
		})
		
	}
}
function Explain(variantValue,variantNO){
	variantValue = JSON.parse(variantValue);
	if(variantNO == 1){
		var thisBorad = document.getElementById('preview1');
		var myCountent = "";
		var myFontFamily = "";
		var myFontSize = "";
		var myFontcolor = "";
		var myCountentArr = [];
		for(var i = 0; i < variantValue.length;i++){
		    myCountentArr.push(variantValue[i].content);
		    myCountent = myCountentArr.join('<br />');
			myFontFamily = switchFont(parseInt(variantValue[0].font));
		    myFontcolor = switchColorCss(parseInt(variantValue[0].fontcolor));
		    myFontSize = switchFontSize(parseInt(variantValue[0].fontsize));
		}
		thisBorad.innerHTML = myCountent;
		thisBorad.style.fontFamily = myFontFamily;
		thisBorad.style.fontSize = myFontSize + 'px';
		thisBorad.style.lineHeight = myFontSize + 'px';
		thisBorad.style.color = myFontcolor;
	}
}	
function cmsStatus(statusArr){
	 $.each(statusArr,function(index,item){
	 	if(item == nowDeviceCode){
			$('#preview1').html('通讯故障');
		}
	})
}