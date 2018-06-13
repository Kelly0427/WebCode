findAllSiteType("#siteType");
/**
 * 设备编码 
 */
function getDeviceCode(){
 	$.ajax({
        type:"get",
        url:"/siteDefine/getMaxSiteCode",          
        async:true,
        dataType:'json',
        success:function(res){
        	$('.siteCode').val(res);
        },
        error:function(res){
        }     
      });
}
 //点击添加按钮清空列表
  $('.addBtn').click(function(){
	 	$('#myModal input').val('');	
	 	$('#myModal textarea').val('');
		$('.selectpicker').selectpicker('deselectAll');
		$('.selectpicker').selectpicker('refresh'); 
	 	$('#myModal').modal('show');
	 	getDeviceCode();
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
	console.log($('.siteTypeNameSearch').val());
	nowNum = num;
	$.ajax({
		url: "/siteDefine/siteDefineSearch",
		type: "get",
		dataType: "json",
		data:{
			'page':num-1,
            'size':13,
            'siteTypeName':$('.siteTypeNameSearch').val()
		},
		success: function(data) {
			  console.log(data);
              var val = data.content;
              var tabelPage = '';
              $.each(val,function(index,item){    
              	 var conJson = JSON.stringify(item);
            	  tabelPage+='<tr><td><input type="checkbox" name="id[]" value="'+item.id+'" class="self-input itemId"/>';
            	  tabelPage+='<span class="self-id">'+(index+1)+'</span></td><td>';
            	  tabelPage+="<a href='' class='content' data-target='#myModal' data-toggle='modal' conJson='"+conJson+"'>";
	              tabelPage+=item.siteCode+'</a></td><td>'+item.siteTypeName+'</td><td>'+item.siteName+'</td><td>'+item.phone+'</td><td>'
	              +item.beginLongitude+'</td><td>'+item.beginLatitude+'</td><td>'+item.comment+'</td></tr>';  
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
            url:"/siteDefine/deleteSiteDefine?ids="+deleteIds,          
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
		var conObj = JSON.parse($(this).attr('conJson'));
		setTimeout(function() {
		      initialize();
		      ShowPoint();
		      drowLine('blue',4,1);
	    },300);
	     //id siteCode siteName siteType phone beginLongitude beginLatitude comment
 	    $('#myModal .id').val(conObj.id);
 	    $('#myModal .siteCode').val(conObj.siteCode);
 	    $('#myModal .siteName').val(conObj.siteName);
		//var siteType = $("#siteType option:contains('"+conObj.siteType+"')").val();
		//$('#myModal #siteType').selectpicker('val',siteType);
		$('#myModal #siteType').selectpicker('val',conObj.siteType);
 	    $('#myModal .phone').val(conObj.phone);
 	    $('#myModal #longitude').val(conObj.beginLongitude);
 	    $('#myModal #latitude').val(conObj.beginLatitude);
 	    $('#myModal .comment').val(conObj.comment);
		$('.selectpicker').selectpicker('refresh');
 	})   
}      
// 保存 
$('.saveBtn').click(function(){
  	 save();
})
function save(){
     var siteType = $('#siteType').val();                   
     var siteName = $('.siteName').val();               
     var siteCode = $('.siteCode').val();           
     var phone = $('.phone').val();                        
     var longitude = $("#longitude").val();                   
     var latitude = $("#latitude").val();                     
     var comment = $('.comment').val();    
     var siteTypeName = $('#siteType option:selected').text();    
     console.log('==============');
     console.log(siteTypeName);
     console.log('==============');
     var id = $('.id').val();  
     //id siteCode siteName siteType phone beginLongitude beginLatitude comment
	  $.ajax({
	      type:"post",
	      url:"/siteDefine/addSiteDefine",
	       data:{
	       	   'id':id,
	    	   'siteCode':siteCode,
	    	   'siteName':siteName,
	    	   'siteType':siteType,
	    	   'siteTypeName':siteTypeName,
	    	   'phone':phone,
	    	   'beginLongitude':longitude,
	    	   'beginLatitude':latitude,
	    	   'comment':comment,
	    	   'picPath':siteType
	       },
	      async:true,
	      dataType:'json',
	      success:function(res){
	    	  dataList(1);
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

