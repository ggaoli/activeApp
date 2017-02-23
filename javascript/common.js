/**
 * Created by Administrator on 2016/9/13.
 */
/*公共js*/
;$(function(){
    /*fastclick*/
    window.addEventListener('load', function() {
        FastClick.attach(document.body);
    }, false);

    /*content*/
    setContent();
    setPopouContent();
});

function setContent(){
    //main content
    var h=$(window).height();
    var hh=$('.layout > header').height();
    var bh=$('.layout > .bottom').height();
    var ah=$('.act_bottom').height();
    if(!hh){hh=0;}
    if(!bh){bh=0;}
    if(!ah){ah=0;}
    $('.act_bottom').css('bottom',bh);
    $('.layout > .content,.search_box .content').css('height',(h-hh-bh-ah)+'px');
}

function setPopouContent(){
    //popup content
    var h=$(window).height();
    $('.weui-popup-container').each(function(){
        if($(this).is(':hidden')){
            $(this).show();
            var hh=$(this).find('.popup_header').height();
            var bh=$(this).find('.popup_bottom').height();
            $(this).find('.popup_content').css('height',(h-hh-bh)+'px');
            $(this).hide();
        }
        else{
            var hh=$(this).find('.popup_header').height();
            var bh=$(this).find('.popup_bottom').height();
            $(this).find('.popup_content').css('height',(h-hh-bh-1)+'px');
        }
    });
}



