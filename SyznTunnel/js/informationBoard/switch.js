       //字体
	   	function switchFont(fontFamily){
      	var font = ""
	        switch (fontFamily) {
	          case 1:
              	font = "宋体";
                  break;
              case 2:
              	font = "仿宋体";
                  break;
              case 3:
              	font = "黑体";
                  break;
              case 4:
            	font = "隶书";
                  break;
              case 5:
                font = "楷体";
                    break;
	            }
	        return font;
	      }
	   	function switchFontVal(fontFamilyVal){
	      	var val = ""
		        switch (fontFamilyVal) {
		          case "宋体":
		        	  val = 1;
	                  break;
	              case "仿宋体":
	            	  val = 2;
	                  break;
	              case "黑体":
	            	  val = 3;
	                  break;
	              case "隶书":
	            	  val = 4;
	                  break;
	              case "楷体":
	            	  val = 5;
	                    break;
		            }
		        return val;
		      }
	   //字体大小
      function switchFontSize(fontSize){
      	var size = ""
	        switch (fontSize) {
	          case 1:
              	size = "16";
                  break;
              case 2:
              	size = "24";
                  break;
              case 3:
              	size = "32";
                  break;
              case 4:
              	size = "48";
                  break;
              case 5:
            	size = "64";
                break;
	            }
	        return size;
	      }
      function switchFontSizeVal(fontSizeVal){
        	var val = ""
  	        switch (fontSizeVal) {
  	          case "16":
  	        	    val = 1;
                    break;
                case "24":
                	val = 2;
                    break;
                case "32":
                	val = 3;
                    break;
                case "48":
                	val = 4;
                    break;
                case "64":
                	val = 5;
                  break;
  	            }
  	        return val;
  	      }
       //字体颜色（用于css样式预览）
       function switchColorCss(fontColor){
      	var color = ""
	        switch (fontColor) {
	        	  case 1: // 红色	
	            	color = "#FF0000";
                    break;
	              case 2: // 绿色 	
	            	color = "#00FF00";
                    break;
	              case 3: // 蓝色	
            	    color = "#0000FF";
                    break;
	              case 4: // 黄色	
            	    color = "#FFFF00";
            		break;
	              case 5: // 紫色	
	            	  color = "#4B0082";
	            	  	break;
	              case 6: // 青色	
	            	  color = "#00FFFF";
	            	  	break;
	              case 7: // 白色	
            	      color = "#FFFFFF";
            	  	  break;
	              default: // 黑色	
            	      color = "#dddddd";
            	  	   break;
	            }
	        return color;
	      }
       //字体颜色（用于显示）
        function switchColorWord(fontColor){
       	var color = ""
	        switch (fontColor) {
	          case 1: // 红色	
            	color = "红色";
                break;
              case 2: // 绿色 	
            	color = "绿色";
                break;
              case 3: // 蓝色	
        	    color = "蓝色";
                break;
              case 4: // 黄色	
        	    color = "黄色";
        		break;
              case 5: // 紫色	
            	  color = "紫色";
            	  	break;
              case 6: // 青色	
            	  color = "青色";
            	  	break;
              case 7: // 白色	
        	      color = "白色";
        	  	  break;
              default: // 黑色	
        	      color = "黑色";
        	  	   break;	
	            }
	        return color;
	      }
        function switchColorWordVal(fontColorVal){
           	var val = ""
    	        switch (fontColorVal) {
    	          case "红色": // 红色	
    	        	  val = 1;
                    break;
                  case "绿色": // 绿色 	
                	  val = 2;
                    break;
                  case "蓝色": // 蓝色	
                	  val = 3;
                    break;
                  case "黄色": // 黄色	
                	  val = 4;
            		break;
                  case "紫色": // 紫色	
                	  val = 5;
                	  	break;
                  case "青色": // 青色	
                	  val = 6;
                	  	break;
                  case "白色": // 白色	
                	  val = 7;
            	  	  break;
    	            }
    	        return val;
    	      }
          //对齐方式（用于显示）
	      function switchAlignCss(align){
	        var textAlign = '';
	            switch (align) {
	                case 0:
	                  textAlign = "居中";
	                    break;
	                case 1:
	                  textAlign = "居左";
	                    break;
	                case 2:
	                  textAlign = "居右";
	                    break
	               
	            }
	              return textAlign;
	      }
	      //对齐方式（用于css样式预览）
	      function switchAlignWord(align){
		        var textAlign = '';
		            switch (align) {
		                case 0:
		                  textAlign = "center";
		                    break;
		                case 1:
		                  textAlign = "left";
		                    break;
		                case 2:
		                  textAlign = "right";
		                    break
		               
		            }
		              return textAlign;
		      }
	      function switchAlignVal(alignVal){
		        var val = '';
		            switch (alignVal) {
		                case "居中":
		                	val = 0;
		                    break;
		                case "居左":
		                	val = 1;
		                    break;
		                case "居右":
		                	val = 2;
		                    break
		               
		            }
		              return val;
		      }
	      //特效
	      function switchEnterAndOut(enterOut){
		        var enterAndOut = '';
		            switch (enterOut) {
		                case 1:
		                	enterAndOut = "立即";
		                    break;
		                case 2:
		                	enterAndOut = "闪烁";
		                    break;
		                case 3:
		                	enterAndOut = "左移";
		                    break
		                case 4:
		                	enterAndOut = "上移";
		                    break
		                case 5:
		                	enterAndOut = "右移";
		                    break
		                case 6:
		                	enterAndOut = "下移";
		                    break
		               
		            }
		              return enterAndOut;
		      }
	      function switchEnterAndOutVal(enterOutVal){
		        var val = '';
		            switch (enterOutVal) {
		                case "立即":
		                	val = 1;
		                    break;
		                case "闪烁":
		                	val = 2;
		                    break;
		                case "左移":
		                	val = 3;
		                    break
		                case "上移":
		                	val = 4;
		                    break
		                case "右移":
		                	val = 5;
		                    break
		                case "下移":
		                	val = 6;
		                    break
		               
		            }
		              return val;
		      }