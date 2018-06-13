var whichTr,whichTrPrev;
$(function(){
	//选中的设备
	var getSendId = [];
	for(var i = 0;i<$('.getSendId').size();i++){
	  	getSendId.push($('.getSendId').eq(i).html());
	}
	var deviceCodesList = [];  //群发的设备ID
	//显示给那个情报板发布信息
	deviceList();
	function deviceList(){
		console.log(getSendId);
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
	            $('.selectpicker').selectpicker('refresh');
		    },
		    error:function(res){
		      console.log(res);
		    }     
		}); 
	}
	
	//命令节目类型
	commandType('.bodyInfos #commandType');
	//情报板类型
    boardSizeType('.bodyInfos #boardSize');
	//字体颜色
	for (var i = 0; i < $('.fontColor').length ; i++) {
		var fontColor = $('.fontColor').eq(i).attr('colorAttr');
		$('.fontColor').eq(i).css('background',fontColor);
	}
	//选择颜色
	$('.fontColor').click(function(){
		var thisColor = $(this).attr('colorAttr');
		if($(this).hasClass('borderUnSelect')){
			$(this).parent().siblings().css('border-color','');
			$(this).parent().siblings().children().removeClass('borderSelect').addClass('borderUnSelect');
			$(this).parent().css('border-color',thisColor);

			$(this).removeClass('borderUnSelect').addClass('borderSelect',thisColor);
			console.log($(this).attr('colorAttr'));
			$('.fontColorHidden').text($(this).attr('colorAttr'));
			$('.fontColorIndexHidden').text($(this).attr('index'));
			previewAdd();
		}else{
			$(this).parent().css('border-color','');
			$(this).addClass('borderUnSelect').removeClass('borderSelect');
		}
	})
	//选择字体
	selectItem('.fontFamilyItem');
	//选择字体大小
	selectItem('.fontSizeItem');
	//选择字体对齐方式 1.边框 2.边框内图片
	selectItem('.textAlign');
	selectItemImg('.textAlign');
	function selectItem(obj){
		var selectItemDiv = obj +'Hidden';
		var selectItemIndex = obj +'IndexHidden';
		$(obj).click(function(){
			$(this).siblings().removeClass('blueBorder');
			$(this).addClass('blueBorder');
			$(selectItemDiv).text($(this).text());
			$(selectItemIndex).text($(this).attr('index'));
			previewAdd();
		})
	}
	function selectItemImg(obj){
		$(obj).click(function(){
			var selectItemDiv = obj +'Hidden';
			var selectItemIndex = obj +'IndexHidden';
			$(this).children().attr('src',$(this).children().attr('srcAttr')+'blue.png');
			$(selectItemDiv).text(($(this).children().attr('srcAttr')+'blue.png').replace(/[^\u4e00-\u9fa5]/gi,""));
			$(selectItemIndex).text($(this).children().attr('index'));
			console.log(($(this).children().attr('srcAttr')+'blue.png').replace(/[^\u4e00-\u9fa5]/gi,""));
			for (var i = 0; i < $(this).siblings().children().length ; i++) {
				var thisSrc = $(this).siblings().children().eq(i).attr('srcAttr')+'.png';
				$(this).siblings().children().eq(i).attr('src',thisSrc);

			}
			previewAdd();
		})
	}
	//情报板类型改变时预览
	$('.boardSize').change(function(){
		previewAdd();
	})
	//情报板内容改变时预览
	$(document).on('input propertychange', '.content', function() {
	    previewAdd();
	});
	
	//预览
	var cmsAttr,textAlign,text,boardSize,fontFamily,fontSize,fontColor,align,fontFamilyIndex,fontSizeIndex,fontColorIndex,alignIndex = null;
	function previewAdd(){
    	textAlign = {"居中": "center", "居左": "left", "居右": "right"};
        // 获取内容
        text = $("textarea[name=content]").val().replace(/\n/g,"<br />");		
        // 将内容添加到预览框
        $(".editPart .preview").html(text);		
        // 获取情报板尺寸
        boardSize = $("select[name=boardSize] option:selected").html().split('*');		
        // 获取字体
        fontFamily = $('.fontFamilyItemHidden').text();		
        fontFamilyIndex = $('.fontFamilyItemIndexHidden').text();		
        // 获取字体大小
        fontSize = $('.fontSizeItemHidden').text();		
        fontSizeIndex = $('.fontSizeItemIndexHidden').text();		
        // 获取字体颜色
        fontColor = $('.fontColorHidden').text();
        fontColorIndex = $('.fontColorIndexHidden').text();
       
        // 对其方式
        align = $('.textAlignHidden').text();
        alignIndex = $('.textAlignIndexHidden').text();
        // 预览框写入css
        $(".editPart .preview").css("color", fontColor);
        $(".editPart .preview").css("fontFamily", fontFamily);
        $(".editPart .preview").css("font-size", fontSize + "px");
        $(".editPart .preview").css("line-height", fontSize + "px");
        $(".editPart .preview").css("display","inline-block");
        $(".editPart .previewBar").css("vertical-align","middle");
        $(".editPart .previewBar").css("display","table-cell");
        $(".editPart .previewBar").css("text-align", textAlign[align]);	      
        $(".editPart .previewBar").css("width",boardSize[0]);
        $(".editPart .previewBar").css("height",parseInt(boardSize[1]));
        $(".editPart .previewBarPer").css("width",boardSize[0]);
        $(".editPart .previewBarPer").css("height",parseInt(boardSize[1]));
        $(".editPart .previewBar").css("background",'#000'); 
        $('.editPart .editBtn').css("top",(boardSize[1]-fontSize)/2 + 'px');
        $('.editPart .editBtn').css("left",(parseInt(boardSize[0]) + 14) + 'px');
        //验证预览内容的合法性
        //最大行数
        var maxLine = (parseInt(boardSize[1]))/fontSize;	
        //最大列数
		var maxRow = boardSize[0]/fontSize*2;		
		var nrArray = text.split('<br />');
		if(nrArray.length > maxLine){
			var box = $("#error");
            box.addClass("open");
            $('.tip').html('最多可以输入' + maxLine + '行，<br />您输入了' + nrArray.length + '行，<br />超出信息将被丢失，是否继续？');
            box.find(".mb-control-yes").on("click",function(){
              box.removeClass("open");
              return true;
            })
			box.find(".mb-control-close").on("click",function(){
              box.removeClass("open");
              return false;
            })
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
			}
		}
    }
			
	
	/*
	 功能描述：获取字符串的字节长度。汉子占两位，英文占一位
	 修改内容：创建
	 传入参数： 要获取长度的字符串
	 传出参数：字符串的字节长度
	 */
	function getStrByteLength(str){
		var strArray = str.split("");
		var myReg = /^[\u4e00-\u9fa5]+$/;
		var length = 0;
		for(var i=0; i<strArray.length;i++){
			if (myReg.test(strArray[i])){
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
			if(fontalign == '居左'){
				fPostX = 0; 
			}
			//居右
			else if(fontalign == '居右'){
				fPostX = width - fontsize/2*contentLength;
			}
			//居中
			else if(fontalign == '居中'){
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
		for(var k = 0; k < str.length; k++){
			chk = str.charCodeAt(k);
			if(chk > 177){
				length++;
				length++;
			}
			else{
				length++;
			}
		}
		return length;
	}

	//添加下一条按钮 1.添加到预选区 2.清空编辑区
	var cmsCode = 0;
	$('.addNextMessage').click(function(){
		cmsCode ++;
		addNextMessage($(this));
		clearEditPart();
	})
	//1.添加到预选区
	
	function addNextMessage(obj){
		var con = $(".content").val();
		var arrs = CalculatingCoordinate(con,$("#boardSize option:selected").html().split('*')[0],$("#boardSize option:selected").html().split('*')[1],fontSize,align);
		var conArray = con.replace(/\n/g,"<br />").split('<br />');	 //内容
		var previewConAngXy = [];
		for(var i = 0;i<conArray.length;i++){
			previewConAngXy.push({'x':arrs[i].postX,'y':arrs[i].postY,'content':conArray[i]});
		}
		cmsAttr = {"cmsCode":cmsCode+'cms',"deviceType":$("#boardSize option:selected").html(),"commandType":$(".commandType").val(),"time":$(".time").val(),"enter":$(".enter").val(),"contents":previewConAngXy,"font":fontFamilyIndex,"fontSize":fontSizeIndex,"fontFrontColor":fontColorIndex,"align":alignIndex,"content":$(".content").val()};
		cmsAttr = JSON.stringify(cmsAttr);
		$('.editPart .cloneCms .fa-pencil').attr('cmsAttr',cmsAttr);
		if(obj.attr('cmsCode') == ''){
			$('.finishedMessage').append($('.editPart .cloneCms').clone(true));
			$('.applicationTable .releaseCon').parent().eq(whichTr-3).find('.releaseCon').append($('.editPart .cloneCms').clone(true));

		}else{
			for (var i = 0; i < $('.finishedMessage .fa-pencil').length ; i++) {
				if(cmsCodeForOne == $('.finishedMessage .fa-pencil').eq(i).attr('cmsCode')){
					$('.finishedMessage .fa-pencil').eq(i).parent().parent().parent().html($('.editPart .previewBarPer').clone(true));
					$('.applicationTable .releaseCon .fa-pencil').eq(i).parent().parent().parent().html($('.editPart .previewBarPer').clone(true));
					
				}
			}
		}
		$('.finishedMessage .editBtn').css('display','block');
		$('.applicationTable .releaseCon .editBtn').css('display','block');

	}
	//2.清空编辑区
	function clearEditPart(){
		$('.editPart .previewBar').css('width',0);
    	$('.editPart .previewBar').css('height',0);
    	$('.editPart .previewBarPer').css('width',0);
    	$('.editPart .previewBarPer').css('height',0);
    	$('.editPart .preview').html('');
    	$('.bodyInfos .time').val('5');
    	$('.bodyInfos .theme').val('');
    	$('.bodyInfos textarea').val('');
    	$('.bodyInfos .selectpicker').selectpicker('deselectAll');
    	$('.bodyInfos .fontFamilyItem').removeClass('blueBorder');
    	$('.bodyInfos .fontSizeItem').removeClass('blueBorder');
    	$('.bodyInfos .fontColor').removeClass('borderSelect');
    	$('.bodyInfos .fontColorBar').css('border-color','');
    	$('.bodyInfos .textAlign').removeClass('blueBorder');
    	for (var i = 0; i < $('.textAlign').children().length ; i++) {
			var thisSrc = $('.textAlign').children().eq(i).attr('srcAttr')+'.png';
			$('.textAlign').children().eq(i).attr('src',thisSrc);
		}
		$('.bodyInfos .hiddenDiv').text('');
		$('.bodyInfos .addNextMessage').attr('cmsCode','');
		$('.finishedMessage .fa-pencil').attr('cmsCode','');
		
	}
	//左边编辑区取消
	$('.cancelBtn_Left').click(function(){
		clearEditPart();
	})
	//预选区，删除
	$('.fa-trash-o').click(function(){
		$(this).parent().parent().parent().remove();
	})
	//预选区，编辑
	var cmsCodeForOne = null; //用于页面上修改情报板时更新当前情报板内容
	$('.fa-pencil').click(function(){
		textAlignChange = {"center": "居中", "left": "居左", "right": "居右"};
		var cmsAttrObj = JSON.parse($(this).attr('cmsAttr'));
		console.log($(this).attr('cmsAttr'));
		$(".bodyInfos .theme").val(cmsAttrObj.theme);
		$('.bodyInfos #commandType').selectpicker('val',cmsAttrObj.commandType);
		$('.bodyInfos #boardSize').selectpicker('val',cmsAttrObj.boardSize);
		$(".bodyInfos .fontFamilyItemHidden").text(cmsAttrObj.fontFamily);
		$(".bodyInfos .fontSizeItemHidden").text(cmsAttrObj.fontSize);
		$(".bodyInfos .fontColorHidden").text(cmsAttrObj.fontColor);
		$(".bodyInfos .textAlignHidden").text(textAlignChange[cmsAttrObj.align]);
		for (var i = 0; i < $('.fontFamilyItem').length ; i++) {
			var thisfontFamily = $('.fontFamilyItem').eq(i).text();
			if(cmsAttrObj.fontFamily == thisfontFamily){
				$('.fontFamilyItem').eq(i).siblings().removeClass('blueBorder');
				$('.fontFamilyItem').eq(i).addClass('blueBorder');
			}
		}
		for (var i = 0; i < $('.fontSizeItem').length ; i++) {
			var thisfontSize = $('.fontSizeItem').eq(i).text();
			if(cmsAttrObj.fontSize == thisfontSize){
				$('.fontSizeItem').siblings().removeClass('blueBorder');
				$('.fontSizeItem').eq(i).addClass('blueBorder');
			}
		}
		for (var i = 0; i < $('.fontColor').length ; i++) {
			var thisfontColor = $('.fontColor').eq(i).attr('colorAttr');
			if(cmsAttrObj.fontColor == thisfontColor){
				$('.fontColor').eq(i).parent().siblings().css('border-color','');
				$('.fontColor').eq(i).parent().css('border-color',thisfontColor);
			}
		}
		for (var i = 0; i < $('.textAlign').length ; i++) {
			var thistextAlign = $('.textAlign').eq(i).children().attr('srcAttr').replace(/[^\u4e00-\u9fa5]/gi,"");
			if(textAlignChange[cmsAttrObj.align] == thistextAlign){
				$('.textAlign').eq(i).siblings().removeClass('blueBorder');
				for (var j = 0; j < $('.textAlign').eq(i).siblings().length ; j++) {
					var thisSrc = $('.textAlign').eq(i).siblings().children().eq(j).attr('srcAttr')+'.png';
					$('.textAlign').eq(i).siblings().children().eq(j).attr('src',thisSrc);
				}
				$('.textAlign').eq(i).addClass('blueBorder');
				var thisSrc = $('.textAlign').eq(i).children().attr('srcAttr')+'blue.png';
				$('.textAlign').eq(i).children().attr('src',thisSrc);
			}
		}
		

		$('.bodyInfos #enter').selectpicker('val',cmsAttrObj.enter);
		$(".bodyInfos .time").val(cmsAttrObj.time);
		$(".bodyInfos .content").val(cmsAttrObj.content);
		$('.bodyInfos .selectpicker').selectpicker('refresh');
		cmsCodeForOne = cmsAttrObj.cmsCode;
		$(".bodyInfos .addNextMessage").attr('cmsCode',cmsCodeForOne);
		$(this).attr('cmsCode',cmsCodeForOne);//用于页面上修改情报板时更新当前情报板内容，当点击修改时，把当前情报板的cmsCode创建属性赋值给编辑区的“添加下一条”的按钮和预览区当前情报板的修改按钮上
		previewAdd();
	})

	// windowChange();
	// function windowChange(){
	// 	if($(window).width() < 1200){
	// 		$('.themeList').hide();
	// 	}else if($(window).width() > 1200){
	// 		$('.themeList').show();
	// 	}
		
	// }
	// $(window).resize(function(){
	// 	windowChange()
	// });
})


