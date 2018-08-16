/**
 * Created by geshi on 2017/1/18.
 */

$(function(){
    FastClick.attach(document.body);
    var nums = 10; //每页出现的数量
	var openid = global.openid;
    var subOpenid = global.subOpenid;
	var universityId = global.universityId;
    var currBxjl = 1;
    var currBxgc = 1;
    var currBxgg = 1;

    $('.weui-navbar__item').on('click', function () {
        $(this).addClass('weui-bar__item_on').siblings('.weui-bar__item_on').removeClass('weui-bar__item_on');
        var index = $(this).index();
        $('.weui-tab__panel .weui-navbar__content').eq(index).show().siblings().hide();
    });

    $('.weui-dialog__btn').on('click', function(){
        $(this).parents('.js_dialog').css('opacity','0').css('display','none');
        if($(this).text()=="确认"){
            cancelRepair($(this).attr("data-id"));
        }
    });
    //报修流程显示隐藏
    $(".weui-cell-process").on('click',function(){
        $(".process-img").toggle();
        $(this).find("i").toggleClass("open")
    });

    //标签切换
    var aLi = $('.weui-tabbar__item');
    aLi.on('click', function () {
        $(this).addClass('weui-bar__item_on').siblings('.weui-bar__item_on').removeClass('weui-bar__item_on');
        var index = $(this).index();
        $('.weui-tab__panel .weui-tabbar__content').eq(index).show().siblings().hide();
        window.sessionStorage.setItem('studentManage_sign', $(this).attr('id'));
        if($(this).attr('id')=="bxjl"){
            $("#findList").empty();
            currBxjl = 1;
            findList(currBxjl);
        } else if($(this).attr('id')=="wybx"){
            formT();
        } else if($(this).attr('id')=="gggc"){
            /*$("#repFindList").empty();
            currBxgc = 1;
            repFindList(currBxgc);
            $("#notFindList").empty();
            currBxgg = 1;
            nocFindList(currBxgg);*/
        }
    });

    $(".icon-close").on('click',function(){
        $(this).parent().remove();
        $(".section").css("margin-top", "0");
    })

    //点击加载更多
    $("#bxjl_clickLoad").on('click',function(){
        currBxjl++;
        $("#bxjl_clickLoad").hide();
        $("#bxjl_empty").hide();
        $("#bxjl_loading").show();
        findList(currBxjl);
    });
    $("#gggc_clickLoad").on('click',function(){
        currBxgc++;
        $("#gggc_clickLoad").hide();
        $("#gggc_empty").hide();
        $("#gggc_loading").show();
        repFindList(currBxgc);
    });
    $("#bxgg_clickLoad").on('click',function(){
        currBxgg++;
        $("#bxgg_clickLoad").hide();
        $("#bxgg_empty").hide();
        $("#bxgg_loading").show();
        nocFindList(currBxgg);
    });

    //我要报修
	function formT(){
		$("#bxlc").show();
		if(window.localStorage.getItem('repair_bxlc')==null){
			$(".process-img").show();
			window.localStorage.setItem('repair_bxlc', "read");
		}
        //强制评价开启 查未评价工单
        if(global.mandatoryRepair==1){
            repairParam = completion();
            if(repairParam!=""){
                $('#iosDialog3').css('opacity','1').css('display','block');
                $('#iosDialog3').find('a').attr('href',global.url+'/wechat/orderDetails?universityId='+universityId+repairParam);
            }
        }
		$.ajax({
			url:global.url+"/bxFormT/addWeChatRepair",
			type: "GET",
			data: {"universityId": universityId},
			dataType: "json",
			success: function(data){
				if(data.code == 100000){
					$('#listArea').empty();
					var str = "<input id = 'openid' name = 'openid' style = 'display:none' type='text' >";
					str += "<input id = 'subOpenid' name = 'subOpenid' style = 'display:none' type='text' value='"+ subOpenid +"' >";
					str += '<input style = "display:none" name="universityId" type="text" value="'+universityId+'">';
					$('#listArea').append(str);
					$.each(data.data.list, function(n, item) {
						if(item.itemType == '联级列表'){
							str = "";
							for(var selecti = 0; selecti< item.launchnum;selecti++){
                                str +='<div class="weui-cell weui-cell_select weui-cell_select-after" style="'+(selecti==0?"":"display:none")+'">';
                                str +='<div class="weui-cell__hd">';
                                str +='<label for="" class="weui-label">' + (selecti == 0 ? item.itemValue : "") + '</label>';
                                str +='</div>';
                                str +='<div class="weui-cell__bd">';
                                str +='<select class="weui-select" onchange="changeSelect(this);" id="' + item.itemKey + selecti + '" data-key="' + item.itemKey + '" data-launchnum="' + item.launchnum + '"><option value="">请选择</option></select>';
                                str +='<input class = "'+item.itemKey+'" style = "display:none" type="text" ></li>';
                                str +='</div>';
                                str +='</div>';
							}
							str += '<input data-value = "'+item.itemValue+'" id = "'+item.itemKey+'" style = "display:none" name="'+item.itemKey+'" type="text">'
							$('#listArea').append(str);
							if(item.itemKey=="appointmentTime")
								InitSelectView(item.itemKey, item.launchnum, JSON.parse(item.selectValue));
							else
								InitSelectView(item.itemKey, item.launchnum, item.selectValue);
						};
						if(item.itemType == '单行文本'){
							str = "";
                            str +='<div class="weui-cell">';
                            str +='<div class="weui-cell__hd"><label class="weui-label">' + item.itemValue + '</label></div>';
                            str +='<div class="weui-cell__bd">';
                            if(item.DataValidate==1){// onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')"
                                str +='<input onkeyup="this.value=this.value.replace(/\\D/g,\'\')" onafterpaste="this.value=this.value.replace(/\\D/g,\'\')" class="weui-input check" data-value = "'+item.itemValue+'" data-reqired = "'+item.reqired+'" data-DataValidate = "'+item.DataValidate+'" name="'+item.itemKey+'" type="tel" maxlength="'+ item.limitWord +'" placeholder="' + item.contentTips + '">';
                            }else{
                                str +='<input class="weui-input check" data-value = "'+item.itemValue+'" data-reqired = "'+item.reqired+'" data-DataValidate = "'+item.DataValidate+'" name="'+item.itemKey+'" type="text" maxlength="'+ item.limitWord +'" placeholder="' + item.contentTips + '">';
                            }
                            str +='</div>';
                            str +='</div>';
							$('#listArea').append(str);
						};
						if(item.itemType == '多行文本'){
							str = "";
                            str +='<div class="weui-cell">';
                            str +='<div class="weui-cell__hd"><label class="weui-label">' + item.itemValue + '</label></div>';
                            str +='<div class="weui-cell__bd">';
                            str +='<textarea class="weui-input check" data-value = "'+item.itemValue+'" data-reqired = "'+item.reqired+'" name="'+item.itemKey+'" maxlength="'+ item.limitWord +'" placeholder="' + item.contentTips + '"></textarea>';
                            str +='</div>';
                            str +='</div>';
							$('#listArea').append(str);
						};
						if(item.itemType == '时间控件'){
							str = "";
                            str +='<div class="weui-cell">';
                            str +='<div class="weui-cell__hd"><label for="" class="weui-label">' + item.itemValue + '</label></div>';
                            str +='<div class="weui-cell__bd">';
                            str +='<input class="weui-input check" type="datetime-local" data-value = "'+item.itemValue+'" data-reqired = "'+item.reqired+'" name="'+item.itemKey+'" type="text" id="datetime-picker">';
                            str +='</div>';
                            str +='</div>';
							$('#listArea').append(str);
                            var limitTime = item.contentTips;
                            if(limitTime!=''&&limitTime.split('-').length==2){
                                var now = new Date();
                                now.setHours(now.getHours()+parseInt(limitTime.split('-')[0]));
                                var minTime = now.getFullYear()+"-"+((now.getMonth()+1)<10?"0":"")+(now.getMonth()+1)+"-"+(now.getDate()<10?"0":"")+now.getDate()+ "T" + (now.getHours()<10?"0":"")+now.getHours() + ":" + (now.getMinutes()<10?"0":"")+now.getMinutes();
                                $("#datetime-picker").attr("min",minTime);
                                if(parseInt(limitTime.split('-')[1])>0){
                                    now = new Date();
                                    now.setHours(now.getHours()+parseInt(limitTime.split('-')[1]));
                                    var maxTime = now.getFullYear()+"-"+((now.getMonth()+1)<10?"0":"")+(now.getMonth()+1)+"-"+(now.getDate()<10?"0":"")+now.getDate()+ "T" + (now.getHours()<10?"0":"")+now.getHours() + ":" + (now.getMinutes()<10?"0":"")+now.getMinutes();
                                    $("#datetime-picker").attr("max",maxTime);
                                }
                            }else{
                                var now = new Date();
                                var newtime = now.getFullYear()+"-"+((now.getMonth()+1)<10?"0":"")+(now.getMonth()+1)+"-"+(now.getDate()<10?"0":"")+now.getDate()+ "T" + (now.getHours()<10?"0":"")+now.getHours() + ":" + (now.getMinutes()<10?"0":"")+now.getMinutes();
                                $("#datetime-picker").attr("min",newtime);
                            }
							
						};
						if(item.itemType == '图片上传组件'){
							str = "";
                            str +='<div class="weui-cell">';
                            str +='<div class="weui-cell__bd">';
                            str +='<div class="weui-uploader">';
                            str +='<div class="weui-uploader__hd">';
                            str +='<p class="weui-uploader__title">' + item.itemValue + '</p>';
                            str +='</div>';
                            str +='<div class="weui_uploader_bd clearfix weui_uploader_over ">';
                            str +='<ul class="weui_uploader_files" id="uploaderFiles">';
                            str +='<span></span>';
                            str +='</ul>';
                            str +='<div class="weui-uploader__input-box repair-input-uploader">';
                            str +='<input data-key="'+item.itemKey+'" id="uploaderInput" class="weui-uploader__input js_file" type="file" accept="image/*">';//加multiple 可以多选
                            str +='</div>';
                            str +='</div>';
                            str +='</div>';
                            str +='</div>';
                            str +='</div>';
                            str += '<input class = "check" data-value = "'+item.itemValue+'" data-reqired = "'+item.reqired+'" id = "picURL" style = "display:none" name="'+item.itemKey+'" type="text">'
							$('#listArea').append(str);
							load();
						};
					});
					if(data.data.list.length>0){
						str ='<button class="weui-btn weui-btn_primary" id="submitBx" style="background: #288feb;">提交</button>';
	                    if(global.emergencyRepair=="1"){
	                        str +='<div class="weui-btn weui-btn_default" id="jjbx">紧急报修</div>';
	                    }
	                    if(global.assistantRepair=="1"){
	                    	str +='<a href="'+global.url+'/jumpPage?universityId='+universityId+'" id="zzfw" class="weui-btn weui-btn_default" >手机坏了？点击上门维修</a>';
	                    }
	                    $("#form_sub").empty().append(str);
                        $("#jjbx").off('click').on('click',function(){
                            $('#iosDialog4').css('opacity','1').css('display','block');
                        });
                       
	                    submitBx();
	                    bxUser();
					}
					$("#openid").val(openid);
				}
			}
		});
	}

    //报修记录
    function findList(currBxjl){
        $.ajax({
            url:global.url+"/bxUser/wxRepairList",
            type:"POST",
            data:{
                openid:openid,
                universityId:universityId,
                currentPage:currBxjl || 1,
                pageSize:nums
            },
            async:false,
            dataType: "json",
            success: function(data) {
                $("#bxjl_loading").hide();
                if(data.code==100000){
                    var str = "";
                    $.each(data.data.list,function(n,item){
                        str +='<a href="'+global.url+'/wechat/orderDetails?universityId='+
                            universityId+'&repairId='+item.id+'&openid='+openid+'&subOpenid='+subOpenid+'&repairCode='+item.repairCode+'" class="weui-media-box weui-media-box_appmsg weui-media-box_appmsg_img">';
                        str +='<div class="weui-media-box__hd weui-media-box__hd_img">';
                        str +='<img class="weui-media-box__thumb weui-media-box__thumb_img" src="'+global.url+'/static/WeChatA/StudentManage/image/icon_user1.png" alt="">';
                        str +='<span>'+item.repairMan+'</span>';
                        str +='</div>';
                        str +='<div class="weui-media-box__bd">';
                        str +='<h4 class="weui-media-box__title weui-media-box__title_gg">'+(item.repairContent.length>10?item.repairContent.substring(0,10)+"...":item.repairContent)+'</h4>';
                        str +='<div class="weui-cell__hd" style="display:table; width: 100%; position: relative;">';
                        str +='<img src="'+global.url+'/static/WeChatA/StudentManage/image/icon_add.png" alt="" class="icon-add">';
                        str +='<span class="weui-media-box__desc_add">'+item.repairAddress+'</span>';
                        if(item.repairStateName.substring(1,3)=="审核"){
                            str +='<button class="weui-media-box_btn btn_blue">'+item.repairStateName.substring(1,3)+'</button>';
                        }else if(item.repairStateName.substring(1,3)=="派工"){
                            str +='<button class="weui-media-box_btn btn—green">'+item.repairStateName.substring(1,3)+'</button>';
                        }else if(item.repairStateName.substring(1,3)=="转单"){
                            str +='<button class="weui-media-box_btn btn—orange">'+item.repairStateName.substring(1,3)+'</button>';
                        }else if(item.repairStateName.substring(1,3)=="完工"){
                        	if(item.hasEval==1){
                        		 str +='<button class="weui-media-box_btn btn-gray">评价</button>';
                        	}else{
                        		 str +='<button class="weui-media-box_btn btn-gray">'+item.repairStateName.substring(1,3)+'</button>';
                        	}
                        }else if(item.repairStateName.substring(1,3)=="退回"){
                            str +='<button class="weui-media-box_btn btn—red">'+item.repairStateName.substring(1,3)+'</button>';
                        }else if(item.repairStateName=="发起收费"){
                            str +='<button class="weui-media-box_btn btn—green">'+item.repairStateName+'</button>';
                        }else {
                            str +='<button class="weui-media-box_btn btn_blue">'+item.repairStateName.substring(1,3)+'</button>';
                        }
                        str +='</div>';
                        str +='<div class="weui-cell__hd" style="display:table; width: 100%;">';
                        str +='<img src="'+global.url+'/static/WeChatA/StudentManage/image/icon_time.png" alt="" class="icon-add" style="width: 16px;">';
                        str +='<span class="weui-media-box__desc_add">'+item.repairTime+'</span>';
                        str +='</div>';
                        str +='</div>';
                        str +='</a>';
                    });
                    if(!(data.data.page.pageTotal>currBxjl)){
                        $("#bxjl_clickLoad").hide();
                        // $("#bxjl_empty").show();
                    }else{
                        $("#bxjl_clickLoad").show();
                        $("#bxjl_empty").hide();
                    }
                    if(str!=""){
                        $("#bxjl_empty").hide();
                    }
                    $("#findList").append(str);
                    //取消操作
                    $('.btn-confirm').off('click').on('click', function(){
                        $("#iosDialog2").css('opacity','1').css('display','block');
                        $("#iosDialog2").find("a").eq(1).attr("data-id",$(this).attr("data-id"));
                    });
                }else{
                    $("#bxjl_empty").show();
                }
            }
        });
    }

    //报修广场
    function repFindList(currBxgc){
		$.ajax({
			url:global.url+"/bxUser/wxQuery",
			type:"POST",
			data:{
				openid:openid,
				universityId:universityId,
				currentPage:currBxgc || 1,
				pageSize:nums,
				startTime:'',
				endTime:''
			},
			async:false,
			dataType: "json",
			success: function(data) {
                $("#gggc_loading").hide();
				if(data.code==100000){
					var str = "";
					$.each(data.data.list,function(n,item){
                        str +='<a class="weui-cell weui-cell_access"  href="'+global.url+'/wechat/orderDetails?universityId='+
                            universityId+'&repairId='+item.id+'&openid='+openid+'&repairCode='+item.repairCode+'">';
                        str +='<div class="weui-cell__bd">';
                        str +='<p class="square-area">'+item.repairProjectName+'</p>';
                        str +='<p class="square-project">'+item.repairAddress+'</p>';
                        str +='<ul class="weui-media-box__info" style="font-size: 0.75rem">';
                        str +='<li class="weui-media-box__info__meta">'+item.repairTime+'</li>';
                        str +='<li class="weui-media-box__info__meta weui-media-box__info__meta_extra">'+item.repairMan+'</li>';
                        str +='</ul>';
                        if(item.repairStateName=="未审核"){
                            str +='<i class="state orange">'+item.repairStateName+'</i>';
                        } else if(item.repairStateName=="已受理"){
                            str +='<i class="state blue">'+item.repairStateName+'</i>';
                        } else if(item.repairStateName=="已派工"){
                            str +='<i class="state blue">'+item.repairStateName+'</i>';
                        } else if(item.repairStateName=="已转单"){
                            str +='<i class="state orange">'+item.repairStateName+'</i>';
                        } else if(item.repairStateName=="已撤回"){
                            str +='<i class="state orange">'+item.repairStateName+'</i>';
                        } else if(item.repairStateName=="已完工" && item.hasEval=="0"){
                            str +='<i class="state green">'+item.repairStateName+'</i>';
                        } else if(item.repairStateName=="已完工" && item.hasEval=="1"){
                            str +='<i class="state green">已评价</i>';
                        } else if(item.repairStateName=="已暂停"){
                            str +='<i class="state orange">'+item.repairStateName+'</i>';
                        } else if(item.repairStateName=="已取消"){
                            str +='<i class="state red">'+item.repairStateName+'</i>';
                        } else if(item.repairStateName=="已退回"){
                            str +='<i class="state red">'+item.repairStateName+'</i>';
                        } else {
                            str +='<i class="state blue">'+item.repairStateName+'</i>';
                        }
                        str +='</div>';
                        str +='<div class="weui-cell__ft weui-cell__ft__sh"></div></a>';
						// str += '<li><p class="square-area">'+item.repairProjectName+'</p><p class="square-project">'+item.repairAddress+'</p><p class="square-time">'+item.repairTime+'</p><i>'+item.repairStateName+'</i></li>';
					});
                    if(str!=""){
                        $("#gggc_empty").hide();
                    }
					$("#repFindList").append(str);
                    if(!(data.data.page.pageTotal>currBxgc)){
                        $("#gggc_clickLoad").hide();

                    }else{
                        $("#gggc_clickLoad").show();
                        $("#gggc_empty").hide();
                    }
				}else{
                    $("#gggc_empty").show();
                }
			}
		});
	}

    //报修公告
    function nocFindList(currBxgg){
    	$.ajax({
    		url:global.url+"/notice/wxQuery",
    		type:"POST",
    		data:{
    			openid:openid,
    			universityId:universityId,
    			currentPage:currBxgg || 1,
    			pageSize:nums,
    		},
    		async:false,
    		dataType: "json",
    		success: function(data) {
                $("#bxgg_loading").hide();
    			if(data.code==100000){
    				var str = "";
    				$.each(data.data.list,function(n,item){
                        str +='<a class="weui-cell weui-cell_access" href="'+global.url+'/notice/wxDetail?universityId='+
                            universityId+'&id='+item.id+'&openid='+openid+'" id="'+item.id+'">';
                        str +='<div class="weui-cell__bd">';
                        str +='<p class="notice-title">'+item.title+'</p>';
                        str +='<p class="notice-content">'+item.content+'</p>';
//                        str +='<p class="notice-title">'+(item.title.length>10)?(item.title.substring(0,10)+"..."):item.title+'</p>';
//                        str +='<p class="notice-content">'+(item.content.length>16)?item.content.substring(0,16)+"...":item.content+'</p>';
                        str +='<i class="time">'+item.startTime+'</i>';
                        str +='</div>';
                        str +='<div class="weui-cell__ft weui-cell__ft__sh">';
                        str +='</div>';
                        str +='</a>';
    				});
                    if(str!=""){
                        $("#bxgg_empty").hide();
                    }
    				$("#notFindList").append(str);
                    if(!(data.data.page.pageTotal>currBxgg)){
                        $("#bxgg_clickLoad").hide();
                        // $("#bxgg_empty").show();
                    }else{
                        $("#bxgg_clickLoad").show();
                        $("#bxgg_empty").hide();
                    }
    			}else{
                    // $("#bxgg_empty").show();
                }
    		}
    	});
    }

    //完工未评价工单
    function completion(){
        var repairParam = "";
        $.ajax({
            url:global.url+"/wechat/noEvaluation",
            data:{
                universityId:universityId,
                openid:openid
            },
            type:"POST",
            dataType:'json',
            async:false,
            success:function(data){
                if(data.code==100000){
                    if(data.data.list.length>0){
                        var repairId = data.data.list[0].id;
                        var repairCode = data.data.list[0].repairCode;
                        repairParam = '&openid='+openid+'&repairId='+repairId+'&repairCode='+repairCode;
                    }
                }
            }
        });
        return repairParam;
    }
    //创建多级联动
    function InitSelectView(key, cnt, value) {
        if (value != null) {
            window.sessionStorage.setItem(key + "root", JSON.stringify(value));
        }

        var count = countObj(value);
        for (var i = 0; i < count; i++) {
            if (value[i]["id"] != "") ////content->value
            InitSelectTree(value[i]["id"], cnt - 1, value[i]["list"]); //content->value
        }
        AddValueToSelect(key);
    }
    //创建多级联动
    function InitSelectTree(key, cnt, value) {
        if (cnt == 0) return;
        if (value == null || value == "null" || countObj(value) == 0) return;
        window.sessionStorage.setItem(key, JSON.stringify(value));
        var count = countObj(value);
        for (var i = 0; i < count; i++) {
            if (value[i]["id"] != ""){
                InitSelectTree(value[i]["id"], cnt - 1, value[i]["list"]); //content->value
            }
        }
    }
    //创建多级联动
    function AddValueToSelect(key) {
        var rootValue = window.sessionStorage.getItem(key + "root");
        if (rootValue != "" && rootValue != undefined && rootValue != null) {
            rootValue = JSON.parse(rootValue);
            var rootselect = document.getElementById(key + "0");
            rootselect.options.length = 0;
            var flag = false;
            var count = countObj(rootValue);

            rootselect.options[rootselect.options.length] = new Option("请选择", "null");

            for (var i = 0; i < count; i++) {
                if (rootValue[i]["id"] != "") //content->value
                {
                    rootselect.options[rootselect.options.length] = new Option(rootValue[i]["name"], rootValue[i]["id"]); //content->value
                    var selectoptions = window.sessionStorage.getItem(rootValue[i]["id"]); //content->value
                    if (selectoptions != "" && selectoptions != undefined && selectoptions != null && !flag) {
                        AddSubValueToSelect(JSON.parse(selectoptions), key, 1);
                        flag = true;
                    }
                }
            }
        }
    }


    //我知道了
    $('.know').on('click', function(){
        $(this).parents('.js_dialog').css('opacity','0').css('display','none');
    });


    //取消工单
    function cancelRepair(id){
        $.ajax({
            url:global.url+"/bxUser/updateToCancel",
            type: "POST",
            data: {
                universityId:universityId,
                openid:openid,
                id:id
            },
            dataType: "json",
            success: function(data){
                if(data.code=10000){
                    $("#findList").empty();
                    currBxjl = 1;
                    findList(currBxjl);
                }else{
                }
            }
        });
    }
    //信息获取
    function bxUser(){
        $("input[name='repairMan']").val(global.realName);
    	if(openid!=""){
    		$.ajax({
        		url:global.url+"/bxUser/wxQueryBxUser",
        		type:"POST",
        		data:{
        			universityId:universityId,
        			openid:openid
        		},
        		dataType:"json",
                async:false,
        		success:function(data){
        			if(data.code==100000){
    					$.each(data.data.list,function(n,item){
    						$("input[name='repairAddress']").val(item.repairAddress);
        					$("input[name='repairMan']").val(item.repairMan);
        					$("input[name='repairManPhone']").val(item.repairManPhone);
    					});
        			}
        		}
        	});
    	}
        if(global.qrParam!=''){
            var qrParam = JSON.parse(global.qrParam);
            var repairAreaCode = qrParam.area;
            var repairProjectCode = qrParam.project;
            var repairaddress = qrParam.address;
            var repairContent = qrParam.content;
            if($("input[name='repairAddress']").length==1){
                $("input[name='repairAddress']").val(repairaddress);
            }
            if($("textarea[name='repairContent']").length==1){
                $("textarea[name='repairContent']").val(repairContent);
            }
            if(repairAreaCode!=''){
                var areaList= new Array();
                areaList = repairAreaCode.split(',');
                var area0 = (typeof areaList[0] == "undefined")?'null':areaList[0];
                var area1 = (typeof areaList[1] == "undefined")?'null':areaList[1];
                var area2 = (typeof areaList[2] == "undefined")?'null':areaList[2];
                if($("#repairArea0").length==1){
                    $("#repairArea0").val(area0);
                    $('#repairArea0').trigger("change");
                    if($("#repairArea1").length==1){
                        $("#repairArea1").val(area1);
                        $('#repairArea1').trigger("change");
                        if($("#repairArea2")){
                            $("#repairArea2").val(area2);
                            $('#repairArea2').trigger("change");
                        }
                    }
                }
            }
            if(repairProjectCode!=''){
                var projectList= new Array();
                projectList = repairProjectCode.split(',');
                var project0 = (typeof projectList[0] == "undefined")?'null':projectList[0];
                var project1 = (typeof projectList[1] == "undefined")?'null':projectList[1];
                var project2 = (typeof projectList[2] == "undefined")?'null':projectList[2];
                if($("#repairProject0").length==1){
                    $("#repairProject0").val(project0);
                    $('#repairProject0').trigger("change");
                    if($("#repairProject1").length==1){
                        $("#repairProject1").val(project1);
                        $('#repairProject1').trigger("change");
                        if($("#repairProject2").length==1){
                            $("#repairProject2").val(project2);
                            $('#repairProject2').trigger("change");
                        }
                    }
                }
            }
        }
    }

    if(window.sessionStorage.getItem('studentManage_sign')=="wybx"){
        formT();
    }else if(window.sessionStorage.getItem('studentManage_sign')=="bxjl"){
        $("#bxjl").trigger("click");
    }else if(window.sessionStorage.getItem('studentManage_sign')=="gggc"){
        $("#gggc").trigger("click");
    }else{
        if(global.squareRepair=="1"){
            $("#gggc").trigger("click");
        } else if (global.squareRepair=="2"){
            $("#bxjl").trigger("click");
        }else{
            formT();
        }
    }
});

