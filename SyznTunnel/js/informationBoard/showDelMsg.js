//全选
checkAll("#checkAll","input[name='id[]']");
//命令节目类型(search)
commandType('#commandType');
//情报板尺寸
boardSizeTypeItem('#boardSizeSearch');
var coefficient = 0.7;
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
				'page':num-1,
	            'size':13,
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
             	  tabelPage+="<tr><td style='text-align:left;'><input type='hidden' name='id[]' value='"
             		  +item.id+"' class='self-input' id='"
              		  +item.devicecode+"' conJson='"+conJson+"' cmsSize='"+cmsSize+"'/><span class='self-id'>"
             		  +(index+1)+"</span></td><td><a href='' class='devicecode' data-target='#myModal' data-toggle='modal' conJson='"+conJson+"' onclick='showDelMsg(this)'>"
                      +item.devicecode+"</a></td><td style='text-align:left;'>"
                      +item.comment+"</td><td>"
                      +cmsSize+"</td><td>"
                      +item.position+"</td><td>"
                      +(item.milimeter==null?'':'K'+item.milimeter+'+'+item.meter)+"</td><td>"
                      +item.commdata+"</td><td style='display:none;'>";
                      if(item.linkagedevice){
                  		tabelPage+="<span class='fa fa-caret-square-o-right' style='font-size:16px;margin-left:10px;cursor:pointer;' title='查看实时视频' onclick='showVideo(this)' linkagedevice='"+item.linkagedevice+"'></span>";
                      }
                  tabelPage+="</td></tr>";  
               });
	            $('.selfTbody').html(tabelPage);
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
var deviceCode = null;
function showDelMsg(btn){
	var conObj = JSON.parse($(btn).attr('conJson'));
	deviceCode = conObj.devicecode;
	$.ajax({
		url: "/deviceSendedLog/findCmsContentEditByDeviceCode",
		type: "get",
		dataType: "json",
		data:{
            'deviceCode':deviceCode
		},
		success: function(data) {
			 console.log(data);
             var tabelPage = '';
             $.each(data,function(index,item){ 
            	var deviceType = String(item.deviceType);
            	var deviceTypeWidth = Math.floor(deviceType.split('*')[0]*coefficient);
            	var deviceTypeHeight = Math.floor(deviceType.split('*')[1]*coefficient);
            	var fontSize = Math.floor(switchFontSize(item.fontSize)*coefficient);
                  var content = item.content;
              	  if(content){
              		  content= content.replace(/\n/g,"<br />");
              	  }
              	  var sendTime = formatDate1(new Date(item.sendTime)); 
              	  var stayTime;
              	  if(item.stayTime == null){
              		stayTime = '';
              	  }else{
              		stayTime = item.stayTime;
              	  }
              tabelPage+='<tr><td style="text-align:left;"><input type="checkbox" name="id[]" value="'
          		  +item.id+'" class="self-input itemId"/><span class="self-id">'
          		  +(index+1)+'</span></td><td class="content informationContent">'
          		  +item.content+'</td><td class="font" style="display:none;">'
          		  +switchFont(item.font)+'</td><td class="fontSize" style="display:none;">'+switchFontSize(item.fontSize)+'</td><td class="fontFrontColor" style="display:none;">'
                  +switchColorWord(item.fontFrontColor)+'</td><td class="stayTime">'+stayTime+'</td><td class="enter" style="display:none;">'+switchEnterAndOut(item.enter)
                  +'</td><td><div class="previewBar" style="text-align:'
                  +switchAlignWord(item.align)+';width:'+deviceTypeWidth+'px;height:'
                  +deviceTypeHeight+'px;background:#000;margin:0 auto;"><div class="preview" style="font-size:'
                  +fontSize+'px;line-height:'+fontSize+'px;color:'
                  +switchColorCss(item.fontFrontColor)+';font-family:'+switchFont(item.font)+';position: relative;top: 50%;transform: translateY(-50%);">'
                  +content+'</div></div></td><td class="operator">'+item.operator+'</td><td class="sendTime">'
                  +sendTime+'</td><td class="commandType" style="display:none;">'
                  +item.commandType+'</td><td class="deviceType" style="display:none;">'
                  +item.deviceType+'</td></tr>';
            });
            $('.selfTbody1').html(tabelPage);
			
		},
		error:function(data) {
			
		}
	})
}
//恢复
var restoreId = new Array();                             
$('.restoreBtn').click(function(){
     $("input[name='id[]']:checked").each(function() { 
     	restoreId.push($(this).val());        	
     })
     console.log(restoreId.length);
     if(restoreId.length > 0){
    	 restore_row(restoreId);
     }else{
     	var box = $("#box");
        box.addClass("open");
        box.find('.faIcon').removeClass('fa-check').addClass('fa-times');
        box.find('.fontCon').html('请选择恢复项！');
        box.find('.mb-footer').show();
        box.find(".mb-control-yes").off("click").on("click",function(){
             box.removeClass("open");
        })
     }
})
function restore_row(ids) {
	$.ajax({
		url: "/deviceSendedLog/addAndSendTempMessage",
		type: "post",
		dataType: "json",
		data:{
			'ids':ids,
            'deviceCode':deviceCode
		},
		success: function(data) {
            var box = $("#box");
	        box.addClass("open");
	        box.find('.faIcon').removeClass('fa-times').addClass('fa-check');
	        box.find('.fontCon').html('操作成功！');
	        box.find('.mb-footer').hide();
	        setTimeout(function(){
          		box.removeClass("open")
          		$('#myModal').modal('hide');
        	},1000);
		},
		error:function(data) {
			var box = $("#box");
	        box.addClass("open");
	        box.find('.faIcon').removeClass('fa-check').addClass('fa-times');
	        box.find('.fontCon').html('操作失败！');
	        box.find('.mb-footer').hide();
	        box.find(".mb-control-yes").off("click").on("click",function(){
          		box.removeClass("open");
        	})
		}
	})
}