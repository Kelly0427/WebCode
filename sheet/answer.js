
$.fn.Sheet = function (options) {
    var defaults = {cardld: 'card',};
    var opts = $.extend({}, defaults, options);
    return $(this).each(function () {
        var obj = $(this).find('.card_cont');
        var _length = obj.length, _b = _length - 1, _len = _length - 1, _cont = '.card_cont';
        for (var a = 1; a <= _length; a++) {
            obj.eq(_b).css({'z-index': a});
            _b -= 1;
        }
        $(this).show();
        if (opts.cardld == 'card') {
            obj.find('ul li label').click(function () {
                //获取当前所选中的值$(this).text()
                 var _idx = $(this).parents(_cont).index(), _cards = obj, _cardcont = $(this).parents(_cont);
                if (_idx == _len) {
                    return;
                } else {
                    setTimeout(function () {
                        _cardcont.addClass('cardn');
                        setTimeout(function () {
                            _cards.eq(_idx + 3).addClass('card3');
                            _cards.eq(_idx + 2).removeClass('card3').addClass('card2');
                            _cards.eq(_idx + 1).removeClass('card2').addClass('card1');
                            _cardcont.removeClass('card1');
                        }, 200);
                    }, 100);
                     console.log($(this).text());
                     console.log($('ul li:first label').text())
                    if($(this).text()==$('ul li:first label').text()){
                        console.log("success");
                    }
                    /*if($(this).text()=="除存款、国债外,我几乎不投资其他金融产品" || $(this).text()=="大部分投资于外汇、国债等，较少投资于股票、基金等风险产品"){
                        console.log("success");
                    }*/
                }
            });
            //点击上一题
            $('.card_bottom').find('.prev').click(function () {
                var _idx = $(this).parents(_cont).index(), _cardcont = $(this).parents(_cont);
                obj.eq(_idx + 2).removeClass('card3').removeClass('cardn');
                obj.eq(_idx + 1).removeClass('card2').removeClass('cardn').addClass('card3');
                obj.eq(_idx).removeClass('card1').removeClass('cardn').addClass('card2');
                setTimeout(function () {
                    obj.eq(_idx - 1).addClass('card1').removeClass('cardn');
                }, 200);
            });


        }
    });
};