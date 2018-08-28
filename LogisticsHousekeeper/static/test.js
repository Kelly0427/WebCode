var universityId = global.universityId;
var repairId = global.repairId;
var openid = global.openid;
var subOpenid = global.subOpenid;
var reminderLimit = global.reminderLimit;
var repairTime = global.repairTime;
var workPhone = "";
//页面初始化
function init(){
    // ios
    var $iosActionsheet = $('#iosActionsheet');
    var $iosMask = $('#iosMask');

    function hideActionSheet() {
        $iosActionsheet.removeClass('weui-actionsheet_toggle');
        $iosMask.css('opacity','0').css('display','none');
    }

    $iosMask.on('click', hideActionSheet);
    $('#iosActionsheetCancel').on('click', hideActionSheet);
    $("#showIOSActionSheet").on("click", function(){
        $iosActionsheet.addClass('weui-actionsheet_toggle');
        $iosMask.css('opacity','1').css('display','block');
    });
    var payOrder = false;
    $("#payOrder").on("click", function(){
        if(payOrder){
            return;
        }
        payOrder = true;
        var orderId = $(this).attr("data_id");
        $.ajax({
            url:global.url+"/pay/payMothed",
            type:"GET",
            data:{
                universityId:universityId
            },
            dataType:"json",
            success:function(data){
                if(data.code==100000){
                    if(data.data.payMethod==0 || data.data.payMethod==1){
                        var url = global.url+"/pay/payRedirect?universityId="+universityId+"&orderId="+orderId+"&openid="+global.openid +'&subOpenid='+subOpenid;
                        window.location.assign(url);
                    }else if(data.data.payMethod==2){
                        var url = global.url+"/pay/directPayOrder?universityId="+universityId+"&orderId="+orderId+"&openid="+global.openid +'&subOpenid='+subOpenid;

                        $.getJSON(url,function(json){
                            if(json.code=="100000"){
                                var wxPub = json.data;
                                var data2 = {
                                    "appId":""+wxPub.appId+"",
                                    "timeStamp":""+wxPub.timeStamp+"",
                                    "nonceStr":""+wxPub.nonceStr+"",
                                    "package":""+wxPub.prenumber+"",
                                    "signType":""+wxPub.signType+"",
                                    "paySign":""+wxPub.paySign+""
                                }
                                function onBridgeReady(){
                                    WeixinJSBridge.invoke(
                                        'getBrandWCPayRequest', data2 ,function(res){
                                            if(res.err_msg == "get_brand_wcpay_request:ok"){
                                                $("#payOrder").hide();
                                                $("#payOrder").parent().next().find('span').text("已缴费");
                                            }else if(res.err_msg == "get_brand_wcpay_request:cancel"){
                                                payOrder = false;
                                            }else{
                                                location.reload(false);
                                            }
                                        }
                                    );
                                }
                                if (typeof WeixinJSBridge == "undefined"){
                                    if( document.addEventListener ){
                                        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                                    }else if (document.attachEvent){
                                        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                                        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                                    }
                                }else{
                                    onBridgeReady();
                                }
                            }else{
                                payOrder=false;
                                $.alert("下单失败，请稍后再试");
                            }
                        });
                    }else{
                        $.alert("支付渠道未开通");
                    }
                }else{
                    $.alert(data.msg);
                }
            }
        });

    });


    // android
    var $androidActionSheet = $('#androidActionsheet');
    var $androidMask = $androidActionSheet.find('.weui-mask');

    $("#showAndroidActionSheet").on('click', function(){
        $androidActionSheet.fadeIn(200);
        $androidMask.on('click',function () {
            $androidActionSheet.fadeOut(200);
        });
    });

    var  $iosDialog1 = $('.iosDialog1-cancel');

    //确定/取消按钮
    $('.weui-dialog__btn').on('click', function(){
        $(this).parents('.js_dialog').css('opacity','0').css('display','none');
        if($(this).text()=="确认"){
            cancelRepair(global.repairId);
        }
    });

    //取消提示框
    $('.cancel-botton').on('click', function(){
        // $iosDialog1.css('opacity','1').css('display','block');
        $.modal({
            title: '提醒',
            text: '确认取消此工单',
            buttons: [
                { text: "不，我在想想", className: "default", onClick: function(){} },
                { text: "确定", onClick: function(){ cancelRepair(global.repairId);} }
            ]
        });
    });

    //确认完工提示框
    $('#checkCompletion').on('click', function(){
        // $iosDialog1.css('opacity','1').css('display','block');
        $.modal({
            title: '提醒',
            text: '确认完工此工单',
            buttons: [
                { text: "不，我在想想", className: "default", onClick: function(){} },
                { text: "确定", onClick: function(){ checkCompletion(global.repairId);} }
            ]
        });
    });

}

