var universityId = global.universityId;
var repairId = global.repairId;
var openid = global.openid;
var subOpenid = global.subOpenid;
var reminderLimit = global.reminderLimit;
var repairTime = global.repairTime;
var workPhone = "";
//ҳ���ʼ��
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
                                                $("#payOrder").parent().next().find('span').text("�ѽɷ�");
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
                                $.alert("�µ�ʧ�ܣ����Ժ�����");
                            }
                        });
                    }else{
                        $.alert("֧������δ��ͨ");
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

    //ȷ��/ȡ����ť
    $('.weui-dialog__btn').on('click', function(){
        $(this).parents('.js_dialog').css('opacity','0').css('display','none');
        if($(this).text()=="ȷ��"){
            cancelRepair(global.repairId);
        }
    });

    //ȡ����ʾ��
    $('.cancel-botton').on('click', function(){
        // $iosDialog1.css('opacity','1').css('display','block');
        $.modal({
            title: '����',
            text: 'ȷ��ȡ���˹���',
            buttons: [
                { text: "������������", className: "default", onClick: function(){} },
                { text: "ȷ��", onClick: function(){ cancelRepair(global.repairId);} }
            ]
        });
    });

    //ȷ���깤��ʾ��
    $('#checkCompletion').on('click', function(){
        // $iosDialog1.css('opacity','1').css('display','block');
        $.modal({
            title: '����',
            text: 'ȷ���깤�˹���',
            buttons: [
                { text: "������������", className: "default", onClick: function(){} },
                { text: "ȷ��", onClick: function(){ checkCompletion(global.repairId);} }
            ]
        });
    });

}

