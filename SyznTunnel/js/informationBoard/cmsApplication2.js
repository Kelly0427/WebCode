$(function(){
	//时间选择器---年月日
	$('.form_datetime').datetimepicker({
		language:  'zh',
	    format: 'yyyy-mm-dd hh:ii',
	    todayBtn:  1,
	    autoclose: 1,
	    todayHighlight: 1,
	    clearBtn:true
	});
	//所有情报板/device/getCmsDevice
	$.ajax({
		url: "/device/getCmsDevice",
		type: "get",
		dataType: "json",
		success: function(data) {
			console.log(data);
			var options = '';
            $.each(data,function(index,item){
            	var cmsSize;
            	if(item.devconfig){
			 		 cmsSetting(item.devconfig);
			 		 width = itemCmsJson.w;
			 		 height = itemCmsJson.h;
			 		 cmsSize = width+'*'+height;
			 	  }
              options+='<option value="'+item.devicecode+'" cmsSize='+cmsSize+'>'+item.comment+'</option>'                 
            });
            $('#releasePosition').html('<option value="">请选择</option>' + options); 
            $('.selectpicker').selectpicker('refresh');
		},
		error:function(data){
			console.log(data);
		}
  	});
	
	
	$('.addBtn').click(function(){
		$('.applicationTable').append($('.cloneTr').clone(true).show().removeClass('cloneTr'));
		$('.editPartOfBottom').addClass('toggleThis');
	})
	
	$('.addBtnOne').click(function(){
	 	whichTr = $(this).parent().parent().index();
		if(whichTr == whichTrPrev){
			whichTrPrev = whichTr;
	 		console.log(whichTrPrev);
			return false;
		}else{
			whichTrPrev = whichTr;
		 	//if($('.editPartOfBottom').hasClass('toggleThis')){
		 		$('.editPartOfBottom').removeClass('toggleThis')
		 		
		 	//}else{
//		 		$('.editPartOfBottom').addClass('toggleThis')
//		 	}
		}
	})
	//申请单检查
	$('.applicationNumber').change(function(){
		existLevelDevices();
	})
	$('.releasePosition').change(function(){
		existLevelDevices();
	})
	function existLevelDevices(){
		var deviceCodes = [];
		for (var i = 0; i < parseInt($('.applicationTable .releaseCon').length); i++) {
			var cmsSiteOne= $('.applicationTable .releaseCon').eq(i).parent().find('.releasePosition').val();
			deviceCodes.push(cmsSiteOne);
		}
		if($('.applicationNumber').val() != '' && deviceCodes.length > 0){
			$.ajax({
				url: "/lzinformationBoard/existLevelDevices",
				type: "get",
				dataType: "json",
				data:{
					'applicationCode':$('.applicationNumber').val(),
		            'deviceCodes':deviceCodes
				},
				success: function(data) {
					console.log(data);
					//var box = $("#mb-save-row");
//			        box.addClass("open");
//			        box.find('.faIcon').removeClass('fa-check').addClass('fa-times');
//			        box.find('.fontCon').html('！');
//			        box.find('.mb-footer').show();
//			        box.find(".mb-control-yes").off("click").on("click",function(){
//			             box.removeClass("open");
//			        })
				},
				error:function(data){
					console.log(data);
				}
	      	});
		}
	}
	//申请单提示
	existLevelDevices();
	function existLevelDevices(){
		$.ajax({
			url: "/lzinformationBoard/remindIsObsolete",
			type: "get",
			dataType: "json",
			success: function(data) {
				console.log(data);
				
			},
			error:function(data){
				console.log(data);
			}
      	});
		
	}
	//保存申请单
	$('.saveApplication').click(function(){
		saveApplication();
	})
	function saveApplication(){
		var applicationCode = $('.applicationNumber').val();
		var applicationUnit = $('.applicationUnit').val();
		var applicant = $('.applicationPerson').val();
		var applicationTime = $('.applicationTime').val();
		var startTime = $('.startTime').val();
		var endTime = $('.endTime').val();
		var applicantReason = $('.releaseReason').val();
		var groupOrder = $('.releasePriority').val();
		var CmsGroup = {applicationCode,applicationUnit,applicant,applicationTime,startTime,endTime,applicantReason,groupOrder};
		var cmsSites = [];
		var cmsCon = [];
		for (var i = 0; i < parseInt($('.applicationTable .releaseCon').length); i++) {
			var cmsSiteOne= $('.applicationTable .releaseCon').eq(i).parent().find('.releasePosition').val();
			cmsSites.push(cmsSiteOne);
			for (var j = 0; j < $('.applicationTable .cloneCms').length ; j++) {
				var cmsattrObj = JSON.parse($('.applicationTable .cloneCms').eq(j).find('.fa-pencil').attr('cmsattr'));
				cmsattrObj.deviceSite = cmsSiteOne;
				cmsCon.push(cmsattrObj);
			}
		}
		var deviceCodes = cmsSites.join(',');
		console.log(JSON.stringify(CmsGroup));
		console.log(JSON.stringify(cmsCon));
		console.log(deviceCodes);
		$.ajax({
			url: "/lzinformationBoard/cmsGroupAdd",
			type: "post",
			dataType: "json",
			data:{
				'CmsGroup':JSON.stringify(CmsGroup),
	            'CmsContentEditTemporaryGroup':JSON.stringify(cmsCon),
	            'deviceCodes':deviceCodes 
			},
			success: function(data) {
			
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


})


