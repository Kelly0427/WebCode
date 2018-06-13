var whichTr,whichTrPrev;
$(function(){
	//选中的设备
	var getSendId = [];
	for(var i = 0;i<$('.getSendId').size();i++){
	  	getSendId.push($('.getSendId').eq(i).html());
	}
	console.log(getSendId);
	var deviceCodesStr = '';  //群发的设备ID
	//显示给那个情报板发布信息
	//if(document.referrer.indexOf("informationPublish") < 0){
//		$('.orderCms').hide();
//	}else{
//		$('.orderCms').show();
		deviceList();
	//}
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
		    	//if(res.length == 1){
//		    		$('.videoLinkage').show();
//		    	}else{
//		    		$('.videoLinkage').hide();
//		    	}
				$('.orderCms').show();
	            var orderBoardSizeOptions = '';
	            $.each(res,function(index,item){
	            	orderBoardSizeOptions+='<option value="'+item.devicecode+'">'+item.comment+'</option>';
	            	var cmsSize,width,height;
	        		if(item.devconfig){
				 		 cmsSetting(item.devconfig);
				 		 width = itemCmsJson.w;
				 		 height = itemCmsJson.h;
				 		 cmsSize = width+'*'+height;
				 	}
	            	deviceCodesStr += '"a'+cmsSize+ '":"' + item.devicecode + '",';                
	            });
	            $('#orderBoardSize').html(orderBoardSizeOptions); 
	            $('.selectpicker').selectpicker('refresh');
		    },
		    error:function(res){
		      console.log(res);
		    }     
		}); 
	}
	deviceCodesStr = (deviceCodesStr.substring(0,deviceCodesStr.length-1).split(",")).join(',');
	//key值相同的，value合并，情报板尺寸相同的，deviceCode合并
	var s = 'jsondata='+deviceCodesStr;
	var kv = {}, m, reg = /"([^"]+)":"([^"]+)"/g;
	while (m = reg.exec(s)) { kv[m[1]] ? kv[m[1]] = (typeof kv[m[1]] == 'string' ? [kv[m[1]]] : kv[m[1]]).concat([m[2]]) : kv[m[1]] = m[2] }
	
	
	
//function getJson(key){  
//	var jsonObj = JSON.parse(JSON.stringify(kv));
//    var eValue=eval('jsonObj.'+key);  
//    for(var item in jsonObj){  
//        if(item == key){  
//            var jValue=jsonObj[item];
//        }  
//    }  
//    alert(jsonObj[''+key+'']);  
//} 
	
	
	var cmsSizeArr = localStorage.getItem('cmsSize').split(',');
	var allCmsVal = unique(cmsSizeArr);
	
	function unique(arr){
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
	//命令节目类型
	commandType('.bodyInfos #commandType');
	//情报板类型
    $('#boardSize').val(allCmsVal);
    
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
	var cmsAttr,textAlign,text,boardSize,fontFamily,fontSize,fontColor,align,fontFamilyIndex,fontSizeIndex,fontColorIndex,alignIndex,andFlag = null;
	var divNnm = 1;
	function previewAdd(){
    	textAlign = {"居中": "center", "居左": "left", "居右": "right"};
        // 获取内容
        		
        // 将内容添加到预览框
       // $(".editPart .preview").html(text);		
       	
        // 获取字体
        fontFamily = $('.fontFamilyItemHidden').text();		
        fontFamilyIndex = $('.fontFamilyItemIndexHidden').text();		
        // 获取字体大小
        //fontSize = $('.fontSizeItemHidden').text();		
        fontSizeIndex = $('.fontSizeItemIndexHidden').text();		
        // 获取字体颜色
        fontColor = $('.fontColorHidden').text();
        fontColorIndex = $('.fontColorIndexHidden').text();
       
        // 对其方式
        align = 'center';
        alignIndex = '0';
        // 获取情报板尺寸
        // 预览框写入css
        var html = '';
        console.log(allCmsVal);
		for(var i = 0; i < allCmsVal.length; i++) {	
			var jsonObj = JSON.parse(JSON.stringify(kv));
		    var eValue=eval('jsonObj.'+'a'+allCmsVal[i]);  
		    for(var item in jsonObj){  
		        if(item == 'a'+allCmsVal[i]){  
		            var jValue=jsonObj[item];
		        }  
		    }  
		    var jsonObjItem = jsonObj[''+'a'+allCmsVal[i]+''];  
	        boardSize = allCmsVal[i].split('*');
	        boardSizeStr = allCmsVal[i];
			var cmsWidth = parseInt(boardSize[0]);
			var cmsHeight = parseInt(boardSize[1]);
			if(cmsWidth < 320){
				text = $("textarea[name=content]").val().replace(/\n/g,'<br>');
				text = text.replace(/\ +/g,"<br>");
				text = text.replace(new RegExp('，','gm'),'<br>');
			}else{
				text = $("textarea[name=content]").val().replace(/\n/g,'<br>');
			}
			
	        var top = (parseInt(cmsHeight))/2 + 'px';
	        var left = (parseInt(cmsWidth) + 14) + 'px';
			var cmsAttr = '';
		    var conArray = text.replace(/\n/g,"<br>").split('<br>');	 //内容
		    var flag = 'flag'+i;
			var flag1 = 'flag1'+i;
		    yanzheng(boardSize,text,flag,flag1);
		    if(fontSize == undefined){
		    	fontSize = '16'
		    }
	        var maxWordCount = cmsWidth/fontSize; //一行最多放几个字
		    var endConStr = '';
		    //一行文字超过容器宽度时，将内容以<br>换行
		    for(var n = 0;n < conArray.length;n++){
		    	if(getStrByteLength(conArray[n])/2*fontSize > cmsWidth){
		    		endConStr += conArray[n].substring(0,maxWordCount)+'<br>';
		    		if(getStrByteLength(conArray[n].substr(maxWordCount))/2*fontSize > cmsWidth){
		    			endConStr += conArray[n].substr(maxWordCount).substring(0,maxWordCount)+'<br>';
		    			if(getStrByteLength(conArray[n].substr(maxWordCount).substr(maxWordCount))/2*fontSize > cmsWidth){
		    				endConStr += conArray[n].substr(maxWordCount).substr(maxWordCount).substring(0,maxWordCount)+'<br>';
		    				if(getStrByteLength(conArray[n].substr(maxWordCount).substr(maxWordCount))/2*fontSize > cmsWidth){
				    			endConStr += conArray[n].substr(maxWordCount).substr(maxWordCount).substring(0,maxWordCount)+'<br>';
		    				}else{
				    			endConStr += conArray[n].substr(maxWordCount).substr(maxWordCount).substr(0,maxWordCount)+'<br>';
		    				}
		    			}else{
			    			endConStr += conArray[n].substr(maxWordCount).substr(maxWordCount)+'<br>';
		    			}
		    		}else{
		    			endConStr += conArray[n].substr(maxWordCount)+'<br>';
		    		}
		    	}else{
		    		endConStr += conArray[n] + '<br>';
		    	}
		    }
		    endConStr = endConStr.substring(0,endConStr.length-4);  
		    
			yanzheng(boardSize,endConStr,flag,flag1);
		    var arrs = CalculatingCoordinate(endConStr,cmsWidth,cmsHeight,fontSize,align);
			var newconArray = endConStr.split('<br>');	 //内容
		    var previewConAngXy = [];
			for(var c = 0;c < newconArray.length;c++){
				previewConAngXy.push({'x':arrs[c].postX,'y':arrs[c].postY,'content':newconArray[c]});
			}
			console.log(boardSizeStr);
			var cmsAttr = {'deviceCode':jsonObjItem,'deviceType':boardSizeStr,'commandType':$('.commandType').val(),'stayTime':$('.time').val(),'contents':previewConAngXy,'font':fontFamilyIndex,'fontSize':switchFontSizeVal(fontSize),'fontFrontColor':fontColorIndex,'align':alignIndex,'content':text,'groupDescribe':$('.groupDescribe').val()};
//			var cmsAttr = {'cmsCode':i+"cms",'deviceCodes':jsonObjItem,"message":[{'deviceType':boardSize,'commandType':$('.commandType').val(),'time':$('.time').val(),'contents':previewConAngXy,'font':fontFamilyIndex,'fontSize':switchFontSizeVal(fontSize),'fontFrontColor':fontColorIndex,'align':alignIndex,'content':text}]};
			cmsAttr = JSON.stringify(cmsAttr);
			html +="<div class='cloneCms' style='position: relative;'>";
			html +='	<p class="cmsAttr" style="display:none;">'+cmsAttr+'</p>';                                       
            html +='    <div class="previewBarPer" style=" width: '+cmsWidth+'px; height: '+cmsHeight+'px;overflow:hidden;">';                                      
            html +='         <div class="previewBar" style="vertical-align: middle; display: table-cell; width: '+cmsWidth+'px; height: '+cmsHeight+'px; background: rgb(0, 0, 0); text-align: center;">';                                         
            html +="               <div class='preview' style='display: inline-block; font-family: "+fontFamily+"; font-size: "+fontSize+"px; line-height: "+fontSize+"px; color:"+fontColor+";'>"+endConStr+"</div>";
            html +='         </div>';
            html +='         <div class="editBtn" style="position: absolute;  top: '+top+'; left: '+left+';">';
            if(!andFlag){
	            html +='               <span class="fa fa-exclamation-circle" style="color:red"></span>';
            }
            //html +='               <span class="fa fa-pencil"></span>';
            html +='               <span class="fa fa-trash-o"></span>';
            html +='         </div>';
            html +='    </div>';
            html +='</div>';
		}
		
	        $('.editPart'+divNnm).html(html);
    }
	
	function yanzheng(boardSize,text,tip,tip1){
		console.log('********************************************');
		console.log(text);
		console.log(boardSize);
		console.log(tip);
		console.log(tip1);
		var flag = tip;
		var flag1 = tip1;
		var fontSizeArr = ['48','32','24','16'];
		//验证预览内容的合法性
		for(var z = 0; z < fontSizeArr.length ; z++) {	
	        //最大行数
	        var maxLine = (parseInt(boardSize[1]))/fontSizeArr[z];	
	        //最大列数
			var maxRow = boardSize[0]/fontSizeArr[z]*2;		
			var nrArray = text.split('<br>');
			//var num = 0;
//			var number = parseInt(text.replace(/[^0-9]/ig,""));
//			var number1 = text.indexOf("，");
			if(nrArray.length > maxLine){
				flag = false;
			}else{
				flag = true;
			}
			var nrArrayLength = [];
			for(var line = 0; line < nrArray.length; line++){
				nrArrayLength.push(getStrByteLength(nrArray[line]));
			}
				//if(number || number1 > 0){
//					if(getStrByteLength(nrArray[line]) >= maxRow){
//						flag1 = false;
//						flag = false;
//					}else{
//						flag1 = true;
//					}
//					if(flag && flag1){
//						fontSize = fontSizeArr[z];
//						return;
//					}
//				}else{
					//按内容数组里字数对多的一行算
					if(Math.max.apply(null, nrArrayLength) > maxRow){
						flag1 = false;
						flag = false;
					}else{
						flag1 = true;
					}
					andFlag = flag && flag1;
					console.log(flag);
					console.log(flag1);
					if(andFlag){
						fontSize = fontSizeArr[z];
//						return andFlag;
						return;
					}
				//}
			
			//var a=[1,2,3,5];
			//alert(Math.max.apply(null, nrArrayLength));
			
			
			
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
		//var length = strArray.length;
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
		var nrArray = contentStr.split('<br>');	//内容
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
			if(fontalign == 'left'){
				fPostX = 0; 
			}
			//居右
			else if(fontalign == 'right'){
				fPostX = width - fontsize/2*contentLength;
			}
			//居中
			else if(fontalign == 'center'){
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

	//添加下一条按钮 ----清空编辑区
	$('.addNextMessage').click(function(){
		divNnm++;
		$('.finishedMessage').prepend('<div class="editPart'+divNnm+'"></div>');	
		$('.bodyInfos .time').val('5');
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
	})
	//预选区取消
	$('.cancelBtn_right').click(function(){
		clearEditPart();
	})
	/*
	var cmsAttr = '';
	var arrs = CalculatingCoordinate(text,cmsWidth,cmsHeight,fontSize,align);
    var conArray = text.replace(/\n/g,"<br />").split('<br>');	 //内容
    var previewConAngXy = [];
	for(var i = 0;i<conArray.length;i++){
		previewConAngXy.push({'x':arrs[i].postX,'y':arrs[i].postY,'content':conArray[i]});
	}
	var cmsAttr = {"cmsCode":cmsCode+'cms',"deviceType":boardSize,"commandType":$(".commandType").val(),"time":$(".time").val(),"contents":previewConAngXy,"font":fontFamilyIndex,"fontSize":switchFontSizeVal(fontSize),"fontFrontColor":fontColorIndex,"align":alignIndex,"content":text};
	cmsAttr = JSON.stringify(cmsAttr);
	*/
	
	
	
	
	//1.添加到预选区
	function addNextMessage(obj){
		var con = $(".content").val();
		var arrs = CalculatingCoordinate(con,$("#boardSize option:selected").html().split('*')[0],$("#boardSize option:selected").html().split('*')[1],fontSize,align);
		var conArray = con.replace(/\n/g,"<br>").split('<br>');	 //内容
		var previewConAngXy = [];
		for(var i = 0;i<conArray.length;i++){
			previewConAngXy.push({'x':arrs[i].postX,'y':arrs[i].postY,'content':conArray[i]});
		}
		//cmsAttr = {"cmsCode":cmsCode+'cms',"deviceType":$("#boardSize option:selected").html(),"commandType":$(".commandType").val(),"time":$(".time").val(),"enter":$(".enter").val(),"contents":previewConAngXy,"font":fontFamilyIndex,"fontSize":fontSizeIndex,"fontFrontColor":fontColorIndex,"align":alignIndex,"content":$(".content").val()};
		cmsAttr = {"cmsCode":cmsCode+'cms',"deviceType":$("#boardSize option:selected").html(),"commandType":$(".commandType").val(),"stayTime":$(".time").val(),"enter":$(".enter").val(),"contents":previewConAngXy,"font":fontFamilyIndex,"fontSize":fontSizeIndex,"fontFrontColor":fontColorIndex,"align":alignIndex,"content":$(".content").val()};
		
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
		divNnm = 1;
		$('.finishedMessage').html('<div class="editPart1"></div>');
		//$('.editPart .previewBar').css('width',0);
//    	$('.editPart .previewBar').css('height',0);
//    	$('.editPart .previewBarPer').css('width',0);
//    	$('.editPart .previewBarPer').css('height',0);
//    	$('.editPart .preview').html('');
    	$('.bodyInfos .time').val('5');
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
		//$('.bodyInfos .addNextMessage').attr('cmsCode','');
//		$('.finishedMessage .fa-pencil').attr('cmsCode','');
		
	}
	//左边编辑区取消
	$('.cancelBtn_Left').click(function(){
		clearEditPart();
	})
	//预选区，删除
	function deleteBtn(btn){
		$(btn).parent().parent().parent().remove();
	}
	$('.editAddCms').on('click','.fa-trash-o',function(){
		$(this).parent().parent().parent().remove();
	})
	//预选区，编辑
	var cmsCodeForOne = null; //用于页面上修改情报板时更新当前情报板内容
	/*
	$('.fa-pencil').click(function(){
		textAlignChange = {"center": "居中", "left": "居左", "right": "居右"};
		var cmsAttrObj = JSON.parse($(this).attr('cmsAttr'));
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
	*/
	function editFun(btn){
		var cmsAttrObj = $(btn).parent().parent().prev().html();
		$(".bodyInfos .groupDescribe").val(cmsAttrObj.groupDescribe);
		$('.bodyInfos #commandType').selectpicker('val',cmsAttrObj.commandType);
	//	$('.bodyInfos #boardSize').selectpicker('val',cmsAttrObj.boardSize);
		$(".bodyInfos .fontFamilyItemHidden").text(cmsAttrObj.fontFamily);
	//	$(".bodyInfos .fontSizeItemHidden").text(cmsAttrObj.fontSize);
		$(".bodyInfos .fontColorHidden").text(cmsAttrObj.fontColor);
	//	$(".bodyInfos .textAlignHidden").text(textAlignChange[cmsAttrObj.align]);
		for (var i = 0; i < $('.fontFamilyItem').length ; i++) {
			var thisfontFamily = $('.fontFamilyItem').eq(i).text();
			if(cmsAttrObj.fontFamily == thisfontFamily){
				$('.fontFamilyItem').eq(i).siblings().removeClass('blueBorder');
				$('.fontFamilyItem').eq(i).addClass('blueBorder');
			}
		}
		//for (var i = 0; i < $('.fontSizeItem').length ; i++) {
//			var thisfontSize = $('.fontSizeItem').eq(i).text();
//			if(cmsAttrObj.fontSize == thisfontSize){
//				$('.fontSizeItem').siblings().removeClass('blueBorder');
//				$('.fontSizeItem').eq(i).addClass('blueBorder');
//			}
//		}
		for (var i = 0; i < $('.fontColor').length ; i++) {
			var thisfontColor = $('.fontColor').eq(i).attr('colorAttr');
			if(cmsAttrObj.fontColor == thisfontColor){
				$('.fontColor').eq(i).parent().siblings().css('border-color','');
				$('.fontColor').eq(i).parent().css('border-color',thisfontColor);
			}
		}
		//for (var i = 0; i < $('.textAlign').length ; i++) {
//			var thistextAlign = $('.textAlign').eq(i).children().attr('srcAttr').replace(/[^\u4e00-\u9fa5]/gi,"");
//			if(textAlignChange[cmsAttrObj.align] == thistextAlign){
//				$('.textAlign').eq(i).siblings().removeClass('blueBorder');
//				for (var j = 0; j < $('.textAlign').eq(i).siblings().length ; j++) {
//					var thisSrc = $('.textAlign').eq(i).siblings().children().eq(j).attr('srcAttr')+'.png';
//					$('.textAlign').eq(i).siblings().children().eq(j).attr('src',thisSrc);
//				}
//				$('.textAlign').eq(i).addClass('blueBorder');
//				var thisSrc = $('.textAlign').eq(i).children().attr('srcAttr')+'blue.png';
//				$('.textAlign').eq(i).children().attr('src',thisSrc);
//			}
//		}
		

		$('.bodyInfos #enter').selectpicker('val',cmsAttrObj.enter);
		$(".bodyInfos .time").val(cmsAttrObj.time);
		$(".bodyInfos .content").val(cmsAttrObj.content);
		$('.bodyInfos .selectpicker').selectpicker('refresh');
	//	cmsCodeForOne = cmsAttrObj.cmsCode;
		//$(".bodyInfos .addNextMessage").attr('cmsCode',cmsCodeForOne);
		//$(this).attr('cmsCode',cmsCodeForOne);//用于页面上修改情报板时更新当前情报板内容，当点击修改时，把当前情报板的cmsCode创建属性赋值给编辑区的“添加下一条”的按钮和预览区当前情报板的修改按钮上
		previewAdd();
	}
	
	

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
	
	
	
	//保存
	var savePulishJson = [];
	var newSavePulishJson = new Array();
	$('.saveBtn').click(function(){
		if($('.fa-exclamation-circle').length > 0){
			var box = $("#box");
	        box.addClass("open");
	        box.find('.faIcon').removeClass('fa-check').addClass('fa-times');
	        box.find('.fontCon').html('有超出情报板的内容，请删除！');
	        box.find('.mb-footer').show();
	        box.find(".mb-control-yes").on("click",function(){
	          box.removeClass("open");
	        })
		}else{
			savePulish();
		}
	})
	function savePulish(){
		for(var i = 0;i<$('.finishedMessage').find('.cmsAttr').length;i++){
			savePulishJson.push(JSON.parse($('.finishedMessage').find('.cmsAttr').eq(i).html()));
		}
		console.log(JSON.stringify(savePulishJson));
		$.ajax({
	      type:"post",
	    //  url:"/informationBoard/addLz",
	      url:"/informationBoard/addAndSendTempMessage",
	       data:{
	       	   'CmsContentEdit':JSON.stringify(savePulishJson)
	       },
	      async:true,
	      dataType:'json',
	      success:function(res){
	      	 var box = $("#box");
        	 box.addClass("open");
	         box.find('.faIcon').removeClass('fa-times').addClass('fa-check');
	         box.find('.fontCon').html('下发信息成功！');
	         box.find('.mb-footer').hide();
	         setTimeout(function(){
          		box.removeClass("open")
             },1000);
	      	 savePulishJson = [];
	      },
	      error:function(res){
	        var box = $("#box");
	        box.addClass("open");
	        box.find('.faIcon').removeClass('fa-check').addClass('fa-times');
	        box.find('.fontCon').html('操作失败，请重新操作！');
	        box.find('.mb-footer').show();
	        box.find(".mb-control-yes").on("click",function(){
	          box.removeClass("open");
	        })
	       }
	    }); 
	}
//576---617没用	
//var json = [{"deviceCodes":"10","message":[{"deviceType":["400","40"],"commandType":"","time":"5","contents":[{"x":384,"y":4,"content":"2"}],"font":"","fontSize":3,"fontFrontColor":"","align":"1","content":"2"}]},{"deviceCodes":"11","message":[{"deviceType":["400","40"],"commandType":"","time":"5","contents":[{"x":384,"y":4,"content":"2"}],"font":"","fontSize":3,"fontFrontColor":"","align":"1","content":"2"}]},{"deviceCodes":"11","message":[{"deviceType":["400","40"],"commandType":"","time":"5","contents":[{"x":384,"y":4,"content":"2"}],"font":"","fontSize":3,"fontFrontColor":"","align":"1","content":"2"}]},{"deviceCodes":"10","message":[{"deviceType":["400","40"],"commandType":"","time":"5","contents":[{"x":384,"y":4,"content":"2"}],"font":"","fontSize":3,"fontFrontColor":"","align":"1","content":"2"}]}];
//var json = [
//            {"BrandType":"一汽大众奥迪", "CarName": "100"}, 
//            {"BrandType":"一汽大众奥迪", "CarName": "200"},
//            {"BrandType": "奥迪进口", "CarName": "A5"}
//            ];
var arr = new Array();
//jsonLoop(json,arr);
//循环json数组
function jsonLoop(json,arr){
    for(var m in json){
        var jsonValue = json[m];
        var mn = findValue(arr,jsonValue);
        if(mn>=0){       //大于0 说明存在相同的
            arr[mn] = addValue(arr[mn],"message",jsonValue.messageList);
        }else{
            arr.push(JSON.stringify(jsonValue))
        }
    }   
}
 
//查找是否存相同value,在并返回下标
function findValue(json,value){
    for(var n in json){
        var jsonValue = JSON.parse(json[n])
         if(jsonValue.deviceCodes == value){
            return parseInt(n);
        }
    }
    return -1;
}
 
// 存在相同value值合并
function addValue(json,key,value){
    var jsonValue = JSON.parse(json);
    var j = new Array(jsonValue[key])
        j.push(value)
        jsonValue[key] = "["+j.toString()+"]";
    return JSON.stringify(jsonValue);
}	
	
	
})