//�����Ǽ�
window.onload = function () {
    var s = document.getElementById("pingStar"),
        m = document.getElementById('dir'),
        n = s.getElementsByTagName("li"),
        input = document.getElementById('startP'); //������ѡֵ
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
        input1 = $('.startP-s'); //������ѡֵ
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
        input2 = $('.startP-z'); //������ѡֵ
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
        input3 = $('.startP-t'); //������ѡֵ
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

//ҳ���ʼ��
$(function(){
    FastClick.attach(document.body);
    loading();
});
//��������
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
                $("#repairMan").text("�����ˣ�"+detail.repairMan);
                $("#repairTime").text("����ʱ�䣺"+detail.repairTime);
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
                        if(item.statusName=="�ѳ���"){
                            str +='<div class="repair-speed-li"><i class="repair-speed-tip speed-green">�ѳ���</i><span class="repair-speed-time">'+item.time+'</span>';
                        }else {
                            str +='<div class="repair-speed-li"><i class="repair-speed-tip speed-green">'+item.statusName+'</i><span class="repair-speed-time">'+item.time+'</span>';
                        }

                        if(item.status=='10' && item.reminder=='1'){
                            str +='<button class="weui-media-box_btn btn-green cancel-botton" >ȡ��</button>';
                        }else if(item.status=='13' && item.reminder=='1' ){
                            workPhone = item.workPhone;
                            str +='<a id="workPhone" class="weui-media-box_btn btn-green">�ߵ�</a>';
                        }else if(item.status=='14' && item.reminder=='1'){
                            str +='<button class="weui-media-box_btn btn-green" id="showIOSActionSheet">����</button>';
                        }else if(item.status=='31' && item.reminder=='1'){
                            str +='<button class="weui-media-box_btn btn-green" id="checkCompletion">ȷ���깤</button>';
                        }else if(item.status=="32"){
                            if(item.payStatus=='0' && item.reminder=='1'){
                                str +='<button class="weui-media-box_btn btn-green" id="payOrder" data_id="'+item.orderId+'">����</button>';
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
                                str +='<a id="workPhone" class="weui-media-box_btn btn-green">�ߵ�</a>';
                                permitFlag = false;
                            }else if(item.status=='14' && item.reminder=='1'){
                                str +='<button class="weui-media-box_btn btn-green" id="showIOSActionSheet">����</button>';
                                permitFlag = false;
                            }
                        }
                        str +='</div>';
                    }
                    if(item.status=='10'){
                        str	+='<div class="repair-speed-li"><i class="repair-speed-detail">�����ˣ�</i><span class="repair-speed-content">'+item.repairMan+'</span></div>'
                            +'<div class="repair-speed-li"><i class="repair-speed-detail">�������ݣ�</i><span class="repair-speed-content">'+item.repairContent+'</span></div>'
                            +'</div>';
                    }else if(item.status=='12'){
                        str	+='<div class="repair-speed-li"><i class="repair-speed-detail">�����ˣ�</i><span class="repair-speed-content">'+((item.name==null||item.name==""||item.name=="null")?'ϵͳ�Զ�����':item.name)+'</span></div>'
                            +'<div class="repair-speed-li"><i class="repair-speed-detail">��ע��</i><span class="repair-speed-content">'+item.stateNote+'</span></div>'
                            +'</div>';
                    }else if(item.status=='13'){
                        str	+='<div class="repair-speed-li"><i class="repair-speed-detail">�����ˣ�</i><span class="repair-speed-content">'+((item.name==null||item.name==""||item.name=="null")?'ϵͳ�Զ��ɹ�':item.name)+'</span></div>'
                            +'<div class="repair-speed-li"><i class="repair-speed-detail">�ɹ�����</i><span class="repair-speed-content">'+item.workNo+'</span></div>'
                            +'<div class="repair-speed-li"><i class="repair-speed-detail">��ע��</i><span class="repair-speed-content">'+item.stateNote+'</span></div>'
                            +'</div>';
                    }else if(item.status=='15'){
                        str	+='<div class="repair-speed-li"><i class="repair-speed-detail">�����ˣ�</i><span class="repair-speed-content">'+item.name+'</span></div>'
                            +'<div class="repair-speed-li"><i class="repair-speed-detail">����ȣ�</i><span class="repair-speed-content">'+item.evaluateName+'</span></div>'
                            +'<div class="repair-speed-li"><i class="repair-speed-detail">�������ݣ�</i><span class="repair-speed-content">'+item.content+'</span></div>'
                            +'</div>';
                    }else if(item.status=='20'){
                        str	+='<div class="repair-speed-li"><i class="repair-speed-detail">�ظ��ˣ�</i><span class="repair-speed-content">'+item.name+'</span></div>'
                            +'<div class="repair-speed-li"><i class="repair-speed-detail">�ظ����ݣ�</i><span class="repair-speed-content">'+item.content+'</span></div>'
                            +'</div>';
                    }else if(item.status=='31') {
                        str += '<div class="repair-speed-li"><i class="repair-speed-detail">�����ˣ�</i><span class="repair-speed-content">' + item.name + '</span></div>'
                            + '<div class="repair-speed-li"><i class="repair-speed-detail">��ע��</i><span class="repair-speed-content">' + item.stateNote + '</span></div>'


                        if (item.picUrl != null) {
                            var pics = item.picUrl.split(',');

                            // str += '<div class="repair-speed-li"><i class="repair-speed-detail">ͼƬ��</i>' +
                            //     '<span class="repair-speed-content">';

                            if (pics.length > 0 && pics[0] != '') {
                                str += '<div class="repair-speed-li"><i class="repair-speed-detail">�깤��Ƭ��</i>';
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
                        str	+='<div class="repair-speed-li"><i class="repair-speed-detail">����״̬��</i><span class="repair-speed-content">'+item.payStatusName+'</span></div>'
                            +'<div class="repair-speed-li"><i class="repair-speed-detail">���ѽ�</i><span class="repair-speed-content">'+item.money+'</span></div>'
                            +'<div class="repair-speed-li"><i class="repair-speed-detail">���ѺĲģ�</i><span class="repair-speed-content">';
                        $.each(item.materialList,function(n,item){
                            if(n>0){
                                str	+= ","
                            }
                            str	+= item.name+"*"+item.count;
                        });
                        str	+='</span></div>'
                            +'<div class="repair-speed-li"><i class="repair-speed-detail">��ע��</i><span class="repair-speed-content">'+item.remark+'</span></div>'
                            +'</div>';
                    }else{
                        str	+='<div class="repair-speed-li"><i class="repair-speed-detail">�����ˣ�</i><span class="repair-speed-content">'+item.name+'</span></div>'
                            +'<div class="repair-speed-li"><i class="repair-speed-detail">��ע��</i><span class="repair-speed-content">'+item.stateNote+'</span></div>'
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
                        $.alert("���ڱ���"+reminderLimit+"Сʱ��ߵ�");
                    }
                })
            }else{
                $.alert(data.msg);
            }
        }
    });

}
//����
function Submit(){
    var startP = $("#startP").val();
    var startPs = $(".startP-s").val();
    var startPz = $(".startP-z").val();
    var startPt = $(".startP-t").val();
    var content = $("#content").val();
    var evaluationDetail ='[';
    if(startPs!=null && startPs!=""){
        evaluationDetail += '{"content":"�ٶ�","satisfaction":"'+startPs+'","sort":"1"},';
    }else{
        evaluationDetail += '{"content":"�ٶ�","satisfaction":"","sort":"1"},';
    }
    if(startPz!=null && startPz!=""){
        evaluationDetail += '{"content":"����","satisfaction":"'+startPz+'","sort":"2"},';
    }else{
        evaluationDetail += '{"content":"����","satisfaction":"","sort":"2"},';
    }
    if(startPt!=null && startPt!=""){
        evaluationDetail += '{"content":"̬��","satisfaction":"'+startPt+'","sort":"3"},';
    }else{
        evaluationDetail += '{"content":"̬��","satisfaction":"","sort":"3"},';
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
                $.alert("����ʹ��emoji����");
            }
        }
    });
}
//ȡ������
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

//ȷ���깤����
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