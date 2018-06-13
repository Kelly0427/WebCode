/**
 * Created by Maria on 2018/6/7.
 */

$(function(){
    $("li").click(function(){
        $(this).siblings('li').removeClass('active');
        $(this).addClass("active");
    })

})