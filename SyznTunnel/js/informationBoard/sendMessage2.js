ShowLoading(); 
//全选
checkAll("#checkAll","input[name='id[]']");
checkAll("#checkAll1","input[name='id2[]']");
//选中的设备
var getSendId = [];
for(var i = 0;i<$('.getSendId').size();i++){
  	getSendId.push($('.getSendId').eq(i).html());
}
var deviceCodesList = [];  //群发的设备ID
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
	    console.log(res);
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
    var size = 13;  
	//信息库列表
	var cmsDeviceSize = localStorage.getItem('cmsSize').split(',')[0];
	informationBase(1,size,'','',cmsDeviceSize);
	var content = '';
	$('.search1').click(function(){
      	content = $('.contentSearch').val();
        informationBase(1,size,'',content,cmsDeviceSize);  
      });
 
  $('.sendMessage').click(function(){
	  var addInformationListId = new Array();                             
 	  $("input[name='id[]']:checked").each(function() { 
 		 addInformationListId.push($(this).val());        	
 	  })
 	  sendMessageGroup(addInformationListId);
  })   
  function sendMessageGroup(addInformationListId){
 	   if(addInformationListId.length > 0){
     	  $.ajax({
     	    type:"get",
     	    url:"/informationBoard/sendMessageLz",  
     	    data:{
     	    	'parameter':addInformationListId,
     	    	'deviceCodes':deviceCodesList
     	    },
     	    async:true,
     	    dataType:'json',
     	    success:function(res){
     	    	var box = $("#mb-remove-row4");
      	        box.addClass("open");
      	        setTimeout(function(){
      	          box.removeClass("open")
      	        },1000);
     	    },
     	    error:function(res){
     	      console.log(res);
     	    }     
     	}); 
 	  }else{
      	 var box = $("#mb-remove-none");
         box.addClass("open");
         $('.noneCon').html('请至少选择一条信息！');
         box.find(".mb-control-yes").on("click",function(){
              box.removeClass("open");
          })
     }
  }
  