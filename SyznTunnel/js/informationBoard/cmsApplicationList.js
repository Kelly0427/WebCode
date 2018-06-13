//时间选择器---年月日
$('.applicationTime').datetimepicker({
	language:  'zh',
    format: 'yyyy-mm-dd',
    todayBtn:  1,
    autoclose: 1,
    todayHighlight: 1,
    clearBtn:true,
    container: '#myModal'
});
//开始时间大于结束时间
//开始时间的插件
$("#startTime").datetimepicker({
     language:  'zh',
   	 format: 'yyyy-mm-dd',
     todayBtn:  1,
     autoclose: 1,
     startView: 2,
     minView: 4, 
     todayHighlight: 1,
     clearBtn:true
}).on('changeDate',function(ev){
var starttime=$("#startTime").val();
$("#endTime").datetimepicker('setStartDate',starttime);
     $("#startTime").datetimepicker('hide');
});
//结束时间的插件 
$("#endTime").datetimepicker({
     language:  'zh',
     format: 'yyyy-mm-dd',
     todayBtn:  1,
     autoclose: 1,
     startView: 2,
     minView: 4, 
     todayHighlight: 1,
     clearBtn:true
}).on('changeDate',function(ev){
     var starttime=$("#startTime").val();
     var endtime=$("#endTime").val();
     $("#startTime").datetimepicker('setEndDate',endtime);
     $("#endTime").datetimepicker('hide'); 
});

//全选
$("#checkAll").click(function(){
    $("input[name='id[]']").prop("checked",this.checked);
})
var urlFag=0; //0的时候默认初始化 加载所有数据    1的时候加载要发布的方案
var setOverId=0;//作废的申请表Id
var nowNum;
var formCmsApplicationData = localStorage.getItem('formCmsApplicationData');
	console.log(formCmsApplicationData);
if(formCmsApplicationData == '[]' || formCmsApplicationData == ''){
	dataList(1);
}else{
	formCmsApplication(JSON.parse(formCmsApplicationData));
}
function formCmsApplication(data){
      //  var val = data.content;
      var tabelPage = '';
      $.each(data,function(index,item){    
	  		var endTime;
			if(item.endTime == null){
				endTime = '';
			}else{
				endTime = formatDate1(new Date(item.endTime));
			}
	  		var startTime;
			if(item.startTime == null){
				startTime = '';
			}else{
				startTime = formatDate1(new Date(item.startTime));
			}
	  		var isObsolete;
			if(item.isObsolete == 0){
				isObsolete = '未过期';
			}else{
				isObsolete = '已过期';
			}
	   	  var conJson = JSON.stringify(item);
		  tabelPage+='<tr><td style="text-align:left;"><input type="hidden" name="id[]" value="'+item.id+'" class="self-input itemId"/>';
		  tabelPage+='<span class="self-id">'+(index+1)+'</span></td><td>';
		  if(isObsolete == '已过期'){
			  tabelPage+="<a href='' class='content' data-target='#myModal' data-toggle='modal' conJson='"+conJson+"'>"+item.applicationCode+"</a>";
		  }else{
			  tabelPage+="<a href='/informationBoard/cmsApplication' target='right' class='contentEdit' conJson='"+conJson+"' onclick='contentEditFun(this)'>"+item.applicationCode+"</a>";
		  }
	      tabelPage+='</td><td>'+(item.groupOrder == null?" ":item.groupOrder)+'</td><td>'
	      		+startTime+'</td><td>'+endTime+'</td><td>'+item.applicationUnit+'</td><td>'+item.applicant+'</td><td>'
	            +isObsolete+'</td>'; 
	      if(item.isObsolete == 0){
	      //		tabelPage+='<td><a style="cursor:pointer;" onclick="publich(this)" applicationCode='+item.applicationCode+'>发布</a></td></tr>';
	    	  tabelPage+='<td><a style="cursor:pointer;" onclick="publich(this)" applicationCode='+item.id+'>发布</a>|<a style="cursor:pointer;" onclick="setIsObsolete(this)" applicationCode='+item.id+'>作废</a></td></tr>';
	      
	      }else{
	      		tabelPage+='<td></td></tr>';
	      }
	});
    $('.selfTbody').html(tabelPage);
    localStorage.setItem('formCmsApplicationData','');
}




