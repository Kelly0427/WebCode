function preview(mycontent,boardSize,fontFamily,fontSize,fontColor,align){
        // 获取内容
      	var text1 = mycontent.replace(/\n/g,"<br />");
        // 将内容添加到预览框
        $("#preview1").html(text1);		
        // 获取情报板尺寸
        var boardSize1 = boardSize.split('*');		
        // 获取字体
        var fontFamily1 = fontFamily;		
        // 获取字体大小
        var fontSize1 = fontSize;		
        // 获取字体颜色
        var fontColor1 = fontColor;
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
        var  align1 = "";
        switch (align) {
            case "居中":
            	align1 = "center";
                break;
            case "居右":
            	align1 = "right";
                break;
            case "居左":
            	align1 = "left";
                break;
            default:
            	align1 = "center"
        }		
        
        // 预览框写入css
        $("#preview1").css("color", color1);
        $("#preview1").css("fontFamily", fontFamily1);
        $("#preview1").css("font-size", fontSize1 + "px");
        $("#preview1").css("line-height", fontSize1 + "px");
        $("#preview1").css("display","inline-block");
        $("#previewBar1").css("vertical-align","middle");
        $("#previewBar1").css("display","table-cell");
        $("#previewBar1").css("text-align", align1);	      
        $("#previewBar1").css("width",boardSize1[0]);
        $("#previewBar1").css("height",parseInt(boardSize1[1])+4);
        $("#previewBarPer").css("width",boardSize1[0]);
        $("#previewBarPer").css("height",parseInt(boardSize1[1])+4);
        $("#previewBarPer").css("background",'#000'); 
        
    }
