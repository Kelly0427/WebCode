g_object_name = '';
key = '';
var global_file = "";
function random_string(len) {
	len = len||32;
	var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
	var maxPos = chars.length;
	var pwd = '';
	for (i = 0; i < len; i++) {
		pwd += chars.charAt(Math.floor(Math.random() * maxPos));
	}
    return pwd;
}

function get_suffix(filename) {
    pos = filename.lastIndexOf('.')
    suffix = ''
    if (pos != -1) {
        suffix = filename.substring(pos)
    }
    return suffix;
}

function calculate_object_name(filename)
{
    suffix = get_suffix(filename);
    g_object_name = key + random_string(32) + suffix;
    return '';
}

//上传照片
function load(){

	//上传照片
	$.weui = {};
	$.weui.alert = function (options) {
	    options = $.extend({title: '警告', text: '警告内容'}, options);
	    var $alert = $('.weui_dialog_alert');
	    $alert.find('.weui_dialog_title').text(options.title);
	    $alert.find('.weui_dialog_bd').text(options.text);
	    $alert.on('touchend click', '.weui_btn_dialog', function () {
	        $alert.hide();
	    });
	    $alert.show();
	};

	$(function () {
	    // 允许上传的图片类型
	    var allowTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
	    // 1024KB，也就是 15MB
	    var maxSize = 15 * 1024 * 1024;
	    // 图片最大宽度
	    var maxWidth = 300;
	    // 最大上传图片数量
	    var maxCount = 3;
		//当前放大预览的图片的序号
    	var previewImgIndex = null;
	    var $uploaderInput = $("#uploaderInput");
	    var $uploaderFiles = $("#uploaderFiles");
	    var $gallery = $("#gallery"), $galleryImg = $("#galleryImg");
	    $('.js_file').off('change').on('change', function (event) {
	        var files = event.target.files;

	        // 如果没有选中文件，直接返回
	        if (files.length === 0) {
	            return;
	        }
	        var flag = false;
	        for (var i = 0, len = files.length; i < len; i++) {
	            var file = files[i];
				global_file = files[i];
	            var reader = new FileReader();

	            // 如果类型不在允许的类型范围内
	            if (allowTypes.indexOf(file.type) === -1) {
					errorPrompt('该类型不允许上传');
	                continue;
	            }

	            if (file.size > maxSize) {
					errorPrompt('图片大小不能超过15MB');
	                continue;
	            }

	            if ($('.weui-uploader__file').length >= maxCount) {
					errorPrompt('最多只能上传' + maxCount + '张图片');
	                return;
	            }

	            reader.onload = function (e) {

	                var img = new Image();
	                img.onload = function () {
	                    // 不要超出最大宽度
	                    var w = Math.min(maxWidth, img.width);
	                    // 高度按比例计算
	                    var h = img.height * (w / img.width);
	                    var canvas = document.createElement('canvas');
	                    var ctx = canvas.getContext('2d');
	                    // 设置 canvas 的宽度和高度
	                    canvas.width = w;
	                    canvas.height = h;
	                    ctx.drawImage(img, 0, 0, w, h);
	                    var base64 = canvas.toDataURL('image/png');

	                    // 插入到预览区
	                    var $preview = $('<li class="weui-uploader__file repair-uploader_files weui-uploader__file_statusuploader__file_status weui_uploader-img" style="background-image:url(' + base64 + ')"><div class="weui_uploader_status_content">10%</div></li>');
	                    $('.weui_uploader_files').append($preview);
	                    var picNumber = $('.weui_uploader_files li').length;
	                    if(picNumber==3){
	                    	$('.repair-input-uploader').hide();
	                    }
	                    var num = $('.weui_uploader_file').length;
	                    $('.js_counter').text(num + '/' + maxCount);

	                    // 然后假装在上传，可以post base64格式，也可以构造blob对象上传，也可以用微信JSSDK上传
	                    var progress = 0;
						function uploading() {
	                        $preview.find('.weui_uploader_status_content').text(++progress + '%');
	                        if (progress < 99) {
	                        	$preview.find('.weui_uploader_status_content').text(++progress + '%');
	                            setTimeout(uploading, 20);
	                        }else{
	                        	//执行上传操作
	    						upload(global_file,$preview,base64);
	    						global_file = "";
	                        }
                    	}
	                    setTimeout(uploading, 30);
	                };
	                img.src = e.target.result;
	            };
	            reader.readAsDataURL(file);
	        }
			$('.weui-gallery__del').on('click',function(){
	            if(null==previewImgIndex) return;
	            $('#uploaderFiles li').eq(previewImgIndex).unbind( "click" );
	            $('#uploaderFiles li').eq(previewImgIndex).remove();
	            previewImgIndex = null;
				$('.repair-input-uploader').show();
		    })
		    $uploaderFiles.on("click", "li", function(){
		        if(null!==previewImgIndex) return;
		        previewImgIndex = $('#uploaderFiles li').index($(this));
		        $galleryImg.attr("style", this.getAttribute("style"));
		        $gallery.css('display','block').css('opacity','1');
		//            $gallery.fadeIn(100);
		    });
		    $gallery.on("click", function(){
		        previewImgIndex = null;
		        $gallery.css('display','none').css('opacity','0');
		    });
	    });
	});
}

function upload(file,$preview,base64){
	lrz(file, {width: 1024}).then(function (rst) {
		//alert("新上传中..."+rst.origin.name);
		var filename = file.name;
		var ossData = new FormData();
		// 先请求授权，然后回调
		calculate_object_name(rst.origin.name)
		//调用服务器进行上传
		try {
		 $.ajax({
			 url: global.url+'/aliyuntest/updateImg',
			 data:{'image':rst.base64,'name':g_object_name},
			 dataType:'json',
		     type: 'POST',
		     async:false,
		     success:function(data){
		    	 //alert(data.code);
		    	 if (data.code == "100000") {
		    		$preview.attr('data-value',data.data);
					$preview.find('.weui_uploader_status_content').text('100%');
	                $preview.removeClass('weui_uploader_status').find('.weui_uploader_status_content').remove();
		    	 }
		     },
		     error:function(data){
		     	$preview.remove();
		        alert("上传失败请重试");
		     }
		 });
		}catch(err){
			alert("发生异常："+err.name+"==>"+err.message);
		}
	}).catch(function (err) {
        //alert("压缩出错："+err);
        var filename = file.name;
		var ossData = new FormData();
		calculate_object_name(filename);
	    ossData.append('file', file, g_object_name);
	    try {
	    	
	     	$.ajax({
	         url: global.url+'/aliyuntest/updateImg',
	         data:{'image':base64,'name':g_object_name},
	         dataType:'json',
	         type: 'POST',
	         async:false,
 		     success:function(data){
 		    	 if (data.code == "100000") {
 		    	 	//alert("上传成功...");
 		    		$preview.attr('data-value',data.data);
 					$preview.find('.weui_uploader_status_content').text('100%');
 	                $preview.removeClass('weui_uploader_status').find('.weui_uploader_status_content').remove();
 	                return;
 		    	 }
 		     },
 		     error:function(data){
 		     	$preview.remove();
 		        alert("上传失败请重试");
 		     }
 		 	});
          
	 	}catch(err){
			alert("发生异常："+err.name+"==>"+err.message);
		}
    });
}