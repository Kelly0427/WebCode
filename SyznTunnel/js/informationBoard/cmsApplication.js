var addOrEdit = true;
var addOrEditApplicaion = true;
//时间选择器---年月日
$('.applicationTime').datetimepicker({
	language:  'zh',
    format: 'yyyy-mm-dd hh:ii',
    todayBtn:  1,
    autoclose: 1,
    todayHighlight: 1,
    clearBtn:true
});
//开始时间大于结束时间
//开始时间的插件
$("#startTime").datetimepicker({
     language:  'zh',
     format: 'yyyy-mm-dd hh:ii',
     todayBtn:  1,
     autoclose: 1,
     todayHighlight: 1,
     clearBtn:true
}).on('changeDate',function(ev){
var starttime=$("#startTime").val();
$("#endTime").datetimepicker('setStartDate',starttime);
     $("#startTime").datetimepicker('hide');
});

//结束时间的插件 
$("#endTime").datetimepicker({
     language:  'zh',
     format: 'yyyy-mm-dd hh:ii',
     todayBtn:  1,
     autoclose: 1,
     todayHighlight: 1,
     clearBtn:true
}).on('changeDate',function(ev){
     var starttime=$("#startTime").val();
     var endtime=$("#endTime").val();
     $("#startTime").datetimepicker('setEndDate',endtime);
     $("#endTime").datetimepicker('hide'); 
});
//添加组	
/*$('.addBtn').click(function(){
	cloneTr();
})*/
function cloneTr(){
	$('.applicationTable').append($('.cloneTr').clone(true).show().removeClass('cloneTr'));
}
//添加位置和内容
var trIndex;	
$('.addBtnOne').click(function(){
	addOrEdit = true;
	conjsonArr = []; 
	cmsSizeArr = [];
	deviceCodeArr = [];
	deviceSiteArr = [];
	deviceCodesStr = '';
	//trIndex = $(this).parent().parent().index();
//	$('.firstPart').addClass('toggleThis');
//	$('.secondPart').removeClass('toggleThis');
//	$('.thirdPart').addClass('toggleThis');
	cmsSite(this);
})
function cmsSite(btn){
	trIndex = $(btn).parent().parent().index();
	$('.firstPart').addClass('toggleThis');
	$('.secondPart').removeClass('toggleThis');
	$('.thirdPart').addClass('toggleThis');
}
//选择发布信息的情报板
var conjsonArr = []; 
var cmsSizeArr = [];
var deviceCodeArr = [];
var allCmsVal,kv;
$('.sendMessageAndAdd').click(function(){
	$("input[name='id[]']:checked").each(function(){ 
		console.log(JSON.parse($(this).attr('conjson')));
	    conjsonArr.push(JSON.parse($(this).attr('conjson')));  
	    deviceCodeArr.push(JSON.parse($(this).attr('conjson')).devicecode);
	    cmsSizeArr.push($(this).attr('cmsSize'));        
  	});
	existLevelDevices(deviceCodeArr);
  	if(conjsonArr.length < 1){
	      var box = $("#box");
       	  box.addClass("open");
          box.find('.faIcon').removeClass('fa-check').addClass('fa-times');
          box.find('.fontCon').html('请选择情报板！');
          box.find('.mb-footer').show();
          box.find(".mb-control-yes").on("click",function(){
            box.removeClass("open");
          })
	}else{
		$('.firstPart').addClass('toggleThis');
		$('.secondPart').addClass('toggleThis');
		$('.thirdPart').removeClass('toggleThis');
		$("input[name='id1[]']").prop('checked',false);
	    deviceList(conjsonArr);
		//key值相同的，value合并，情报板尺寸相同的，deviceCode合并
	    var s = 'jsondata='+deviceCodesStr;
		kv = {};
		var m, reg = /"([^"]+)":"([^"]+)"/g;
		while (m = reg.exec(s)) { kv[m[1]] ? kv[m[1]] = (typeof kv[m[1]] == 'string' ? [kv[m[1]]] : kv[m[1]]).concat([m[2]]) : kv[m[1]] = m[2] }
		//var cmsSizeArr = localStorage.getItem('cmsSize').split(',');
		allCmsVal = unique(cmsSizeArr);
		console.log("====================11");
		console.log(allCmsVal);
		console.log("====================11");
		//情报板尺寸
		$('#boardSize').val(allCmsVal);
		console.log(constrObjForEditCmsCon);
		//if(constrObjForEditCmsCon){
//			cmsConEdit(constrObjForEditCmsCon,allCmsVal,constrArrForEditCmsCon);
//		}
	}
	
})
var deviceCodesStr = '';
var deviceSiteArr = [];
function deviceList(obj){
    var orderBoardSizeOptions = '';
    $.each(obj,function(index,item){
    	console.log(item.comment);
    	deviceSiteArr.push(item.comment);
    	orderBoardSizeOptions+='<option value="'+item.devicecode+'">'+item.comment+'</option>';
    	var cmsSize,width,height;
		if(item.devconfig){
	 		 cmsSetting(item.devconfig);
	 		 width = itemCmsJson.w;
	 		 height = itemCmsJson.h;
	 		 cmsSize = width+'*'+height;
	 	}
    	deviceCodesStr += '"a'+cmsSize+ '":"' + item.devicecode + '",';                
    });
    $('#orderBoardSize').html(orderBoardSizeOptions); 
    $('.selectpicker').selectpicker('refresh');
}
	
