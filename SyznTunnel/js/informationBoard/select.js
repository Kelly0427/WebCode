//命令节目类型(search)
function commandType(obj){
	$.ajax({
        type:"get",
        url:"/informationBoard/typeData",
        async:true,
        dataType:'json',
        success:function(res){
              var typeDataOptions = '';
              $.each(res,function(index,item){
            	  typeDataOptions+='<option value="'+item.conName+'">'+item.conName+'</option>'                 
              });
              $(obj).html('<option value="">请选择</option>'+typeDataOptions); 
              $('.selectpicker').selectpicker('refresh');
        },
        error:function(res){
          console.log(res);
        }
      });
}
    
    
//情报板类型
function boardSizeType(obj){
	$.ajax({
        type:"get",
        url:"/device/findAllWidthAndHeight",
        async:false,
        dataType:'json',
        success:function(res){
              var boardSizeTypeOptions = '';
              $.each(res,function(index,item){
            	  boardSizeTypeOptions+='<option value="'+index+'">'+item+'</option>'                 
              });
              
              $(obj).html('<option value="">请选择</option>'+boardSizeTypeOptions); 
              $('.selectpicker').selectpicker('refresh');
        },
        error:function(res){
          console.log(res);
        }
      });
}

//情报板类型Item
function boardSizeTypeItem(obj){
	$.ajax({
        type:"get",
        url:"/device/findAllWidthAndHeight",
        async:false,
        dataType:'json',
        success:function(res){
              var boardSizeTypeOptions = '';
              $.each(res,function(index,item){
            	  boardSizeTypeOptions+='<option value="'+item+'">'+item+'</option>'                 
              });
              
              $(obj).html('<option value="">请选择</option>'+boardSizeTypeOptions); 
              $('.selectpicker').selectpicker('refresh');
        },
        error:function(res){
          console.log(res);
        }
      });
}
function boardSizeType1(obj){
	$.ajax({
        type:"get",
        url:"/device/findAllWidthAndHeight",
        async:false,
        dataType:'json',
        success:function(res){
              var boardSizeTypeOptions = '';
              $.each(res,function(index,item){
            	  boardSizeTypeOptions+='<option value="'+index+'">'+item+'</option>'                 
              });
              
              $(obj).html(boardSizeTypeOptions); 
              $('.selectpicker').selectpicker('refresh');
        },
        error:function(res){
          console.log(res);
        }
      });
}
//发布人
function findAllUser(obj){
	$.ajax({
        type:"get",
        url:"/informationBoard/findAllUser",
        async:false,
        dataType:'json',
        success:function(res){
              var boardSizeTypeOptions = '';
              $.each(res,function(index,item){
            	  boardSizeTypeOptions+='<option value="'+item.realName+'">'+item.realName+'</option>'                 
              });
              
              $(obj).html('<option value="">请选择</option>'+boardSizeTypeOptions); 
              $('.selectpicker').selectpicker('refresh');
        },
        error:function(res){
          console.log(res);
        }
      });
}    