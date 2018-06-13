//	  设备状态	Status 1-正常 2-故障 3-通讯断 4-停用
function switchStatus(status){   
	var isStatus = ""
    switch (status) {
            case 0:
            	isStatus = "未知";
                break;
            case 1:
            	isStatus = "正常";
                break;
            case 2:
            	isStatus = "故障";
                break;
            case 3:
            	isStatus = "通讯断";
                break;
        }
    return isStatus;
  }
//所在位置 Position 1-上行， 2-下行，3-收费站
function switchPosition(Position){
   	var isPosition = ""
    switch (Position) {
            case 1:
            	isPosition = "上行";
                break;
            case 2:
            	isPosition = "下行";
                break;
            case 3:
            	isPosition = "收费站";
                break;
            
        }
    return isPosition;
}
/**
 * 通讯方式参数配置
 */
//通讯方式
function switchCommType(commType){   
	var iscommType = ""
    switch (commType) {
            case 1:
            	iscommType = "网络";
                break;
            case 2:
            	iscommType = "串口";
                break;
            case 3:
            	iscommType = "网关";
                break;
            case 4:
            	iscommType = "PLC控制器";
                break;
            case 5:
            	iscommType = "TCP通讯";
                break;
            case 6:
            	iscommType = "远程IO控制器";
                break;
            case 7:
            	iscommType = "OPC客户端";
                break;
            case 8:
            	iscommType = "隧道客户端";
                break;
        }
    return iscommType;
  }
getPlcType('#getPlcType');
getIo('#getIo');
getSuidao('#getSuidao');
var setDivIndex = '';
var commType = '';    //通讯方式
$("#tab-second input[name='communication']").on('ifChanged', function () {
	  // $("input[name='communication']").attr('disabled','disabled');
       if($(this).is(':checked')) {  
   			commType = $(this).val();
   			console.log($(this));
       		if($(this).val() == '0'){
       			$('#tab-second .setDiv').hide()
       		}else{
	       		$('#tab-second .setDiv').hide().eq($(this).val()-1).show();
	       		setDivIndex = $(this).val()-1;
       		}
       } 
});
$('#getPlcType').change(function(){
	$.ajax({
      type:"get",
      url:'/device/getDeviceCode',
      async:true,
      dataType:'json',
      data:{
      	   'typeCode':$('#getPlcType').val()
      },
      success:function(res){
      	 console.log(res);
            var options = '';
            $.each(res,function(index,item){
              options+='<option value="'+item+'">'+item+'</option>'                 
            });
            $('#plcCode').html('<option value=" ">请选择</option>' + options); 
            $('.selectpicker').selectpicker('refresh');
      },
      error:function(res){
        console.log(res);
      }
  });
})

$('#getIo').change(function(){
	$.ajax({
      type:"get",
      url:'/device/getDeviceCode',
      async:true,
      dataType:'json',
      data:{
      	   'typeCode':$('#getIo').val()
      },
      success:function(res){
      	 console.log(res);
            var options = '';
            $.each(res,function(index,item){
              options+='<option value="'+item+'">'+item+'</option>'                 
            });
            $('#getCode').html('<option value=" ">请选择</option>' + options); 
            $('.selectpicker').selectpicker('refresh');
      },
      error:function(res){
        console.log(res);
      }
  });
})
//串口号判断1-255
$('.serialNumber').blur(function(){
	var value = $(this).val();
	if(parseInt(value) < 1 || parseInt(value) > 255){
			var box = $("#mb-save-row");
	        box.addClass("open");
	        box.find('.faIcon').removeClass('fa-check').addClass('fa-times');
	        box.find('.fontCon').html('串口号应在1-255之间！');
	        box.find('.mb-footer').show();
	        box.find(".mb-control-yes").on("click",function(){
	          box.removeClass("open");
	        })
	}
})