function unique(arr){
　　var res =[];
　　var json = {};
　　for(var i=0;i<arr.length;i++){
　　　　if(!json[arr[i]]){
　　　　　　res.push(arr[i]);
　　　　　　json[arr[i]] = 1;
　　　　}
　　}
　　return res;
}

$('.backSecond').click(function(){
		console.log(isSave);
		console.log($('.editPart1').html() != '');
		console.log(isSave == false && $('.editPart1').html() != '');
	if(!isSave && $('.editPart1').html() != ''){
		var box = $("#box1");
        box.addClass("open");
        box.find('.faIcon1').removeClass('fa-check').addClass('fa-times');
        box.find('.fontCon1').html('您编辑的内容尚未保存，返回内容将丢失，是否继续？');
        box.find('.mb-footer1').show();
        box.find(".mb-control-yes").on("click",function(){
            box.removeClass("open");
            conArr = [];
			$("input[name='id1[]']").prop('checked',false);
			$("input[name='id[]']").prop('checked',false);
			conjsonArr = []; 
			cmsSizeArr = [];
			deviceCodeArr = [];
			deviceSiteArr = [];
			deviceCodesStr = '';
			clearEditPart();
			defaultFont();
			$('.firstPart').addClass('toggleThis');
			$('.secondPart').removeClass('toggleThis');
			$('.thirdPart').addClass('toggleThis');
        })
        box.find(".mb-control-yes").on("click",function(){
            box.removeClass("open");
	        return false;
        })
	}else{
		  conArr = [];
		  $("input[name='id1[]']").prop('checked',false);
		  $("input[name='id[]']").prop('checked',false);
		  conjsonArr = []; 
		  cmsSizeArr = [];
		  deviceCodeArr = [];
		  deviceSiteArr = [];
		  deviceCodesStr = '';
		  clearEditPart();
		  defaultFont();
		  $('.firstPart').addClass('toggleThis');
		  $('.secondPart').removeClass('toggleThis');
		  $('.thirdPart').addClass('toggleThis');
	}
})
$('.backFirst').click(function(){
	conArr = [];
	conjsonArr = []; 
    cmsSizeArr = [];
    deviceCodeArr = [];
    deviceSiteArr = [];
    deviceCodesStr = '';
    $("input[name='id1[]']").prop('checked',false);
	$("input[name='id[]']").prop('checked',false);
	$('.firstPart').removeClass('toggleThis');
	$('.secondPart').addClass('toggleThis');
	$('.thirdPart').addClass('toggleThis');
})
//third保存
//var savePulishJson = [];
var savePulishJson = '';
var conArr = [];
var isSave = false;
$('.nextSite').click(function(){
	if($('.fa-exclamation-circle').length > 0){
		var box = $("#box");
        box.addClass("open");
        box.find('.faIcon').removeClass('fa-check').addClass('fa-times');
        box.find('.fontCon').html('有超出情报板的内容，请修改或删除！');
        box.find('.mb-footer').show();
        box.find(".mb-control-yes").on("click",function(){
          box.removeClass("open");
        })
	}else{
		isSave = true;
		conArr.push($('.content').val());
		$("input[name='id1[]']").prop('checked',false);
		$("input[name='id[]']").prop('checked',false);
		conjsonArr = []; 
		cmsSizeArr = [];
//		for(var i = 0;i<$('.finishedMessage').find('.cmsAttr').length;i++){
//			savePulishJson.push(JSON.parse($('.finishedMessage').find('.cmsAttr').eq(i).html()));
//		}
		for(var i = 0;i<$('.finishedMessage').find('.cmsAttr').length;i++){
			savePulishJson += $('.finishedMessage').find('.cmsAttr').eq(i).html()+',';
		}
		savePulishJson = savePulishJson.substring(0,savePulishJson.length-1)
		//if(addOrEdit){
//			$('.applicationTable .selectBtn').eq(trIndex-3).text(deviceSiteArr);
//		}else{
//		}
		$('.applicationTable .selectBtn').eq(trIndex-3).text(deviceSiteArr);
		$('.applicationTable .deviceCodeCopy').eq(trIndex-3).val(deviceCodeArr);
		$('.applicationTable .releaseConTd').eq(trIndex-3).html(unique(conArr)+"<button class='btn btn-default btn-rounded btn-sm pull-right' style='margin-left:10px;padding:2px 2px 0px 6px;' title='删除' onclick='deleteRow(this)'><span class='fa fa-times'></span></button><button class='btn btn-default btn-rounded btn-sm editThisCon pull-right' deviceCodeArr='"+deviceCodeArr+"' constr='"+savePulishJson+"' onclick='editThisCon(this)' title='修改'><span class='fa fa-edit'></span></button>");
		conArr = [];
		deviceSiteArr = [];
		deviceCodeArr = [];
		savePulishJson = '';
		deviceCodesStr = '';
		clearEditPart();
		defaultFont();
		$('.firstPart').removeClass('toggleThis');
		$('.secondPart').addClass('toggleThis');
		$('.thirdPart').addClass('toggleThis');
		if(addOrEdit){
			cloneTr();
			trIndex++;
		}
	}
})
	//申请单检查
	//$(".applicationNumber").blur(function(){
