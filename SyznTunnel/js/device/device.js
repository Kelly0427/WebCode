deviceTpye('#deviceClass1');
deviceSystem('#isSystem');
areaSearchList('#area1');
getDevicePosition('#site1')
/**
 * 设备编码 
 */
function getDeviceCode(){
 	$.ajax({
        type:"get",
        url:"/device/generateDeviceCode",          
        async:true,
        dataType:'json',
        success:function(res){
        	console.log(res);
        	$('.content1').val(res);
        },
        error:function(res){
        }     
      });
}
 //点击添加按钮清空列表
 var flag;//修改后点保存数据加载当前页，添加后点保存数据加载第一页的标识
  $('.addBtn').click(function(){
  		flag = true;
  		$('.nav-tabs li').removeClass('active');
  		$('.nav-tabs li').eq(0).addClass('active');
  		$('.tab-pane').removeClass('active');
  		$('.tab-pane').eq(0).addClass('active');
  		$("input[name='communication']").eq(0).iCheck('check');
  		$('.setDiv').hide();
	 	$('#myModal #tab-first,#tab-third input').val('');	
	 	$('#myModal #tab-second .setDiv input').val('');	
	 	$('#myModal textarea').val('');
		$('.selectpicker').selectpicker('deselectAll');
		$('.selectpicker').selectpicker('refresh'); 
	 	$('#myModal').modal('show');
	 	getDeviceCode();
	 	$('.stayTime').val('5');
		 setTimeout(function() {
		      initialize();
		      ShowPoint();
		      drowLine('blue',4,1);
	    },300);
  })
       
//全选
$("#checkAll").click(function(){
    $("input[name='id[]']").prop("checked",this.checked);
})
 	