function dataList(num,startTime,endTime,applicationUnit,isObsolete) {
	ShowLoading();
	console.log(urlFag);
	nowNum = num;
	//加载预备的信息
	if(urlFag==1){
				$.ajax({
				url: "/lzinformationBoard/sendPlan",
				type: "get",
				dataType: "json",
				data:{
					//'ids':$(btn).attr('applicationCode')
					'id':setOverId
				},
				success: function(data) {
					  console.log(data);
					  HiddenLoading();
		            //  var val = data.content;
		              var tabelPage = '';
		              $.each(data,function(index,item){    
		              		var endTime;
							if(item.endTime == null){
								endTime = '';
							}else{
								endTime = formatDate1(new Date(item.endTime));
							}
		              		var startTime;
							if(item.startTime == null){
								startTime = '';
							}else{
								startTime = formatDate1(new Date(item.startTime));
							}
		              		var isObsolete;
							if(item.isObsolete == 0){
								isObsolete = '未过期';
							}else{
								isObsolete = '已过期';
							}
		               	  var conJson = JSON.stringify(item);
		            	  tabelPage+='<tr><td style="text-align:left;"><input type="hidden" name="id[]" value="'+item.id+'" class="self-input itemId"/>';
		            	  tabelPage+='<span class="self-id">'+(index+1)+'</span></td><td>';
		            	  tabelPage+="<a href='' class='content' data-target='#myModal' data-toggle='modal' conJson='"+conJson+"'>";
			              tabelPage+=item.applicationCode+'</a></td><td>'+(item.groupOrder == null?" ":item.groupOrder)+'</td><td>'
			              		+startTime+'</td><td>'+endTime+'</td><td>'+item.applicationUnit+'</td><td>'+item.applicant+'</td><td>'
			                    +isObsolete+'</td>'; 
		                  if(item.isObsolete == 0){
		                  //		tabelPage+='<td><a style="cursor:pointer;" onclick="publich(this)" applicationCode='+item.applicationCode+'>发布</a></td></tr>';
		                	  tabelPage+='<td><a style="cursor:pointer;" onclick="publich(this)" applicationCode='+item.id+'>发布</a>|<a style="cursor:pointer;" onclick="setIsObsolete(this)" applicationCode='+item.id+'>作废</a></td></tr>';
		                  
		                  }else{
		                  		tabelPage+='<td></td></tr>';
		                  }
		          	});
             			$('.selfTbody').html(tabelPage);
					}
				});
             	$('#page').hide();
	         }
			else{
					$.ajax({
						url: "/informationBoard/cmsGroupQueryList",
						type: "get",
						dataType: "json",
						data:{
							'page':num-1,
				            'size':13,
				            'startTime':startTime,
				            'endTime':endTime,
				            'applicationUnit':applicationUnit,
				            'isObsolete':isObsolete
						},
						success: function(data) {
							  console.log(data);
							  HiddenLoading();
				              var val = data.content;
				              var tabelPage = '';
				              $.each(val,function(index,item){    
				              		var endTime;
									if(item.endTime == null){
										endTime = '';
									}else{
										endTime = formatDate1(new Date(item.endTime));
									}
				              		var startTime;
									if(item.startTime == null){
										startTime = '';
									}else{
										startTime = formatDate1(new Date(item.startTime));
									}
				              		var isObsolete;
									if(item.isObsolete == 0){
										isObsolete = '未过期';
									}else{
										isObsolete = '已过期';
									}
				               	  var conJson = JSON.stringify(item);
				            	  tabelPage+='<tr><td style="text-align:left;"><input type="hidden" name="id[]" value="'+item.id+'" class="self-input itemId"/>';
				            	  tabelPage+='<span class="self-id">'+(index+1)+'</span></td><td>';
				            	  
				            	  
				            	  if(isObsolete == '已过期'){
									  tabelPage+="<a href='' class='content' data-target='#myModal' data-toggle='modal' conJson='"+conJson+"'>"+item.applicationCode+"</a>";
								  }else{
									  tabelPage+="<a href='/informationBoard/cmsApplication' target='right' class='contentEdit' conJson='"+conJson+"' onclick='contentEditFun(this)'>"+item.applicationCode+"</a>";
								  }
				            	  
				            	 // tabelPage+="<a href='' class='content' data-target='#myModal' data-toggle='modal' conJson='"+conJson+"'>";
					              tabelPage+='</td><td>'+(item.groupOrder == null?" ":item.groupOrder)+'</td><td>'
					              		+startTime+'</td><td>'+endTime+'</td><td>'+item.applicationUnit+'</td><td>'+item.applicant+'</td><td>'
					                    +isObsolete+'</td>'; 
				                  if(item.isObsolete == 0){
				                  //		tabelPage+='<td><a style="cursor:pointer;" onclick="publich(this)" applicationCode='+item.applicationCode+'>发布</a></td></tr>';
				                	  tabelPage+='<td><a style="cursor:pointer;" onclick="publich(this)" applicationCode='+item.id+'>发布</a> | <a style="cursor:pointer;" onclick="setIsObsolete(this)" applicationCode='+item.id+'>作废</a></td></tr>';
				                  
				                  }else{
				                  		tabelPage+='<td></td></tr>';
				                  }
				          	});
				              $('.selfTbody').html(tabelPage);
				            modalFun();
							//分页
							$('#page').show();
							$("#page").paging({
								pageNo: num,
								totalPage: data.totalPages,
								totalSize: data.totalElements,
								callback: function(num) {
									dataList(num,$('#startTime').val(),$('#endTime').val(),$('#applicationUnit').val(),$('#isObsolete').val());
								}
							})
						}
					});
				}

				
//	$.ajax({
//		url: "/informationBoard/cmsGroupQueryList",
//		type: "get",
//		dataType: "json",
//		data:{
//			'page':num-1,
//            'size':13,
//            'startTime':startTime,
//            'endTime':endTime,
//            'applicationUnit':applicationUnit,
//            'isObsolete':isObsolete
//		},
//		success: function(data) {
//			  console.log(data);
//			  HiddenLoading();
//              var val = data.content;
//              var tabelPage = '';
//              $.each(val,function(index,item){    
//              		var endTime;
//					if(item.endTime == null){
//						endTime = '';
//					}else{
//						endTime = formatDate(new Date(item.endTime));
//					}
//              		var startTime;
//					if(item.startTime == null){
//						startTime = '';
//					}else{
//						startTime = formatDate(new Date(item.startTime));
//					}
//              		var isObsolete;
//					if(item.isObsolete == 0){
//						isObsolete = '未过期';
//					}else{
//						isObsolete = '已过期';
//					}
//               	  var conJson = JSON.stringify(item);
//            	  tabelPage+='<tr><td style="text-align:left;"><input type="hidden" name="id[]" value="'+item.id+'" class="self-input itemId"/>';
//            	  tabelPage+='<span class="self-id">'+(index+1)+'</span></td><td>';
//            	  tabelPage+="<a href='' class='content' data-target='#myModal' data-toggle='modal' conJson='"+conJson+"'>";
//	              tabelPage+=item.applicationCode+'</a></td><td>'+item.groupOrder+'</td><td>'
//	              		+startTime+'</td><td>'+endTime+'</td><td>'+item.applicationUnit+'</td><td>'+item.applicant+'</td><td>'
//	                    +isObsolete+'</td>'; 
//                  if(item.isObsolete == 0){
//                  //		tabelPage+='<td><a style="cursor:pointer;" onclick="publich(this)" applicationCode='+item.applicationCode+'>发布</a></td></tr>';
//                	  tabelPage+='<td><a style="cursor:pointer;" onclick="publich(this)" applicationCode='+item.id+'>发布</a>|<a style="cursor:pointer;" onclick="setIsObsolete(this)" applicationCode='+item.id+'>作废</a></td></tr>';
//                  
//                  }else{
//                  		tabelPage+='<td></td></tr>';
//                  }
//          	});
// $('.selfTbody').html(tabelPage);
// modalFun();
// //分页
// $("#page").paging({
// pageNo: num,
// totalPage: data.totalPages,
// totalSize: data.totalElements,
// callback: function(num) {
// dataList(num,$('#startTime').val(),$('#endTime').val(),$('#applicationUnit').val(),$('#isObsolete').val());
// }
// })
//		}
//	})
}	   
//查询
$('.search').click(function(){
    dataList(1,$('#startTime').val(),$('#endTime').val(),$('.applicationUnitSearch').val(),$('#isObsolete').val());  
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
 		$('.afterHtml').remove();
 		var conObj = JSON.parse($(this).attr('conJson'));
 		console.log(conObj);
 		var endTime;
		if(conObj.endTime == null){
			endTime = '';
		}else{
			endTime = formatDate(new Date(conObj.endTime));
		}
  		var startTime;
		if(conObj.startTime == null){
			startTime = '';
		}else{
			startTime = formatDate(new Date(conObj.startTime));
		}
  		var saveTime;
		if(conObj.saveTime == null){
			saveTime = '';
		}else{
			saveTime = formatDate(new Date(conObj.saveTime));
		}
 		$('.applicationNumber').val(conObj.applicationCode);
 		$('.applicationUnit').val(conObj.applicationUnit);
 		$('.applicationPerson').val(conObj.applicant);
 		$('.applicationTime').val(saveTime);
 		$('.startTime').val(startTime);
 		$('.endTime').val(endTime);
 		$('.releaseReason').val(conObj.applicantReason);
 		$('.releasePriority').val((conObj.groupOrder == null?" ":conObj.groupOrder));
 		//$('.releaseSite').text(conObj.publishStation);
 		console.log(conObj);
 		var contentArr = [];
 		$.each(conObj.cmsContentEditTemporaryGroup,function(index,item){   
 			contentArr.push(item.content);
 		})
 		$('.releaseConTd').val(unique(contentArr));
		var html = '';
		console.log(conObj.callBackDisplay);
 		$.each(conObj.callBackDisplay,function(index,item){ 
 			html += '<tr class="afterHtml"><td class="textRight">申请信息发布位置</td><td class="releaseSite" style="max-width:250px;">'+item.split('///')[0]+'</td><td class="textRight tableThWidth">信息发布内容</td><td colspan="4" class="releaseConTd">'+item.split('///')[1]+'</td></tr>';
		})
		
		$('.nextCon').after(html);
 	})
}  
//作废

