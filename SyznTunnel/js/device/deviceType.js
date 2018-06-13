 deviceTpyePar("#deviceType");
 deviceTpyePar("#deviceTypeSearch");
 //点击添加按钮清空列表
  $('.addBtn').click(function(){
	 	$('#myModal input').val('');	
	 	$('#myModal textarea').val('');
		$('.selectpicker').selectpicker('deselectAll');
		$('.selectpicker').selectpicker('refresh'); 
	 	$('#myModal').modal('show');
  })
       
//全选
$("#checkAll").click(function(){
    $("input[name='id[]']").prop("checked",this.checked);
})
 	
var nowNum;
dataList(1);
function dataList(num) {
	nowNum = num;
	$.ajax({
		url: "/device/deviceTypeData",
		type: "get",
		dataType: "json",
		data:{
			'page':num-1,
            'size':13,
            'Typename':$('#deviceTypeSearch').val(),
            'typeCode':$('#typeCodeSearch').val()
		},
		success: function(data) {
				console.log(data);
			  var val = data.content;
              var tabelPage = '';
              $.each(val,function(index,item){    
              	 var conJson = JSON.stringify(item);
            	  tabelPage+='<tr><td><input type="checkbox" name="id[]" value="'
            	  	+item.id+'" class="self-input itemId"/><span class="self-id">'
            	  	+(index+1)+'</span></td><td>';
        	  	 tabelPage+="<a href='' class='content' data-target='#myModal' data-toggle='modal' conJson='"+conJson+"'>";
            	 tabelPage+=item.typeCode+'</a></td><td>'+item.typeName+'</td><td>'
            	  	+item.types+'</td><td>'+(item.comment == null ?"":item.comment)+'</td></tr>'
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
    dataList();  
}) 

//模态框
function modalFun(){  			
 	$('.content').click(function(){   
 		var conObj = JSON.parse($(this).attr('conJson'));    	
 	    $('#myModal .id').val(conObj.id);
 	    $('#myModal .typeName').val(conObj.typeName);
 	    $('#myModal .typeCode').val(conObj.typeCode);
		$('#myModal #deviceType').selectpicker('val',conObj.types);
		$('.selectpicker').selectpicker('refresh');
 	})   
}      
// 保存 
$('.saveBtn').click(function(){
  	 save();
})
function save(){
     var TypeName = $('.typeName').val();                           
     var TypeCode = $('.typeCode').val();               
     var Comment = $('.comment').val();            
     var types = $('#deviceType').val();            
     var id = $('.id').val();  
	  $.ajax({
	      type:"post",
	      url:"/device/deviceTypeAdd",
	       data:{
	       		'id':id,
	    	    'TypeName':TypeName,
	    	    'TypeCode':TypeCode,
	    	    'types':types,
	    	    'Comment':Comment
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