//		existLevelDevices('');
//	})
	//申请表编号自动生成
	applicationCodeFun();
	function applicationCodeFun(){
		$.ajax({
			url: "/informationBoard/generateApplicationCode",
			type: "get",
	//		dataType: "json",
			async:false,
			success: function(data) {
				$(".applicationNumber").val(data);
			},
			error:function(data){
				console.log(data);
			}
      	});
	}
	$('.applicationTable').bind('propertychange','.releasePosition',function(){
		existLevelDevices();
	})
	function existLevelDevices(deviceCodes){
		//var deviceCodes = [];
//		for (var i = 0; i < parseInt($('.applicationTable .releaseCon').length); i++) {
//			var cmsSiteOne= $('.applicationTable .releaseCon').eq(i).parent().find('.releasePosition').val();
//			deviceCodes.push(cmsSiteOne);
//		}
		console.log($('.applicationNumber').val());
		console.log(deviceCodes);
		console.log(parseInt($('.releasePriority').val()));
		if($('.applicationNumber').val() != '' || deviceCodes.length > 0){
			$.ajax({
				url: "/lzinformationBoard/existLevelDevices",
				type: "get",
				dataType: "json",
				async:false,
				data:{
					'applicationCode':$('.applicationNumber').val(),
		            'deviceCodes[]':deviceCodes,
		            'groupOrder':parseInt($('.releasePriority').val())
				},
				success: function(data) {
					console.log(data);
					var result="";
					if(data.isExistSameLevelDevice!=null){
						if(data.isExistSameLevelDevice.length > 0){
							result += '<h2 style="margin-bottom:0px;color:#fff;margin-top:4px">情报板将发生信息冲突，详情如下（设备，申请表编号）：</h2><p style="margin-top:10px;line-height:24px;">';
							$.each(data.isExistSameLevelDevice,function(index,item){
								var item = item.replace(/;/g,'；');
								item = item.replace(/,/g,'，');
								result += item;
							})
							result += '</p>';
							var box = $("#box2");
					        box.addClass("open");
					        box.find('.faIcon').removeClass('fa-check').addClass('fa-times');
					        box.find('.fontCon').html(result);
					        box.find('.fontCon').css('font-size','14px');
					        box.find(".mb-control-close").off("click").on("click",function(){
					             box.removeClass("open");
					             $('.firstPart').addClass('toggleThis');
								 $('.secondPart').removeClass('toggleThis');
								 $('.thirdPart').addClass('toggleThis');
								 $("input[name='id1[]']").prop('checked',false);
								 $("input[name='id[]']").prop('checked',false);
								 conjsonArr = []; 
								 cmsSizeArr = [];
								 deviceCodeArr = [];
					        })
					        box.find(".mb-control-yes").off("click").on("click",function(){
					             box.removeClass("open");
					        })
						}
						//if(data.isExistApplicationCode!=undefined){
//							result = data.isExistApplicationCode;
//							$('.applicationNumber').val('');
//							var box = $("#box");
//					        box.addClass("open");
//					        box.find('.faIcon').removeClass('fa-check').addClass('fa-times');
//					        box.find('.fontCon').html(result);
//					        box.find('.fontCon').css('font-size','26px');
//					        box.find(".mb-control-yes").off("click").on("click",function(){
//					             box.removeClass("open");
//					        })
//						}
						
					}
				},
				error:function(data){
					console.log(data);
				}
	      	});
		}
	}
	//申请单提示
    remindIsObsolete();
	function remindIsObsolete(){
		$.ajax({
			url: "/lzinformationBoard/remindIsObsolete",
			type: "get",
			dataType: "json",
			success: function(data) {
				localStorage.setItem('formCmsApplicationData',JSON.stringify(data));
				if(data!=null && data.length>0){
					var box = $("#cmsApplicationList");
			        box.addClass("open");
			        box.find('.faIcon').removeClass('fa-check').addClass('fa-times');
			        box.find('.fontCon').html('存在即将过期的申请表，请处理！');
			        box.find('.mb-footer').show();
			        box.find(".mb-control-yes").on("click",function(){
			        	box.removeClass("open");
			        })
				}
			},
			error:function(data){
				console.log(data);
			}
      	});
		
	}
	//保存申请单
	$('.saveThis').click(function(){
		saveApplication("/lzinformationBoard/cmsGroupAdd","保存成功！");
	})
	//保存并发布
	$('.saveThisAndPublish').click(function(){
		saveApplication('/lzinformationBoard/cmsGroupAddAndSend',"下发信息成功！");
	})
	function saveApplication(url,fontCon){
		var id = $('.applicationId').val();
		var applicationCode = $('.applicationNumber').val();
		var applicationUnit = $('.applicationUnit').val();
		var applicant = $('.applicationPerson').val();
		var applicationTime = $('.applicationTime').val();
		var startTime = Date.parse($('.startTime').val());
		var endTime = Date.parse($('.endTime').val());
		var applicantReason = $('.releaseReason').val();
		var groupOrder = $('.releasePriority').val();
		var parameter = {'applicationCode':applicationCode,'applicationUnit':applicationUnit,'applicant':applicant,'applicationTime':applicationTime,'startTime':startTime,'endTime':endTime,'applicantReason':applicantReason,'groupOrder':groupOrder};
//		var parameter = {applicationCode,applicationUnit,applicant,applicationTime,startTime,endTime,applicantReason,groupOrder};
//		var saveCmsCon = [];
		var saveCmsConStr = '';
		for(var i = 0;i<$('.applicationTable').find('.editThisCon').length;i++){
			console.log($('.applicationTable').find('.editThisCon').eq(i).attr('constr'));
			saveCmsConStr += $('.applicationTable').find('.editThisCon').eq(i).attr('constr');
//			var saveCmsConStr = JSON.parse('['+$('.applicationTable').find('.editThisCon').eq(i).attr('constr')+']');
			console.log(saveCmsConStr);
			//saveCmsCon.push(saveCmsConStr);
		}
		saveCmsConStr = '['+saveCmsConStr+']';
			console.log(typeof(saveCmsConStr));
		var callBackDisplay = [];
		for(var i = 1; i < $('.selectBtn').length-1;i++){
			console.log($('.selectBtn').eq(i).text());
			callBackDisplay.push($('.selectBtn').eq(i).text().replace(/,/g,'；')+'///'+$('.releaseConTd').eq(i).text().replace(/,/g,'；')+'///'+$('.deviceCodeCopy').eq(i).val().replace(/,/g,'；')+'///'+$('.applicationTable').find('.editThisCon').eq(i-1).attr('constr').replace(/,/g,'；'));
		}
//		var callBackDisplay = [];
//		for(var i = 1; i < $('.selectBtn').length-1;i++){
//			console.log($('.selectBtn').eq(i).text());
//			callBackDisplay.push($('.selectBtn').eq(i).text().replace(/,/g,'；')+'///'+$('.releaseConTd').eq(i).text().replace(/,/g,'；')+'///'+$('.deviceCodeCopy').eq(i).val().replace(/,/g,'；'));
//		}
		//console.log(JSON.stringify(savePulishJson));
		console.log('===========================');
		console.log(saveCmsConStr);
		console.log(callBackDisplay);
		console.log('===========================');
		$.ajax({
			url: url,
			type: "post",
			dataType: "json",
			data:{
				'id':id,
				//'cmsGroupparameter':JSON.stringify(savePulishJson),
				//'parameter':JSON.stringify(savePulishJson),
				'parameter':saveCmsConStr,
	            'cmsGroup':JSON.stringify(parameter),
	            'callBackDisplay':callBackDisplay
			},
			success: function(data) {
				var box = $("#box");
		        box.addClass("open");
		        box.find('.faIcon').addClass('fa-check').removeClass('fa-times');
		        box.find('.fontCon').text(fontCon);
		        box.find('.mb-footer').hide();
		        setTimeout(function(){
	          		box.removeClass("open")
	          		window.location.reload();
	    		},1000);
			},
			error:function(data){
				var box = $("#box");
		        box.addClass("open");
		        box.find('.faIcon').removeClass('fa-check').addClass('fa-times');
		        box.find('.fontCon').html('操作失败，请重新操作！');
		        box.find('.mb-footer').show();
		        box.find(".mb-control-yes").on("click",function(){
		          box.removeClass("open");
		        })
			}
      	});
     }
	
	
	//坐标对象
	function CalculatingCoordinatePo(postX,postY,wordSpace){
		this.postX = postX;
		this.postY = postY;
		this.wordSpace = wordSpace;
	} 
	//计算坐标
	function CalculatingCoordinate(contentStr,width,height,fontsize,fontalign){
		var calculatingCoordinateArray = new Array();
		var nrArray = contentStr.replace(/\n/g,"<br />").split('<br />');	//内容
		var lineCount = nrArray.length;	//行数
		var contentLength = 0;
		for(var line = 0; line < nrArray.length; line++){
			var fPostX = 0;
			var fPostY = 0;
			var wordSpace = 0;
			//下发内容
			var content = nrArray[line];
			contentLength = getStrASCIILength(nrArray[line]);
			//坐标
			//Y坐标
			//Y坐标为横向居中显示
			//计算文字Y坐标
			fPostY = (height - lineCount*fontsize)/2 + line*fontsize;
			
			//X坐标
			//居左
			if(fontalign == 1)
			{
				fPostX = 0; 
			}
			//居右
			else if(fontalign == 2)
			{
				fPostX = width - fontsize/2*contentLength;
			}
			//居中
			else if(fontalign ==0)
			{
				fPostX = (width - fontsize/2*contentLength)/2;
			}
			var calculatingCoordinatePoObj = new CalculatingCoordinatePo(fPostX,fPostY,wordSpace);
			calculatingCoordinateArray[line] = calculatingCoordinatePoObj;
		}
		return calculatingCoordinateArray;
	}