var nowNum;
dataList(1);
function dataList(num) {
	ShowLoading();
	nowNum = num;
	$.ajax({
		url: "/device/deviceData",
		type: "get",
		dataType: "json",
		data:{
			'page':num-1,
            'size':13,
            'devicecode':$(".selectDeviceCode").val(),     
            'name':$(".selectDeviceName").val() 
		},
		success: function(data) {
			console.log(data);
			  HiddenLoading();
              var val = data.content;
              var tabelPage = '';
              $.each(val,function(index,item){    
               	  var conJson = JSON.stringify(item);
            	  tabelPage+='<tr><td><input type="checkbox" name="id[]" value="'+item.id+'" class="self-input itemId"/>';
            	  tabelPage+='<span class="self-id">'+(index+1)+'</span></td><td>';
            	  tabelPage+="<a href='' class='content' data-target='#myModal' data-toggle='modal' conJson='"+conJson+"'>";
	              tabelPage+=item.devicecode+'</a></td><td class="deviceClass">'+item.deviceTypeName+'</td><td class="isSystem">'+(item.deviceSystem == null?'':((item.deviceSystem).systemName))+'</td><td class="currentStatus">'+switchStatus(item.status)+'</td><td class="site">'+item.position+'</td><td class="areacodeStr">'+item.areacodeStr+'</td><td class="areacode" style="display:none">'+item.areacode+'</td><td class="acquisitionCycle">'
	                  +(item.cycle == null?" ":item.cycle)+'</td><td class="communicate">'+switchCommType(parseInt(item.commtype))+'</td><td class="longitude">'+(item.longitude == null?" ":item.longitude)+'</td><td class="latitude">'+(item.latitude == null?" ":item.latitude)+'</td><td class="remark">'+item.comment+'</td></tr>';  
          	});
            $('.selfTbody').html(tabelPage);
            modalFun();
			//分页
			$("#page").paging({
				pageNo: num,
				totalPage: data.totalPages,
				totalSize: data.totalElements,
				callback: function(num) {
					dataList(num);
				}
			})
		}
	})
}	   
//查询
$('.search').click(function(){
    dataList(1);  
}) 
//删除
$('#deleteBtn').click(function(){
	 var deleteId = new Array();                             
     $("input[name='id[]']:checked").each(function() { 
     	deleteId.push($(this).val());        	
     })
     if(deleteId.length > 0){
    	 $('.removeId').val(deleteId);
    	 delete_row();
     }else{
     	var box = $("#mb-save-row");
        box.addClass("open");
        box.find('.faIcon').removeClass('fa-check').addClass('fa-times');
        box.find('.fontCon').html('请选择删除项！');
        box.find('.mb-footer').show();
        box.find(".mb-control-yes").off("click").on("click",function(){
             box.removeClass("open");
        })
     }
})
// 弹出确认删除
function delete_row(){
    var box = $("#mb-remove-row");
    box.addClass("open");
    box.find(".mb-control-yes").off("click").on("click",function(){
    	 box.removeClass("open");
    	 var deleteIds = $('.removeId').val().split (",");
    	 $.ajax({
            type:"delete",
            url:"/device/deviceDelete?deleteIds="+deleteIds,          
            async:true,
            dataType:'json',
            success:function(res){
        		dataList(nowNum);                  
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
    });
    box.find(".mb-control-close").off("click").on("click",function(){
        box.removeClass("open");
    });
}
//模态框
function modalFun(){  			
 	$('.content').click(function(){      
 		flag = false; 	
		$('.nav-tabs li').removeClass('active');
  		$('.nav-tabs li').eq(0).addClass('active');
  		$('.tab-pane').removeClass('active');
  		$('.tab-pane').eq(0).addClass('active');
		var conObj = JSON.parse($(this).attr('conJson'));
		console.log(conObj);
		setTimeout(function() {
		      initialize();
		      ShowPoint();
		      drowLine('blue',4,1);
	    },300);
 		var thisParent = $(this).parent().parent();         		        		
 	    $('#myModal .id').val(thisParent.find('.itemId').val());
 	    $('#myModal .content1').val(thisParent.find('.content').html());
 	    $('#myModal .physicalEncoding1').val(thisParent.find('.physicalEncoding').html());
 	    var deviceClass = thisParent.find('.deviceClass').html();
		var deviceClassVal = $("#deviceClass1 option:contains('"+deviceClass+"')").val();
		$('#myModal #deviceClass1').selectpicker('val',deviceClassVal);
		var isSystem = thisParent.find('.isSystem').html();
		var isSystemVal = $("#isSystem option:contains('"+isSystem+"')").val();
		$('#myModal #isSystem').selectpicker('val',isSystemVal);
 	    var currentStatus1 = thisParent.find('.currentStatus').html();
 	    var currentStatus1Val = $(".currentStatus1 option:contains('"+currentStatus1+"')").val();
		$('#myModal .currentStatus1').selectpicker('val',currentStatus1Val);
 	    var site1 = thisParent.find('.site').html();
 	    var site1Val = $(".site1 option:contains('"+site1+"')").val();
		$('#myModal .site1').selectpicker('val',site1Val);
		
		var areacode = thisParent.find('.areacode').html();
		$('#myModal .area1').selectpicker('val',areacode);
		
 	    $('#myModal .milimeter').val(conObj.milimeter);
 	    $('#myModal .meter').val(conObj.meter);
 	    $('#myModal .acquisitionCycle1').val(thisParent.find('.acquisitionCycle').html());
     	$('#myModal #longitude').val(thisParent.find('.longitude').html());
     	$('#myModal #latitude').val(thisParent.find('.latitude').html());
     	$('#myModal .remark1').val(thisParent.find('.remark').html());
 	    var communicate1 = conObj.commtype;
     	$("input[name='communication']").eq(communicate1).iCheck('check');
     	console.log(conObj.flag1);
     	console.log(conObj.flag2);
     	$('#tab-second .setDiv input').val('');
     	$('#tab-second .selectpicker').selectpicker('deselectAll');
		$('#tab-second .selectpicker').selectpicker('refresh'); 
     	$('#tab-second .setDiv').eq(communicate1-1).find('.flag1').val(conObj.flag1);
     	$('#tab-second .setDiv').eq(communicate1-1).find('.flag2').val(conObj.flag2);
     	$('#tab-second .setDiv').eq(communicate1-1).find('.flag3').val(conObj.flag3);
     	$('#tab-second .setDiv').eq(communicate1-1).find('.flag4').val(conObj.flag4);
     	$('#tab-second .setDiv').eq(communicate1-1).find('.flag5').val(conObj.flag5);
     	if(communicate1 == '7'){
	     	$('#tab-second .setDiv').eq(communicate1-1).find('.devconfig').val(conObj.devconfig);
     	}else{
     		if(conObj.devconfig){
     			console.log(conObj.devconfig);
	     		cmsSetting(conObj.devconfig);
	     		$('.width').val(itemCmsJson.w);
	     		$('.height').val(itemCmsJson.h);
	     		$('.stayTime').val(itemCmsJson.t);
	     		$('.fontFamily').val(itemCmsJson.f);
	     		$('.fontSize').val(itemCmsJson.s);
	     		$('.fontColor').val(itemCmsJson.c);
	     		$('.effects').val((itemCmsJson.e));
     		}
     	}
     	$('#myModal #supportColor').selectpicker('val',conObj.supportColor);
     	$('#myModal #specialYellow').selectpicker('val',conObj.specialYellow);
		$('.selectpicker').selectpicker('refresh');
 	})   
}      
// 保存 
$('.saveBtn').click(function(){
  	 save();
})
function save(){
     var devicecode = $('.content1').val();                    //设备编号         
     var deviceClass = $('.deviceClass1').val();               //设备类型
     var currentStatus = $('.currentStatus1').val();           //当前状态   
     var position = $('.site1').val();                         //所在位置
     var areacode = $('#area1').val();                         //所在区域
     var cycle  = $('.acquisitionCycle1').val();              //采集周期
     var longitude = $("#longitude").val();                   //经度
     var latitude = $("#latitude").val();                     //纬度
     var comment = $('.remark1').val();    
     var isSystem = $('#isSystem').val();  
     var milimeter = $('.milimeter').val();  
     var meter = $('.meter').val();  
     var supportColor = $('#supportColor').val();  //支持颜色
     var specialYellow = $('#specialYellow').val();  //特殊颜色
     
     var id = $('.id').val();  
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
     	//情报板含义：w 宽 h 高 t:停留时间  f:字体 s:字体大小 c：字体颜色 e：特效
     	devconfig = 'w:'+$('.width').val()+';h:'+$('.height').val()+';t:'+$('.stayTime').val()
     	+';f:'+$('#fontFamily').val()+';s:'+$('#fontSize').val()+';c:'
     	+$('#fontColor').val()+';e:'+$('#effects').val()+';'
     }
     flag1 = (flag1 == undefined?'':flag1);
     flag2 = (flag2 == undefined?'':flag2);
     flag3 = (flag3 == undefined?'':flag3);
     flag4 = (flag4 == undefined?'':flag4);
     flag5 = (flag5 == undefined?'':flag5);
     flag6 = (protocol == undefined?'':protocol);
     devconfig = (devconfig == undefined?'0':devconfig);
	  $.ajax({
	      type:"post",
	      url:"/device/deviceAdd",
	       data:{
	       	   'id':id,
	    	   'devicecode':devicecode,
	    	   'deviceTypeId':deviceClass,
	    	   'status':currentStatus,
	    	   'position':position,
	    	   'areacode':areacode,
	    	   'cycle':cycle,
	    	   'commtype':commType,
	    	   'longitude':longitude,
	    	   'latitude':latitude,
	    	   'comment':comment,
	    	   'deviceSystemId':isSystem,
	    	   'isTunnelDevice':'1',
	    	   'flag1':flag1,
	    	   'flag2':flag2,
	    	   'flag3':flag3,
	    	   'flag4':flag4,
	    	   'flag5':flag5,
	    	   'protocol':protocol,
	    	   'devconfig':devconfig,
	    	   'meter':meter,
	    	   'milimeter':milimeter,
	    	   'supportColor':supportColor,
	    	   'specialYellow':specialYellow
	       },
	      async:true,
	      dataType:'json',
	      success:function(res){
	      		if(flag){
		    	  dataList(1);
	      		}else{
		    	  dataList(nowNum);
	      		}
	    	  $('#myModal').modal('hide');
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
	 } 
//添加系统
$('.addSystem').click(function(){
	$('#addSystem').modal('show');
})
$('.saveSystemBtn').click(function(){
		$.ajax({
	      type:"post",
	      url:"/device/deviceSysteAdd",
	       data:{
	    	   'systemName':$('.addSystemVal').val()
	       },
	      async:true,
	      dataType:'json',
	      success:function(res){
	    	  deviceSystem('#itsSystem')
	      },
	      error:function(res){
	      
	      }
	    });
})
//当添加的是情报板时
$('#isSystem').change(function(){
	console.log($('#isSystem option:selected').text());
	if($('#isSystem option:selected').text() == '情报板'){
		$('.tab-third').show();
	}else{
		$('.tab-third').hide();
	}
})