//错误提示
function errorPrompt(text){
    $('#iosDialogText').empty().append(text);
    $('#iosDialog').css('opacity','1').css('display','block');
}
//下拉框改变事件
function changeSelect(ob) {
	if($(ob).attr('data-key')=="appointmentTime"){
        $(ob).next().val(ob.options[$(ob).prop('selectedIndex')].text);
    }else{
        $(ob).next().val($(ob).val());
    }
    if ($(ob).val() == "null") {
    	$(ob).next().val("");
        while ($(ob).parent().parent().next().find("select").length > 0) {
            $(ob).parent().parent().next().hide();
            ob = $(ob).parent().parent().next().find("select")[0];
        }
        return;
    }
    var key = $(ob).data("key");
    var launchnum = parseInt($(ob).data("launchnum"));
    var currentselect = $(ob).attr("id");
    var cnt = parseInt(currentselect.replace(key, ""));
    var value = JSON.parse(window.sessionStorage.getItem($(ob).val()));
    if(launchnum>cnt + 1){
        AddSubValueToSelect(value, key, cnt + 1);
        if ($(ob).parent().parent().next().find("select").length > 0) {
            $(ob).parent().parent().next().show();
        }
    }
}
//报修单数据验证
function submitBx(){
    $("#submitBx").on('click',function(){
        var flag = true;
        var picURL = "";
        if($('.weui_uploader_status_content').length>0){
            errorPrompt("请等待图片上传完毕");
            flag = false;
            return false;
        }
        $.each($('.weui_uploader_files li'),function(){
        	if($(this).attr('data-value')==null||$(this).attr('data-value')==""||$(this).attr('data-value')=="null"){
            	flag = false;
            }
            picURL += $(this).attr('data-value')+",";
        });
        if(!flag){
        	errorPrompt("请等待图片上传完毕");
        	return false;
        }
        if(picURL!=""){
            picURL = picURL.substring(0,picURL.length-1);
        }
        $("#picURL").val(picURL);
        $("#submitBx").attr('disabled', true);
        var repairAreaCode = "";
        $.each($(".repairArea"),function(){
            if($(this).val()==""){
                errorPrompt("请选择完整的区域");
                flag = false;
                return false;
            }
            repairAreaCode += $(this).val()+","
        });
        $("#repairArea").val(repairAreaCode.substring(0,repairAreaCode.length-1));
        if(flag){
            var repairProjectCode = "";
            $.each($(".repairProject"),function(){
                if($(this).val()==""){
                    errorPrompt("请选择完整的项目");
                    flag = false;
                    return false;
                }
                repairProjectCode += $(this).val()+","
            });
            $("#repairProject").val(repairProjectCode.substring(0,repairProjectCode.length-1));
        }
        if(flag&&$("#appointmentTime").length==1){
            var appointmentTimeName = "";
            $.each($(".appointmentTime"),function(){
                if($(this).val()==""){
                    errorPrompt("请选择完整的预约时间");
                    flag = false;
                    return false;
                }
                appointmentTimeName += $(this).val()+"/"
            });
            $("#appointmentTime").val(appointmentTimeName.substring(0,appointmentTimeName.length-1));
        }
        if(flag){
            $.each($('.check'),function(n,item){
                if($(this).attr('data-reqired')=="1"){
                    if($(this).val()==""){
                        errorPrompt($(this).attr('data-value')+"不能为空");
                        flag = false;
                        return false;
                    }
                }
            });
        }
        if(flag){
            if($("#datetime-picker").val()!=""){
                var now = new Date();
                var newtime = now.getFullYear()+"-"+((now.getMonth()+1)<10?"0":"")+(now.getMonth()+1)+"-"+(now.getDate()<10?"0":"")+now.getDate()+ "T" + (now.getHours()<10?"0":"")+now.getHours() + ":" + (now.getMinutes()<10?"0":"")+now.getMinutes();
                // if($("#datetime-picker").attr('data-reqired')=="1"){
                    if($("#datetime-picker").val()<newtime){
                        errorPrompt($("#datetime-picker").attr('data-value')+"不能低于今日");
                        flag = false;
                    }
                    if(flag&&$("#datetime-picker").attr('min')!=""&&$("#datetime-picker").val()<$("#datetime-picker").attr('min')){
                        errorPrompt($("#datetime-picker").attr('data-value')+"不能低于"+$("#datetime-picker").attr('min').replace('T', ' '));
                        flag = false;
                    }
                    if(flag&&$("#datetime-picker").attr('max')!=""&&$("#datetime-picker").val()>$("#datetime-picker").attr('max')){
                        errorPrompt($("#datetime-picker").attr('data-value')+"不能高于"+$("#datetime-picker").attr('max').replace('T', ' '));
                        flag = false;
                    }
                // }
            }
        }
        if(flag){//满足提交条件
            submit();
        }else{
            $("#submitBx").removeAttr('disabled');
            return false;
        }
    });
}