function unique(arr){
  　　var res =[];
  　　var json = {};
  　　for(var i=0;i<arr.length;i++){
  　　　　if(!json[arr[i]]){
  　　　　　　res.push(arr[i]);
  　　　　　　json[arr[i]] = 1;
  　　　　}
  　　}
  　　return res;
}
//点击修改
var constrObjForEditCmsCon,constrArrForEditCmsCon = '';
function editThisCon(btn){
	addOrEdit = false;
	console.log($(btn).attr('deviceCodeArr'));
	console.log(addOrEditApplicaion);
	cmsSite(btn);
	//if(addOrEditApplicaion){
	//获取选中的设备
	var deviceIdArr = $(btn).attr('deviceCodeArr');
	deviceIdArr = deviceIdArr.split(",");
	//}else{
	//	var deviceIdArr = $(btn).attr('deviceCodeArr');
//		deviceIdArr = deviceIdArr.substring(0,deviceIdArr.length-1).split(",");
//	}
	console.log(deviceIdArr);
	$.each(deviceIdArr,function(index,item){
		var objs=$(":checkbox[value="+item+"]");
    	objs.prop("checked",true);
	})
	//情报板样式
	constrArrForEditCmsCon = $(btn).attr('constr');
	/*console.log(constrArrForEditCmsCon);
	constrObjForEditCmsCon = JSON.parse(constrArrForEditCmsCon.replace(/；/g,','));
	console.log(constrObjForEditCmsCon);*/
}
function cmsConEdit(constrObj,allCmsVal,constrArr){
	var html = '';
	console.log(constrObj);
	$.each(constrObj,function(index,item){
		var cmsWidth = item.deviceType.split("*")[0];
		var cmsHeight = item.deviceType.split("*")[1];
		$.each(allCmsVal,function(index,item1){
			console.log(item1);
			console.log(item.deviceType);
			if(item1 == item.deviceType){
				savePulishJson.push(constrArr.replace(/；/g,","));
				var fontFamily = switchFont(parseInt(item.font));
				var fontSize = switchFontSize(parseInt(item.fontSize));
				var fontColor = switchColorCss(parseInt(item.fontFrontColor));
				var endConStr = item.content;
				$('.content').val(endConStr)
				//var top = item.contents[0].y +'px';
		//		var left = item.contents[0].x +'px';
				var top = (parseInt(cmsHeight))/2 + 'px';
			    var left = (parseInt(cmsWidth) + 14) + 'px';
				html +="<div class='cloneCms' style='position: relative;'>";
				html +="	<p class='cmsAttr' style='display:none;'>"+constrArr.replace(/；/g,",")+"</p>";                                       
			    html +='    <div class="previewBarPer" style=" width: '+cmsWidth+'px; height: '+cmsHeight+'px;overflow:hidden;">';                                      
			    html +='         <div class="previewBar" style="vertical-align: middle; display: table-cell; width: '+cmsWidth+'px; height: '+cmsHeight+'px; background: rgb(0, 0, 0); text-align: center;">';                                         
			    html +="               <div class='preview' style='display: inline-block; font-family: "+fontFamily+"; font-size: "+fontSize+"px; line-height: "+fontSize+"px; color:"+fontColor+";'>"+endConStr+"</div>";
			    html +='         </div>';
			    html +='         <div class="editBtn" style="position: absolute;  top: '+top+'; left: '+left+';">';
			    html +="               <span class='fa fa-pencil' cmsAttr='"+constrArr.replace(/；/g,",")+"'></span>";
			    html +="               <span class='fa fa-trash-o' cmsAttr='"+constrArr.replace(/；/g,",")+"'></span>";
			    html +='    </div>';
			    html +='         </div>';
			    html +='</div>';
			
			}
		})
	})
    //$('.editPart1').html(html);
    
    
    
    //删除某行
    function deleteRow(btn){
    	$(btn).parent().parent().remove();
    }
	
}