//评论星级
window.onload = function () {
    var s = document.getElementById("pingStar"),
        m = document.getElementById('dir'),
        n = s.getElementsByTagName("li"),
        input = document.getElementById('startP'); //保存所选值
    clearAll = function () {
        for (var i = 0; i < n.length; i++) {
            n[i].className = '';
        }
    }
    for (var i = 0; i < n.length; i++) {
        n[i].onclick = function () {
            $('.evaluate-text').css('display','block').css('margin-top','-20px;');
            $('.title-choose').css('display','none');
            $('.evaluateBox').css('margin-top','-30px;');
            $('.submit-btn').find('a').css('background','#288feb').css('color','#fff');
            var q = this.getAttribute("rel");
            clearAll();
            input.value = q;
            for (var i = 0; i < q; i++) {
                n[i].className = 'active';
            }
            m.innerHTML = this.getAttribute("title");
        }
        n[i].onmouseover = function () {
            var q = this.getAttribute("rel");
            clearAll();
            for (var i = 0; i < q; i++) {
                n[i].className = 'active';
            }
        }
        n[i].onmouseout = function () {
            clearAll();
            for (var i = 0; i < input.value; i++) {
                n[i].className = 'active';
            }
        }
    }
    onload1();
    onload2();
    onload3();
}

onload1 = function () {
    var s1 = $(".pingStar-s"),
        n1 = s1.find(".pingStar-s-li"),
        input1 = $('.startP-s'); //保存所选值
    clearAll1 = function () {
        for (var i = 0; i < n1.length; i++) {
            n1[i].className = '';
        }
    }
    for (var i = 0; i < n1.length; i++) {
        n1[i].onclick = function () {
            $('.evaluate-text').css('display', 'block');
            $('.title-choose').css('display', 'none');
            $('.evaluateBox').css('margin-top', '-30px;');
            $('.submit-btn').find('a').css('background', '#288feb').css('color', '#fff');
            var q = this.getAttribute("rel");
            clearAll1();
            input1.val(q);
            for (var i = 0; i < q; i++) {
                n1[i].className = 'active';
            }
        }

    }

}
onload2 = function () {
    var s2 = $(".pingStar-z"),
        n2 = s2.find(".pingStar-z-li"),
        input2 = $('.startP-z'); //保存所选值
    clearAll2 = function () {
        for (var i = 0; i < n2.length; i++) {

            n2[i].className = '';
        }
    }
    for (var i = 0; i < n2.length; i++) {
        n2[i].onclick = function () {
            $('.evaluate-text').css('display', 'block');
            $('.title-choose').css('display', 'none');
            $('.evaluateBox').css('margin-top', '-30px;');
            $('.submit-btn').find('a').css('background', '#288feb').css('color', '#fff');
            var q = this.getAttribute("rel");
            clearAll2();
            input2.val(q);
            for (var i = 0; i < q; i++) {
                n2[i].className = 'active';
            }
        }
    }
}
onload3 = function () {
    var s3 = $(".pingStar-t"),
        n3 = s3.find(".pingStar-t-li"),
        input3 = $('.startP-t'); //保存所选值
    clearAll3 = function () {
        for (var i = 0; i < n3.length; i++) {
            n3[i].className = '';
        }
    }
    for (var i = 0; i < n3.length; i++) {
        n3[i].onclick = function () {
            $('.evaluate-text').css('display', 'block');
            $('.title-choose').css('display', 'none');
            $('.evaluateBox').css('margin-top', '-30px;');
            $('.submit-btn').find('a').css('background', '#288feb').css('color', '#fff');
            var q = this.getAttribute("rel");
            clearAll3();
            input3.val(q);
            for (var i = 0; i < q; i++) {
                n3[i].className = 'active';
            }
        }
    }
}