function setIsObsolete(btn){
	var box = $("#mb-remove-row");
    box.addClass("open");
    box.find(".mb-control-yes").off("click").on("click",function(){
    	box.removeClass("open");
		console.log($(btn).attr('applicationCode'));
		var tempIds=new Array();
		tempIds.push($(btn).attr('applicationCode'));
		var id=$(btn).attr('applicationCode');
		$.ajax({
			url: "/lzinformationBoard/updateIsObsolete",
			type: "get",
			dataType: "json",
			data:{
				//'ids':$(btn).attr('applicationCode')
				'ids':tempIds
			},
			success: function(data) {
				var box = $("#box");
		        box.addClass("open");
		        box.find('.faIcon').addClass('fa-check').removeClass('fa-times');
		        box.find('.fontCon').html('作废成功！请重新选择信息进行发布！');
		        box.find('.mb-footer').hide();
		        setTimeout(function(){
	          		box.removeClass("open")
	    		},1000);
		        
		        urlFag=1; //0的时候默认初始化 加载所有数据    1的时候加载要发布的方案
		        setOverId=id;
		        dataList(1);
		        urlFag=0;
			},
			error:function(data){
				var box = $("#box");
		        box.addClass("open");
		        box.find('.faIcon').removeClass('fa-check').addClass('fa-times');
		        box.find('.fontCon').html('作废失败请，重新操作！');
		        box.find('.mb-footer').show();
		        box.find(".mb-control-yes").on("click",function(){
		          box.removeClass("open");
		        })
			}
		})
	});
    box.find(".mb-control-close").off("click").on("click",function(){
        box.removeClass("open");
    });
}


