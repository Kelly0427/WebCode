ShowLoading(); 
//全选
checkAll("#checkAll","input[name='id[]']");
//选中的设备
var getSendId = [];
for(var i = 0;i<$('.getSendId').size();i++){
  	getSendId.push($('.getSendId').eq(i).html());
}
var deviceCodesList = [];  //群发的设备编号
//显示给那个情报板发布信息
deviceList();
function deviceList(){
	$.ajax({
	    type:"get",
	    url:"/deviceList",   
  		data:{
  	    	'ids':getSendId
  	    },
	    async:false,
	    dataType:'json',
	    success:function(res){
            var orderBoardSizeOptions = '';
            $.each(res,function(index,item){
            	orderBoardSizeOptions+='<option value="'+item.devicecode+'">'+item.comment+'</option>';
            	deviceCodesList.push(item.devicecode);                 
            });
            $('#orderBoardSize').html(orderBoardSizeOptions); 
            $("#orderBoardSize option:first").prop("selected", true); 
            $('.selectpicker').selectpicker('refresh');
	    },
	    error:function(res){
	      console.log(res);
	    }     
	}); 
}
$('.sizeSearch').val(localStorage.getItem('cmsSize').split(',')[0]);
var size = 10;  
console.log(localStorage.getItem('cmsSize').split(',')[0]);
//信息库列表
informationBase(1,size,'',localStorage.getItem('cmsSize').split(',')[0]);
//发布
$('.sendMessage').click(function(){
	var messageId = [];
	$("input[name='id[]']:checked").each(function() { 
  		messageId.push($(this).val());        	
    })
    console.log(messageId);
    console.log(deviceCodesList);
	$.ajax({
	    type:"get",
	    url:"/informationBoard/sendMessageBackResult",   
  		data:{
  	    	'ids':messageId,
  	    	'deviceCodes':deviceCodesList     //.join(',')
  	    },
	    async:false,
	    dataType:'json',
	    success:function(res){
            var box = $("#box");
	        box.addClass("open");
	        box.find('.faIcon').addClass('fa-check').removeClass('fa-times');
	        box.find('.fontCon').html('下发信息成功！');
	        box.find('.mb-footer').hide();
	        setTimeout(function(){
          		box.removeClass("open")
    		},1000);
	    },
	    error:function(res){
	        var box = $("#box");
	        box.addClass("open");
	        box.find('.faIcon').removeClass('fa-check').addClass('fa-times');
	        box.find('.fontCon').html('下发失败，请重新操作！');
	        box.find('.mb-footer').show();
	        box.find(".mb-control-yes").on("click",function(){
	          box.removeClass("open");
	        })
	    }     
	});
})