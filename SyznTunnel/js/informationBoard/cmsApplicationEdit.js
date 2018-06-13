var editObj = JSON.parse(localStorage.getItem('editCon'));
if(editObj){
	addOrEditApplicaion = false;
	$('.pageName').text('申请表信息修改');
	putCon(editObj);
}else{
	addOrEditApplicaion = true;
	$('.pageName').text('申请表信息发布');
}
function putCon(conObj){
	localStorage.removeItem('editCon');
	$('.afterHtml').remove();
	console.log(conObj);
	var endTime;
	if(conObj.endTime == null){
		endTime = '';
	}else{
		endTime = formatDate1(new Date(conObj.endTime));
	}
	var startTime;
	if(conObj.startTime == null){
		startTime = '';
	}else{
		startTime = formatDate1(new Date(conObj.startTime));
	}
	var saveTime;
	if(conObj.saveTime == null){
		saveTime = '';
	}else{
		saveTime = formatDate1(new Date(conObj.saveTime));
	}
	$('.applicationId').val(conObj.id);
	$('.applicationNumber').val(conObj.applicationCode);
	$('.applicationUnit').val(conObj.applicationUnit);
	$('.applicationPerson').val(conObj.applicant);
	$('.applicationTime').val(saveTime);
	$('.startTime').val(startTime);
	$('.endTime').val(endTime);
	$('.releaseReason').val(conObj.applicantReason);
	$('.releasePriority').val((conObj.groupOrder == null?"":conObj.groupOrder));
	//$('.releaseSite').text(conObj.publishStation);
	console.log(conObj);
	var contentArr = [];
	$.each(conObj.cmsContentEditTemporaryGroup,function(index,item){   
		contentArr.push(item.content);
	})
	//$('.releaseConTd').html(unique(contentArr)+'<a class="btn btn-default btn-rounded btn-sm addBtnOne pull-right"><span class="fa fa-plus"></span></a>');
	
	var html = '';
	console.log(conObj.callBackDisplay);
	//var deviceCodeArr = conObj.deviceCodes.split(',');
	$.each(conObj.callBackDisplay,function(index,item){ 
		html += '<tr class="afterHtml">';
		html += '<td class="textRight">申请信息发布位置</td>';
		html += '<td class="selectBtn" style="max-width:250px;">'+item.split('///')[0]+'</td>';
		html += '<td class="textRight tableThWidth">信息发布内容</td><td colspan="4" class="releaseConTd">'+item.split('///')[1];
		html += "<button class='btn btn-default btn-rounded btn-sm pull-right' style='margin-left:10px;padding:2px 2px 0px 6px;' title='删除' onclick='deleteRow(this)'><span class='fa fa-times'></span></button><button class='btn btn-default btn-rounded btn-sm editThisCon pull-right' deviceCodeArr='"+item.split("///")[2].replace(/；/g,",")+"' constr='"+item.split('///')[3].replace(/；/g,",")+"' onclick='editThisCon(this)'>";
		html += '<span class="fa fa-edit"></span></button></td><td style="display:none;"><input value="'+item.split("///")[2].replace(/；/g,",")+'" class="deviceCodeCopy" type="hidden"></td></tr>';
	})
	console.log(html);
	console.log(conObj.cmsContentEditTemporaryGroup);
	$('.nextCon').after(html);
	
}
//删除某行
    function deleteRow(btn){
    	$(btn).parent().parent().remove();
    }