function publich(btn){
	var box = $("#mb-publish-row");
    box.addClass("open");
    box.find(".mb-control-yes").off("click").on("click",function(){
    	box.removeClass("open");
		console.log($(btn).attr('applicationCode'));
		var tempIds=new Array();
		tempIds.push($(btn).attr('applicationCode'));
		
		$.ajax({
			url: "/informationBoard/cmsGroupListSend",
			type: "get",
			dataType: "json",
			data:{
				//'ids':$(btn).attr('applicationCode')
				'ids':tempIds
			},
			success: function(data) {
				var box = $("#box");
		        box.addClass("open");
		        box.find('.faIcon').addClass('fa-check').removeClass('fa-times');
		        box.find('.fontCon').html('下发信息成功！');
		        box.find('.mb-footer').hide();
		        setTimeout(function(){
	          		box.removeClass("open")
	    		},1000);
			},
			error:function(data){
				var box = $("#box");
		        box.addClass("open");
		        box.find('.faIcon').removeClass('fa-check').addClass('fa-times');
		        box.find('.fontCon').html('操作失败请，重新操作！');
		        box.find('.mb-footer').show();
		        box.find(".mb-control-yes").on("click",function(){
		          box.removeClass("open");
		        })
			}
		})
	});
    box.find(".mb-control-close").off("click").on("click",function(){
        box.removeClass("open");
    });
}
function unique(arr){
	if(arr.length>1){
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
}


//未过期的申请单点击编号进入修改页面
function contentEditFun(btn){
	console.log($(btn).attr('conJson'));
	localStorage.setItem('editCon',$(btn).attr('conJson'));
}