//页面初始化
$(function(){
    FastClick.attach(document.body);
    loading();
});
//加载数据
function loading(){
    $.ajax({
        url:global.url+"/bxFormStatus/wxFind",
        type: "POST",
        data: {
            universityId:universityId,
            repairId:repairId,
            openid:openid
        },
        dataType: "json",
        success: function(data){
            if(data.code==100000){
                var str = "";
                var detail = data.data.detail;
                $("#repairMan").text("报修人："+detail.repairMan);
                $("#repairTime").text("报修时间："+detail.repairTime);
                $("#repairProject").text(detail.repairProject);
                $("#repairAddress").text(detail.repairAddress);
                $("#repairContent").text(detail.repairContent);
                if(detail.repairPic.length>0){
                    var array=[];
                    var pics = detail.repairPic.split("&");
                    for(var i=0;i<pics.length;i++){
                        array.push(pics[i].split(",")[0]+",w_600");
                        str+='<div class="weui-flex__item pb-popup" data-url="'+pics[i]+'" data-number='+(i)+'><img class="bx_img" src="'+pics[i]+'"  style="height:80px;width:80px;"/></div>';
                    }
                    $('#repairUrl').empty().append(str);
                    var myPhotoBrowserPopup = $.photoBrowser({
                        items:array
                    });
                    $('.pb-popup').off('click').on('click',function(){
                        var index = $(this).attr('data-number')
                        myPhotoBrowserPopup.open(index);
                    });
                }
                if(data.data.assistantRepair == "1"){
                    $('#zzfw').parent().css('display','block');
                    $('#zzfw').attr('src',data.data.assistantRepairPic);
                    $('#zzfw').parent().attr('onclick','window.location.href=\"'+global.url+'/picJumpPage?universityId='+universityId+'\"');
                }
                str = '';
                var len = data.data.list.length;
                var permitFlag = false;
                $.each(data.data.list,function(n,item){
                    if(n == 0){
                        str +='<div class="repair-speed ">'
                            +'<div class="speed-point speed-green"></div>';
                        if(len>1){
                            str +='<div class="speed-line speed-green"></div>';
                        }
                        if(item.statusName=="已撤回"){
                            str +='<div class="repair-speed-li"><i class="repair-speed-tip speed-green">已撤回</i><span class="repair-speed-time">'+item.time+'</span>';
                        }else {
                            str +='<div class="repair-speed-li"><i class="repair-speed-tip speed-green">'+item.statusName+'</i><span class="repair-speed-time">'+item.time+'</span>';
                        }

                        if(item.status=='10' && item.reminder=='1'){
                            str +='<button class="weui-media-box_btn btn-green cancel-botton" >取消</button>';
                        }else if(item.status=='13' && item.reminder=='1' ){
                            workPhone = item.workPhone;
                            str +='<a id="workPhone" class="weui-media-box_btn btn-green">催单</a>';
                        }else if(item.status=='14' && item.reminder=='1'){
                            str +='<button class="weui-media-box_btn btn-green" id="showIOSActionSheet">评价</button>';
                        }else if(item.status=='31' && item.reminder=='1'){
                            str +='<button class="weui-media-box_btn btn-green" id="checkCompletion">确认完工</button>';
                        }else if(item.status=="32"){
                            if(item.payStatus=='0' && item.reminder=='1'){
                                str +='<button class="weui-media-box_btn btn-green" id="payOrder" data_id="'+item.orderId+'">付费</button>';
                            }else{
                                permitFlag = true;
                            }

                        }
                        str+='</div>';
                    }else if(n==len-1){
                        str +='<div class="repair-speed ">'
                            +'<div class="speed-point speed-blue"></div>'
                            +'<div class="repair-speed-li"><i class="repair-speed-tip speed-blue">'+item.statusName+'</i><span class="repair-speed-time">'+item.time+'</span></div>';
                    }else{
                        str +='<div class="repair-speed ">'
                            +'<div class="speed-point speed-blue"></div>'
                            +'<div class="speed-line speed-blue"></div>'
                            +'<div class="repair-speed-li"><i class="repair-speed-tip speed-blue">'+item.statusName+'</i><span class="repair-speed-time">'+item.time+'</span>';
                        if(permitFlag){
                            if(item.status=='13' && item.reminder=='1' ){
                                workPhone = item.workPhone;
                                str +='<a id="workPhone" class="weui-media-box_btn btn-green">催单</a>';
                                permitFlag = false;
                            }else if(item.status=='14' && item.reminder=='1'){
                                str +='<button class="weui-media-box_btn btn-green" id="showIOSActionSheet">评价</button>';
                                permitFlag = false;
                            }
                        }
                        str +='</div>';
                    }
                    if(item.status=='10'){
                        str	+='<div class="repair-speed-li"><i class="repair-speed-detail">报修人：</i><span class="repair-speed-content">'+item.repairMan+'</span></div>'
                            +'<div class="repair-speed-li"><i class="repair-speed-detail">报修内容：</i><span class="repair-speed-content">'+item.repairContent+'</span></div>'
                            +'</div>';
                    }else if(item.status=='12'){
                        str	+='<div class="repair-speed-li"><i class="repair-speed-detail">处理人：</i><span class="repair-speed-content">'+((item.name==null||item.name==""||item.name=="null")?'系统自动受理':item.name)+'</span></div>'
                            +'<div class="repair-speed-li"><i class="repair-speed-detail">备注：</i><span class="repair-speed-content">'+item.stateNote+'</span></div>'
                            +'</div>';
                    }else if(item.status=='13'){
                        str	+='<div class="repair-speed-li"><i class="repair-speed-detail">处理人：</i><span class="repair-speed-content">'+((item.name==null||item.name==""||item.name=="null")?'系统自动派工':item.name)+'</span></div>'
                            +'<div class="repair-speed-li"><i class="repair-speed-detail">派工对象：</i><span class="repair-speed-content">'+item.workNo+'</span></div>'
                            +'<div class="repair-speed-li"><i class="repair-speed-detail">备注：</i><span class="repair-speed-content">'+item.stateNote+'</span></div>'
                            +'</div>';
                    }else if(item.status=='15'){
                        str	+='<div class="repair-speed-li"><i class="repair-speed-detail">评价人：</i><span class="repair-speed-content">'+item.name+'</span></div>'
                            +'<div class="repair-speed-li"><i class="repair-speed-detail">满意度：</i><span class="repair-speed-content">'+item.evaluateName+'</span></div>'
                            +'<div class="repair-speed-li"><i class="repair-speed-detail">评价内容：</i><span class="repair-speed-content">'+item.content+'</span></div>'
                            +'</div>';
                    }else if(item.status=='20'){
                        str	+='<div class="repair-speed-li"><i class="repair-speed-detail">回复人：</i><span class="repair-speed-content">'+item.name+'</span></div>'
                            +'<div class="repair-speed-li"><i class="repair-speed-detail">回复内容：</i><span class="repair-speed-content">'+item.content+'</span></div>'
                            +'</div>';
                    }else if(item.status=='31') {
                        str += '<div class="repair-speed-li"><i class="repair-speed-detail">处理人：</i><span class="repair-speed-content">' + item.name + '</span></div>'
                            + '<div class="repair-speed-li"><i class="repair-speed-detail">备注：</i><span class="repair-speed-content">' + item.stateNote + '</span></div>'


                        if (item.picUrl != null) {
                            var pics = item.picUrl.split(',');

                            // str += '<div class="repair-speed-li"><i class="repair-speed-detail">图片：</i>' +
                            //     '<span class="repair-speed-content">';

                            if (pics.length > 0 && pics[0] != '') {
                                str += '<div class="repair-speed-li"><i class="repair-speed-detail">完工照片：</i>';
                                str += '<div class="weui-media-box weui-media-box_appmsg">';
                                for (var i = 0; i < pics.length; i++) {
                                    str += '<div class="weui-media-box__hd"><a target="view_window" href="' + pics[i] + '" rel="lightbox[roadtrip]"  class="img-circle picture"><img src="' + pics[i] + '"  class="weui-media-box__thumb"/></a></div>';
                                }
                                str += '</div></div></div>';
                            }


                            //str +='</span></div>';


                        }
                        str += '</div>';
                    }else if(item.status=='32'){
                        str	+='<div class="repair-speed-li"><i class="repair-speed-detail">付费状态：</i><span class="repair-speed-content">'+item.payStatusName+'</span></div>'
                            +'<div class="repair-speed-li"><i class="repair-speed-detail">付费金额：</i><span class="repair-speed-content">'+item.money+'</span></div>'
                            +'<div class="repair-speed-li"><i class="repair-speed-detail">付费耗材：</i><span class="repair-speed-content">';
                        $.each(item.materialList,function(n,item){
                            if(n>0){
                                str	+= ","
                            }
                            str	+= item.name+"*"+item.count;
                        });
                        str	+='</span></div>'
                            +'<div class="repair-speed-li"><i class="repair-speed-detail">备注：</i><span class="repair-speed-content">'+item.remark+'</span></div>'
                            +'</div>';
                    }else{
                        str	+='<div class="repair-speed-li"><i class="repair-speed-detail">处理人：</i><span class="repair-speed-content">'+item.name+'</span></div>'
                            +'<div class="repair-speed-li"><i class="repair-speed-detail">备注：</i><span class="repair-speed-content">'+item.stateNote+'</span></div>'
                            +'</div>';
                    }
                })
                $("#repairList").empty().append(str);
                init();
                $("#workPhone").off('click').on('click',function(){
                    var nowTime = new Date().getTime();
                    var limitTime = new Date(repairTime).getTime();
                    if(nowTime-limitTime>(reminderLimit*3600*1000)){
                        window.location.href = "tel://"+workPhone;
                    }else{
                        $.alert("请在报修"+reminderLimit+"小时后催单");
                    }
                })
            }else{
                $.alert(data.msg);
            }
        }
    });

}
//评价
function Submit(){
    var startP = $("#startP").val();
    var startPs = $(".startP-s").val();
    var startPz = $(".startP-z").val();
    var startPt = $(".startP-t").val();
    var content = $("#content").val();
    var evaluationDetail ='[';
    if(startPs!=null && startPs!=""){
        evaluationDetail += '{"content":"速度","satisfaction":"'+startPs+'","sort":"1"},';
    }else{
        evaluationDetail += '{"content":"速度","satisfaction":"","sort":"1"},';
    }
    if(startPz!=null && startPz!=""){
        evaluationDetail += '{"content":"质量","satisfaction":"'+startPz+'","sort":"2"},';
    }else{
        evaluationDetail += '{"content":"质量","satisfaction":"","sort":"2"},';
    }
    if(startPt!=null && startPt!=""){
        evaluationDetail += '{"content":"态度","satisfaction":"'+startPt+'","sort":"3"},';
    }else{
        evaluationDetail += '{"content":"态度","satisfaction":"","sort":"3"},';
    }
    evaluationDetail = evaluationDetail.substring(0,evaluationDetail.length-1);
    evaluationDetail += ']';
    $.ajax({
        url:global.url+"/bxFormEvaluation/evaluate",
        type:"POST",
        data:{
            universityId:universityId,
            repairId:repairId,
            openid:openid,
            satisfaction:startP,
            evaluationContent:content,
            evaluationDetail:evaluationDetail
        },
        dataType:"json",
        success:function(data){
            if(data.code==100000){
                $('#iosActionsheet').removeClass('weui-actionsheet_toggle');
                $('#iosMask').css('opacity','0').css('display','none');
                loading();
            }else{
                $.alert("请勿使用emoji表情");
            }
        }
    });
}
//取消工单
function cancelRepair(id){
    $.ajax({
        url:global.url+"/bxUser/updateToCancel",
        type: "POST",
        data: {
            universityId:universityId,
            openid:openid,
            id:repairId
        },
        dataType: "json",
        success: function(data){
            if(data.code==100000){
                loading();
            }else{
                $.alert(data.msg);
            }
        }
    });
}

//确认完工工单
function checkCompletion(id){
    $.ajax({
        url:global.url+"/bxUser/checkCompletion",
        type: "POST",
        data: {
            universityId:universityId,
            openid:openid,
            id:repairId
        },
        dataType: "json",
        success: function(data){
            if(data.code==100000){
                loading();
            }else{
                $.alert(data.msg);
            }
        }
    });
}