/*
//时间选择器---年月日
$('.applicationTime').datetimepicker({
	language:  'zh',
    format: 'yyyy-mm-dd',
    todayBtn:  1,
    autoclose: 1,
    todayHighlight: 1,
    clearBtn:true
});
//添加组	
$('.addBtn').click(function(){
	cloneTr();
})
function cloneTr(){
	$('.applicationTable').append($('.cloneTr').clone(true).show().removeClass('cloneTr'));
}
//添加位置和内容
var trIndex;	
$('.addBtnOne').click(function(){
	trIndex = $(this).parent().parent().index();
	$('.firstPart').addClass('toggleThis');
	$('.secondPart').removeClass('toggleThis');
	$('.thirdPart').addClass('toggleThis');
})
//选择发布信息的情报板
var conjsonArr = []; 
var cmsSizeArr = [];
var deviceCodeArr = [];
var allCmsVal,kv;
$('.sendMessageAndAdd').click(function(){
	$("input[name='id[]']:checked").each(function() { 
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
		console.log("====================");
		console.log(allCmsVal);
		console.log("====================");
		//情报板尺寸
		$('#boardSize').val(allCmsVal);
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
			deviceSiteArr = [];
			clearEditPart();
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
		  deviceSiteArr = [];
		  clearEditPart();
		  $('.firstPart').addClass('toggleThis');
		  $('.secondPart').removeClass('toggleThis');
		  $('.thirdPart').addClass('toggleThis');
	}
})
$('.backFirst').click(function(){
	$('.firstPart').removeClass('toggleThis');
	$('.secondPart').addClass('toggleThis');
	$('.thirdPart').addClass('toggleThis');
})
//third保存
var savePulishJson = [];
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
		for(var i = 0;i<$('.finishedMessage').find('.cmsAttr').length;i++){
			savePulishJson.push(JSON.parse($('.finishedMessage').find('.cmsAttr').eq(i).html()));
		}
		$('.applicationTable .releaseConTd').eq(trIndex-3).text(unique(conArr));
		$('.applicationTable .selectBtn').eq(trIndex-3).text(deviceSiteArr);
		conArr = [];
		deviceSiteArr = [];
		clearEditPart();
		$('.firstPart').removeClass('toggleThis');
		$('.secondPart').addClass('toggleThis');
		$('.thirdPart').addClass('toggleThis');
		cloneTr();
		trIndex++;
	}
})
	//申请单检查
	$(".applicationNumber").blur(function(){
		existLevelDevices('');
	})
	//申请表编号自动生成
	//applicationCodeFun();
	function applicationCodeFun(){
		$.ajax({
			url: "/informationBoard/generateApplicationCode",
			type: "get",
			dataType: "json",
			async:false,
			success: function(data) {
				console.log(data);
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
		if($('.applicationNumber').val() != '' || deviceCodes.length > 0){
			$.ajax({
				url: "/lzinformationBoard/existLevelDevices",
				type: "get",
				dataType: "json",
				async:false,
				data:{
					'applicationCode':$('.applicationNumber').val(),
		            'deviceCodes[]':deviceCodes,
		            'groupOrder':$('.releasePriority').val()
				},
				success: function(data) {
					console.log(data);
					var result="";
					if(data.isExistApplicationCode!=null ||data.isExistSameLevelDevice!=null){
						console.log(data.isExistApplicationCode);
						console.log(data.isExistSameLevelDevice);
						if(data.isExistSameLevelDevice!=undefined && data.isExistSameLevelDevice!=null){
							result += '<h2 style="margin-bottom:0px;color:#fff;margin-top:4px">情报板将发生信息冲突，详情如下（设备，申请表编号）：</h2><p style="margin-top:10px;line-height:24px;">';
							$.each(data.isExistSameLevelDevice,function(index,item){
								var item = item.replace(/;/g,'；');
								item = item.replace(/,/g,'，');
								result += item;
							})
							result += '</p>';
							var box = $("#box");
					        box.addClass("open");
					        box.find('.faIcon').removeClass('fa-check').addClass('fa-times');
					        box.find('.fontCon').html(result);
					        box.find('.fontCon').css('font-size','14px');
					        box.find(".mb-control-yes").off("click").on("click",function(){
					             box.removeClass("open");
					             $('.firstPart').addClass('toggleThis');
								 $('.secondPart').removeClass('toggleThis');
								 $('.thirdPart').addClass('toggleThis');
								 $("input[name='id1[]']").prop('checked',false);
								 $("input[name='id[]']").prop('checked',false);
					        })
						}
						if(data.isExistApplicationCode!=undefined){
							result = data.isExistApplicationCode;
							$('.applicationNumber').val('');
							var box = $("#box");
					        box.addClass("open");
					        box.find('.faIcon').removeClass('fa-check').addClass('fa-times');
					        box.find('.fontCon').html(result);
					        box.find('.fontCon').css('font-size','26px');
					        box.find(".mb-control-yes").off("click").on("click",function(){
					             box.removeClass("open");
					        })
						}
						
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
			console.log(data);
			localStorage.setItem('formCmsApplicationData',JSON.stringify(data));
				if(data!=null && data.length>0){
					var box = $("#cmsApplicationList");
			        box.addClass("open");
			        box.find('.faIcon').removeClass('fa-check').addClass('fa-times');
			        box.find('.fontCon').html('存在过期申请表，请处理！');
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
		var callBackDisplay = [];
		for(var i = 1; i < $('.selectBtn').length-1;i++){
		console.log($('.selectBtn').eq(i).text());
			callBackDisplay.push($('.selectBtn').eq(i).text().replace(/,/g,';')+'///'+$('.releaseConTd').eq(i).text());
		}
		
		console.log(JSON.stringify(parameter));
		console.log(JSON.stringify(savePulishJson));
		console.log(callBackDisplay);
		$.ajax({
			url: url,
			type: "post",
			dataType: "json",
			data:{
				//'cmsGroupparameter':JSON.stringify(savePulishJson),
				'parameter':JSON.stringify(savePulishJson),
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
	}*/
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