//提交报修单
function submit(){
    $.ajax({
        url:global.url+"/bxForm/addBx",
        type: "POST",
        data: $('#_form').serialize(),
        dataType: "json",
        success: function(data){
            if(typeof data.repairParam!="undefined"&&data.repairParam!=""){
                $('#iosDialog3').css('opacity','1').css('display','block');
                $('#iosDialog3').find('a').attr('href',global.url+'/wechat/orderDetails?universityId='+global.universityId+'&openid='+openid+data.repairParam);
            }else if(data.code==100000){
                $('#iosDialog1').css('opacity','1').css('display','block');
            }else{
                errorPrompt(data.msg);
            }
        }
    });
}

function countObj(o) {
    var t = typeof o;
    if(t == 'string') {
        return o.length;
    }else if (t == 'object') {
        var n = 0;
        for (var i in o) {
            n++;
        }
        return n;
    }
    return false;
};

//查看详细
function AnalogClick(){
    $(this).parents('.js_dialog').css('opacity','0').css('display','none');
    $("#bxjl").trigger("click");
    $("#bxjl").trigger("click");
}

//多级下拉框生成
function AddSubValueToSelect(value, key, cnt) {
    var currentSelect = document.getElementById(key + cnt);
    if (currentSelect == "" || currentSelect == null || currentSelect == undefined) return;
    currentSelect.options.length = 0;
    currentSelect.options[currentSelect.options.length] = new Option("请继续选择", "null");
    var level =cnt;
    if(currentSelect.parentNode.childElementCount > 1){
    	while(level<$(currentSelect).attr('data-launchnum')){
    		if(document.getElementById(key + level).parentNode.childElementCount > 1){
    			document.getElementById(key + level).parentNode.lastChild.value="";
    		}
	    	level++;
	    }
    }
    var count = countObj(value);
    if (count > 0) {
        var flag = false;
        for (var i = 0; i < count; i++) {
            if (value[i]["name"] != "") {
                currentSelect.options[currentSelect.options.length] = new Option(value[i]["name"], value[i]["id"]); //content->value
                if (!flag) {
                    var selectoptions = window.sessionStorage.getItem(value[i]["id"]); //content->value
                    if (selectoptions != "" && selectoptions != undefined && selectoptions != null) {
                        AddSubValueToSelect(JSON.parse(selectoptions), key, cnt + 1);
                        flag = true;
                    }
                }
            }
        }
    }
}

