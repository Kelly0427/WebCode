     //发布人
	 findAllUser('#publisher');
     var size = 10;
     // 选择查询后分页
     var cmsName,publisher = null;
      $('.search').bind('click',function(){
      	cmsName = $('.cmsName').val();
      	publisher = $('#publisher').val();
        informationBase(1,size,cmsName,publisher);  
      });
        var nowNum;
        var coefficient = 0.7;
		informationBase(1,size,'','');
		function informationBase(num,size,cmsName,publisher) {
			ShowLoading();
			nowNum = num;
			$.ajax({
				url: "/informationBoard/findSendedLog",
				type: "get",
				dataType: "json",
				data:{
					'page':num-1,
		            'size':size,
		            'deviceName':cmsName,
		            'userName':publisher
		          
				},
				success: function(data) {
					 HiddenLoading();	
					 console.log(data);
		             var val = data.content;
		             var tabelPage = '';
		             $.each(val,function(index,item){ 
	                	var deviceType = String(item.deviceType);
	                	var deviceTypeWidth = deviceType.split('*')[0]*coefficient;
	                	var deviceTypeHeight = deviceType.split('*')[1]*coefficient;
	                	var fontSize = switchFontSize(item.fontSize)*coefficient;
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
	                  tabelPage+='<tr><td style="text-align:left;"><input type="hidden" name="id[]" value="'
		          		  +item.id+'" class="self-input itemId"/><span class="self-id">'
		          		  +(index+1)+'</span></td><td>'
		          		  +item.deviceName+'</td><td>'
		          		  +item.content+'</td><td class="font">'
		          		  +switchFont(item.font)+'</td><td class="fontSize">'+switchFontSize(item.fontSize)+'</td><td class="fontFrontColor">'
		                  +switchColorWord(item.fontFrontColor)+'</td><td class="stayTime">'+stayTime+'</td><td class="enter">'+switchEnterAndOut(item.enter)
		                  +'</td><td class="align">'
		                  +switchAlignCss(item.align)+'</td><td><div class="previewBar" style="text-align:'
		                  +switchAlignWord(item.align)+';width:'+deviceTypeWidth+'px;height:'
		                  +deviceTypeHeight+'px;background:#000;margin:0 auto;"><div class="preview" style="font-size:'
		                  +fontSize+'px;line-height:'+fontSize+'px;color:'
		                  +switchColorCss(item.fontFrontColor)+';font-family:'+switchFont(item.font)+';position: relative;top: 50%;transform: translateY(-50%);">'
		                  +content+'</div></div></td><td class="operator">'+item.operator+'</td><td class="sendTime">'
		                  +sendTime+'</td><td class="commandType" style="display:none;">'
		                  +item.commandType+'</td><td class="deviceType" style="display:none;">'
		                  +item.deviceType+'</td></tr>';
	                });
		            $('.selfTbody').html(tabelPage);
		            
					//分页
					$("#page").paging({
						pageNo: num,
						totalPage: data.totalPages,
						totalSize: data.totalElements,
						callback: function(num) {
							informationBase(num,size,cmsName,publisher);
						}
					})
				},
				error:function(data) {
					HiddenLoading();	
					var box = $("#mb-remove-none");
		            box.addClass("open");
		            $('.noneCon').html('操作失败！');
		            box.find(".mb-control-yes").on("click",function(){
		                 box.removeClass("open");
		            })
				}
			})
		}
     
	      
     // 点击删除
      $('.deleteBtn').click(function(){
     	  var deleteId = new Array();                             
          $("input[name='id[]']:checked").each(function() { 
          	deleteId.push($(this).val());        	
          })
          if(deleteId.length > 0){
            var box = $("#mb-remove-row");
	        box.addClass("open");
	        box.find(".mb-control-yes").off("click").on("click",function(){
	        	 box.removeClass("open");
	        	 informationBoardDelete(deleteId);
	        });
	        box.find(".mb-control-close").on("click",function(){
	            box.removeClass("open");
	        });
          }else{
         	  var box = $("#mb-remove-none");
              box.addClass("open");
              $('.noneCon').html('请选择删除项！');
              box.find(".mb-control-yes").on("click",function(){
                   box.removeClass("open");
               })
          }
      }) 
   function informationBoardDelete(deleteId){
   		$.ajax({
            type:"delete",
            url:"/informationBoard/delete?ids="+deleteId,          
            async:true,
            dataType:'json',
            success:function(res){
            	var box = $("#mb-remove-row1");
     	        box.addClass("open");
     	        setTimeout(function(){
     	          box.removeClass("open")
     	        },1000);
	            informationBase(nowNum,size,commandTypeSearch);                   
            	$("input[name='id1[]']").prop("checked",false);
            },
            error:function(res){
            	var box = $("#mb-remove-error");
                box.addClass("open");
                box.find(".mb-control-yes").on("click",function(){
                     box.removeClass("open");
                })
            }     
        }); 
   }
      
  //点击信息内容展示详情
  function modalFun(){
     	$('.content').click(function(){
     		var thisParent = $(this).parent().parent(); 
     		$('.selectpicker').selectpicker('deselectAll');
     		$('#myModal .rowId').val(thisParent.find('.itemId').val());
     		
     		var commandTypeOption = thisParent.find('.commandType').html();
     	    $('#myModal #commandType1').selectpicker('val',commandTypeOption);
     	    
     	    var deviceTypeOption = thisParent.find('.deviceType').html();
     	    console.log(deviceTypeOption);
			var deviceTypeOptionVal = $("#boardSize1 option:contains('"+deviceTypeOption+"')").val();
    	    $('#myModal #boardSize1').selectpicker('val',deviceTypeOptionVal);
    	    
    	    var fontOption = thisParent.find('.font').html();
    	    var fontOptionVal = switchFontVal(fontOption);
    	    $('#myModal #font1').selectpicker('val',fontOptionVal);
    	    
    	    var fontSizeOption = thisParent.find('.fontSize').html();
    	    var fontSizeOptionVal = switchFontSizeVal(fontSizeOption);
    	    $('#myModal #fontSize1').selectpicker('val',fontSizeOptionVal);
    	    
    	    var fontFrontColorOption = thisParent.find('.fontFrontColor').html();
    	    var fontFrontColorOptionVal = switchColorWordVal(fontFrontColorOption);
    	    $('#myModal #fontColor1').selectpicker('val',fontFrontColorOptionVal);
    	    
    	    var content = thisParent.find('.content').html(); 
     	    $('#myModal textarea[name=content1]').val(thisParent.find('.content').html());
     	    
     	   var alignOption = thisParent.find('.align').html();
     	   var alignOptionVal = switchAlignVal(alignOption);
     	   $('#myModal #align1').selectpicker('val',alignOptionVal);
     	    
     	   var enterOption = thisParent.find('.enter').html();
     	   var enterOptionVal = switchEnterAndOutVal(enterOption);
    	   $('#myModal #enter1').selectpicker('val',enterOptionVal);
     	   
    	   
     	   $('#myModal .time1').val(thisParent.find('.stayTime').html());
   	        
     	   $('.selectpicker').selectpicker('refresh');	 
       	   $('.selectpicker').selectpicker('render');
       	   //预览
   	       preview(content,deviceTypeOption,fontOption,fontSizeOption,fontFrontColorOption,alignOption);
  	  
     	})   
	}   

     