	/*
 	
 	Created by wy on 2017/6/20.  信息库和信息发布里边的添加时功能
 	
 	*/
$(function(){
	
	//命令节目类型
	commandType('#commandType1');
		
	 //点击添加时清空
    $('.addBtn').click(function(){
    	$('#previewBar1').css('width',0);
    	$('#previewBar1').css('height',0);
    	$('#previewBarPer').css('width',0);
    	$('#previewBarPer').css('height',0);
    	$('#preview1').html('');
    	$('#myModal input').val('');
    	$('#myModal textarea').val('');
    	$('#myModal .selectpicker').selectpicker('deselectAll');
    })
     //点击添加时清空
    $('.sendAddBtn').click(function(){
    	$('#previewBar1').css('width',0);
    	$('#previewBar1').css('height',0);
    	$('#previewBarPer').css('width',0);
    	$('#previewBarPer').css('height',0);
    	$('#preview1').html('');
    	$('#myModal input').val('');
    	$('#myModal textarea').val('');
    	$('#myModal .selectpicker').selectpicker('deselectAll'); 
    })
    $('.showPreview').click(function(){
    	 previewAdd();
    })
    function previewAdd(){
    	var textAlign1 = {0: "center", 1: "left", 2: "right"};
        // 获取内容
        var text1 = $("textarea[name=content1]").val().replace(/\n/g,"<br />");		
        // 将内容添加到预览框
        $("#preview1").html(text1);		
        // 获取情报板尺寸
        var boardSize1 = $("select[name=boardSize1] option:selected").html().split('*');		
        // 获取字体
        var fontFamily1 = $("select[name=font1] option:selected").html();		
        // 获取字体大小
        var fontSize1 = $("select[name=fontSize1] option:selected").html();		
        // 获取字体颜色
        var fontColor1 = $("select[name=fontColor1] option:selected").html();
        var color1 = "";
        switch (fontColor1) {
            case "红色":
            	color1 = "#FF0000";
                break;
            case "绿色": // 绿色 	
            	color1 = "#00FF00";
                break;
            case "蓝色": // 蓝色	
            	color1 = "#0000FF";
                break;
            case "黄色": // 黄色	
            	color1 = "#FFFF00";
        		break;
            case "紫色": // 紫色	
             	color1 = "#4B0082";
            	break;
            case "青色": // 青色	
            	color1 = "#00FFFF";
            	break;
           case "白色": // 白色	
        	   	color1 = "#FFFFFF";
        	  	break;
           default: // 黑色	
        	   	color1 = "#000000";
        	  	break;
        }		
        // 对其方式
        var align1 = $("select[name=align1] option:selected").val();
        // 预览框写入css
        $("#preview1").css("color", color1);
        $("#preview1").css("fontFamily", fontFamily1);
        $("#preview1").css("font-size", fontSize1 + "px");
        $("#preview1").css("line-height", fontSize1 + "px");
        $("#preview1").css("display","inline-block");
        $("#previewBar1").css("vertical-align","middle");
        $("#previewBar1").css("display","table-cell");
        $("#previewBar1").css("text-align", textAlign1[align1]);	      
        $("#previewBar1").css("width",boardSize1[0]);
        $("#previewBar1").css("height",parseInt(boardSize1[1]));
        $("#previewBarPer").css("width",boardSize1[0]);
        $("#previewBarPer").css("height",parseInt(boardSize1[1]));
        $("#previewBarPer").css("background",'#000'); 
        //功能描述：验证预览内容的合法性
        var maxLine = (parseInt(boardSize1[1]))/fontSize1;	//最大行数
		var maxRow = boardSize1[0]/fontSize1*2;		//最大列数
		var nrArray = text1.split('<br />');
		if(nrArray.length > maxLine){
			
			var box = $("#error");
            box.addClass("open");
            $('.tip').html('最多可以输入' + maxLine + '行，<br />您输入了' + nrArray.length + '行，<br />超出信息将被丢失，是否继续?');
            box.find(".mb-control-yes").on("click",function(){
              box.removeClass("open");
              return true;
            })
			box.find(".mb-control-close").on("click",function(){
              box.removeClass("open");
              return false;
            })
			/*if(confirm('最多可以输入' + maxLine + '行，您输入了' + nrArray.length + '行，超出信息将被丢失，是否继续？'))
			{
				return true;
			}
			else
			{
				return false;
			}*/
		}
		for(var line = 0; line < nrArray.length; line++){
			if(getStrByteLength(nrArray[line]) > maxRow){
				var box = $("#error");
	            box.addClass("open");
	            $('.tip').html('第' + (line + 1) + '行输入的字数超过最大限值，<br />最多可以输入' + (maxRow/2) + '个汉子，<br />或'+maxRow+'个英文字符，<br />超出信息将被丢失，是否继续?');
	            box.find(".mb-control-yes").on("click",function(){
	              box.removeClass("open");
	              return true;
	            })
				box.find(".mb-control-close").on("click",function(){
	              box.removeClass("open");
	              return false;
	            })
				
				/*if(confirm('第' + (line + 1) + '行输入的字数超过最大限值，\r\n最多可以输入' + (maxRow/2) + '个汉子，\r\n或'+maxRow+'个英文字符，\r\n超出信息将被丢失，是否继续？'))
				{
					return true;
				}
				else
				{
					return false;
				}*/
			}
		}
    }
			
	
	/*
	 功能描述：获取字符串的字节长度。汉子占两位，英文占一位
	 修改内容：创建
	 传入参数： 要获取长度的字符串
	 传出参数：字符串的字节长度
	 */
	function getStrByteLength(str)
	{
		var strArray = str.split("");
		var myReg = /^[\u4e00-\u9fa5]+$/;
		var length = 0;
		for(var i=0; i<strArray.length;i++)
		{
			if (myReg.test(strArray[i]))
			{
				length++;
			}
			length++;
		}
		return length;
	}		
	//坐标对象
	function CalculatingCoordinatePo(postX,postY,wordSpace){
		this.postX = postX;
		this.postY = postY;
		this.wordSpace = wordSpace;
	} 
	//计算坐标
	function CalculatingCoordinate(contentStr,width,height,fontsize,fontalign){
		var calculatingCoordinateArray = new Array();
		var nrArray = contentStr.replace(/\n/g,"<br />").split('<br />');	//内容
		var lineCount = nrArray.length;	//行数
		var contentLength = 0;
		for(var line = 0; line < nrArray.length; line++){
			var fPostX = 0;
			var fPostY = 0;
			var wordSpace = 0;
			//下发内容
			var content = nrArray[line];
			contentLength = getStrASCIILength(nrArray[line]);
			//坐标
			//Y坐标
			//Y坐标为横向居中显示
			//计算文字Y坐标
			fPostY = (height - lineCount*fontsize)/2 + line*fontsize;
			
			//X坐标
			//居左
			if(fontalign == 1)
			{
				fPostX = 0; 
			}
			//居右
			else if(fontalign == 2)
			{
				fPostX = width - fontsize/2*contentLength;
			}
			//居中
			else if(fontalign ==0)
			{
				fPostX = (width - fontsize/2*contentLength)/2;
			}
			var calculatingCoordinatePoObj = new CalculatingCoordinatePo(fPostX,fPostY,wordSpace);
			calculatingCoordinateArray[line] = calculatingCoordinatePoObj;
		}
		return calculatingCoordinateArray;
	}
	
	
	/*
	 功能描述：获取字符串的ASCII长度，汉字占两位，英文占一位
	 修改内容：创建
	 传入参数： str：获取长度的字符串
	 传出参数：字符串长度
	 */
	function getStrASCIILength(str){
		var length= 0;
		var myReg = /^[\u4e00-\u9fa5]+$/;
		var chk = 0;
		for(var k = 0; k < str.length; k++)
		{
			chk = str.charCodeAt(k);
			if(chk > 177)
			{
				length++;
				length++;
			}
			else
			{
				length++;
			}
		}
		return length;
	}
			
	
	
	//信息库的保存提交
	$('.saveBtn').on('click',function(){
		var id = $('.rowId').val();
		var commandType = $("#commandType1 option:selected").val();
		var boardSize = $("#boardSize1 option:selected").html();
		var font = $("#font1").val();
		var fontSize = $("#fontSize1 option:selected").val();
		var fontColor = $("#fontColor1 option:selected").val();
		var align = $("#align1 option:selected").val();
		var enter = $("#enter1 option:selected").val();
		//var out = $("#out1 option:selected").val();
		var time = $("#time1").val();
		var con = $(".content1").val();
		var boardSizeHtml = $("#boardSize1 option:selected").html();
		var arrs = CalculatingCoordinate(con,boardSizeHtml.split('*')[0],boardSizeHtml.split('*')[1],$(".fontSize1 option:selected").html(),align);
		console.log(con,boardSizeHtml.split('*')[0],boardSizeHtml.split('*')[1],$(".fontSize1 option:selected").html(),align);
		console.log(arrs);
		var conArray = con.replace(/\n/g,"<br />").split('<br />');	 //内容
		var previewConAngXy = [];
		for(var i = 0;i<conArray.length;i++){
			previewConAngXy.push({'x':arrs[i].postX,'y':arrs[i].postY,'content':conArray[i]});
		}
		console.log(arrs);
		console.log('================');
		console.log(previewConAngXy);
		console.log('================');
		console.log(time);
		 $.ajax({
          type:"post",
          url:'/informationBoard/add',          
          data:JSON.stringify({
        	    "id" : id,
        	    "deviceType" : boardSize,
        	    "commandType" : commandType,
        	    "stayTime" : time,
        	    "enter" : enter,
        	   // "leavess" : out,
        	    "contents" :previewConAngXy,
        	    "font" : font,
        	    "fontSize" : fontSize,
        	    "fontFrontColor" : fontColor,
        	    "align" : align,
        	    "content":con
          }),
          async:true,
          contentType:"application/json",
          dataType:'json',
          success:function(res){
        		var box = $("#mb-remove-row2");
   	    	  	box.addClass("open");
	   	        setTimeout(function(){
	   	          box.removeClass("open")
	   	        },1000);
	   	        informationBase(1);
          },
          error:function(res){
            console.log(res);
          }     
        });   
	})
	//下发信息列表的保存提交
	$('.sendSaveBtn').on('click',function(){
		var orderBoardId = $("#orderBoardSize option:selected").val(); 
		var id = $('.rowId').val();
		var commandType = $("#commandType1 option:selected").html();
		var boardSize = $("#boardSize1 option:selected").html();
		var font = $("#font1").val();
		var fontSize = $("#fontSize1 option:selected").val();
		var fontColor = $("#fontColor1 option:selected").val();
		var align = $("#align1 option:selected").val();
		var enter = $("#enter1 option:selected").val();
		var out = $("#out1 option:selected").val();
		var time = $(".time1").val();
		var con = $(".content1").val();
		var boardSizeHtml = $("#boardSize1 option:selected").html();
		var arrs = CalculatingCoordinate(con,boardSizeHtml.split('*')[0],boardSizeHtml.split('*')[1],$(".fontSize1 option:selected").html(),align);
		var conArray = con.replace(/\n/g,"<br />").split('<br />');	 //内容
		var previewConAngXy = [];
		for(var i = 0;i<conArray.length;i++){
			previewConAngXy.push({'x':arrs[i].postX,'y':arrs[i].postY,'content':conArray[i]});
		}
		
		$.ajax({
	          type:"post",
	          url:'/informationBoard/sendMessageAdd',          
	          data:JSON.stringify({
	        	  	"deviceCode":orderBoardId,    //哪个情报板
	        	    "id" : id,
	        	    "deviceType" : boardSize,
	        	    "commandType" : commandType,
	        	    "stayTime" : time,
	        	    "enter" : enter,
	        	    "leavess" : out,
	        	    "contents" :previewConAngXy,
	        	    "font" : font,
	        	    "fontSize" : fontSize,
	        	    "fontFrontColor" : fontColor,
	        	    "align" : align,
	        	    "content":con
	          }),
	          async:true,
	          contentType:"application/json",
	          dataType:'json',
	          success:function(res){
	        		var box = $("#mb-remove-row2");
	   	    	  	box.addClass("open");
		   	        setTimeout(function(){
		   	          box.removeClass("open")
		   	        },1000);
		   	        informationBase1(1);
	          },
	          error:function(res){
	            console.log(res);
	          }     
	        });   
		 
	})
})


 