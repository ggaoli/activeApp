/*活动详情*/
/*图片查看器*/
function initSwiper(){
    //var s;
    $('.photo .swiper-preview .swiper-img').each(function(){
        $(this).click(function(){
            var finallyParent=$(this).parents('.swiper');
            var swiperImgs=$(finallyParent).find('.swiper-img');
            /*构造swiper-modal的html*/
            var swiperModal=$('<div class="swiper-modal"></div>');
            var container=$('<div class="swiper-container swiper1" ></div>');
            var swiperWrapper=$('<div class="swiper-wrapper"></div>');
            var other='<div class="swiper-pagination swiper-pagination1" ></div>' +
                '<div class="swiper-button-next swiper-button-white"></div>' +
                '<div class="swiper-button-prev swiper-button-white"></div>';
            var slider='',src='';

            for(var i=0;i<swiperImgs.length;i++){
                src=$(swiperImgs[i]).find('img').attr('src');
                slider='<div class="swiper-slide">' +
                '<img data-src="'+src+'" class="swiper-lazy">' +
                '<div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>';
                $(swiperWrapper).append(slider);
            }
            $(container).append(swiperWrapper);
            $(container).append(other);
            $(swiperModal).append(container);
            $(finallyParent).append(swiperModal);
            /*构造swiper-modal的html完毕*/
            var swipercontainer=$(finallyParent).find('.swiper-container');
            var index=$(this).attr('data-index')|| $(this).index();
            $(swipercontainer).parent().show();
            $(swipercontainer).fadeIn();
            $(swipercontainer).addClass('swiper-container-visible');
            $(swipercontainer).parent().addClass('swiper-modal-visible');
            var pagination=$(swipercontainer).find('.swiper-pagination');

            //初始化并打开swiper
           var s=new Swiper(swipercontainer, {
                pagination: pagination,
                paginationClickable: true,
                initialSlide:index,
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                preloadImages: false,
                lazyLoading: true,
                onInit: function(swiper){
                   //alert('');
                }
            });
            s.onResize();
        });
    });
    $('.photo').on('click','.swiper-container',function(e){
            var swipercontainer=$(this);
            var targerEl=e.target;
            var prevButton=$(swipercontainer).find('.swiper-button-next');
            var nextButton=$(swipercontainer).find('.swiper-button-prev');

            if(!($(targerEl).is(prevButton)||$(targerEl).is(nextButton))){
                swipercontainer.removeClass('swiper-container-visible');
                swipercontainer.parent().removeClass('swiper-modal-visible');
                swipercontainer.fadeOut();
                swipercontainer.parent().fadeOut;
                setTimeout(function(){
                    swipercontainer.parent().hide();
                    //s.destroy(true,true);//释放swiper
                    swipercontainer.parent().remove();
                },150);
            }
    });
    $('.photo .swiper-container').each(function(){
        //swiper-modal-visible
        $(this).click(function(e){
            var swipercontainer=$(this);
            var targerEl=e.target;
            var prevButton=$(swipercontainer).find('.swiper-button-next');
            var nextButton=$(swipercontainer).find('.swiper-button-prev');

            if(!($(targerEl).is(prevButton)||$(targerEl).is(nextButton))){
                swipercontainer.removeClass('swiper-container-visible');
                swipercontainer.parent().removeClass('swiper-modal-visible');
                swipercontainer.fadeOut();
                swipercontainer.parent().fadeOut;
                setTimeout(function(){
                    swipercontainer.parent().hide();
                    s.destroy(true,true);//释放swiper
                },150);
            }
        });
    });
}
/*头部*/

$(function(){
    setScrollHeader(document);
    setTopIcon(document);
});
$(document).scroll(function(){
    setScrollHeader(this);
    setTopIcon(this);
});
/*设置头部变化*/
function setScrollHeader(_this){
    var h=$(_this).scrollTop();
    var o=h/80;
    var o1=h/120;
    if(o>1){
        o=1
    }
    if(o1>1){
        o1=1;
    }
    if(h>30){
        if(!$('.header_scroll').hasClass('fixed_header')){
            $('.header_scroll').addClass('fixed_header');
        }
        $('.header_scroll').css('opacity',o1);
    }else{
        if(h==0){
            $('.header_scroll').removeClass('fixed_header').css('opacity',1);
        }else{
            $('.header_scroll').removeClass('fixed_header').css('opacity',1-o);
        }
    }
}
/*设置置顶图标*/
function setTopIcon(_this){
    var h=$(_this).scrollTop();
    if(h>150){
        $('.scroll_top').show();
    }else{
        $('.scroll_top').hide();
    }
}
/*头部点击显示更多*/
$('.header_more').on('click',function(e){
    $(this).next().fadeToggle(200);
    var a=this;
    e.stopPropagation();
    $(document).on('click',function(e){
        if(!$(e.target).is(a)){
            $(a).next().fadeOut(200);
        }
    });
});

/*内容*/
//回到顶部
$('.scroll_top').on('click',function(){
    var top=$(document).scrollTop();
    $('html, body').animate({scrollTop: 0}, top/3);

});
/*继续查看分享（分页加载）*/
$('#show_more_share').on('click',function(){
    var o=$(this);
    $(o).html('<i class="fa fa-spinner fa-pulse"></i>');
    setTimeout(function(){
        $(o).hide();
        var cell='<div class="cell share_box"> ' +
            '<div class="cell_title no-margin-r">' +
            '<div class="header_box">' +
            '<img src="images/default.png">' +
            '</div>' +
            '</div> ' +
            '<div class="cell_primary"> ' +
            '<div class="comment"> ' +
            '<div class="name p-color">林跃</div> ' +
            '<div class="comment_con">开展一系列既具有传统文化内涵又体现时代特色的富有创意的趣味活动，寓教于乐</div> ' +
            '<a class="comment_icon " href="javascript:void(0);"><i class="fa fa-commenting"></i></a> ' +
            '<div class="comment_bt_group"> <div class="comment_bt_con"> <div class="zang_bt comment_bt_item"> <div class="bt_c"><i class="fa fa-heart-o"></i>赞</div> </div> <div class="comment_bt comment_bt_item open-popup" data-target="#replay"> <div class="bt_c"><i class="fa fa-comment-o"></i>评论</div> </div> </div> </div>' +
            '<div class="comment_time">2016/07/17 16:45</div> ' +
            '</div> ' +
            '</div> ' +
            '</div>';
        var cells='';
        for(var i=0;i<5;i++){
            cells+=cell;
        }
        $(o).html('继续查看分享').show();
        $('#share_area').append(cells).append(o.parent());
    },1500);
});
/*----评论某个分享-----*/
/*1显示弹出层，将分享的文字内容显示到弹出层*/
$('#share_area .comment_icon.open-popup').on('click',function(){
    var c= $(this).closest('.share_box');
    var cc= c.clone();
    cc.find('.photo').remove();
    cc.find('.comment_icon').remove();
    cc.find('.comment_time').remove();
    cc.find('.replay').remove();
    var cId= $(this).attr('data-target');
    $(cId).find('.share_box').html(cc.html());
});

$(document).on('click','#share_area .comment_icon',function(e){
    var comment_bt_group=$(this).closest('.comment').find('.comment_bt_group');
    $(comment_bt_group).toggleClass('active');
    var zang_bt=$(comment_bt_group).find('.zang_bt');
    e.stopPropagation();
    $(document).on('click',function(){
        $(comment_bt_group).removeClass('active');
    });
});
//评论的点赞
$(document).on('click','#share_area .comment_bt_group .zang_bt',function(e){
    var comment=$(this).closest('.comment');
    var comment_bt_group=$(comment).find('.comment_bt_group');
    var bt_c =$(this).find('.bt_c');
    var zang_item=$(comment).next().find('.zang_item');
    if(bt_c.html()=='<i class="fa fa-heart-o"></i>赞'){
        /*点赞*/
        //后台数据交互
        //。。。。。
        //后台数据交互完成
        bt_c.html('<i class="fa fa-heart-o"></i>取消');
        if(zang_item.length==0){
            var userStr='<span user-id="11">张开1</span>'
            var zangStr='<div class="zang_item"><i class="fa fa-heart-o"></i>'+userStr+'</div>';
            var replay=$(comment).next();
            if(replay.length==0){
                replay=$('<div class="replay"></div>');
                replay.html(zangStr);
                $(comment).after(replay);
            }else{
                $(replay).prepend(zangStr)
            }
            $(comment).find('.replay').prepend(zangStr);
        }else{
            var userStr='<span user-id="11">,张开1</span>';
            $(zang_item).append(userStr);
        }
        setTimeout(function(){
            $(comment_bt_group).removeClass('active');
        },600);

    }else{
        /*取消*/
        //后台数据交互
        //。。。。。
        //后台数据交互完成
        bt_c.html('<i class="fa fa-heart-o"></i>赞');

        var users=$(zang_item).find('span');
        var uid='11',tid;
        if(users.length==1){
            if($(zang_item).next().length==0){
                $(zang_item).parent().remove();
            }
            else{
                $(zang_item).remove();
            }
        }else{
            for(var i=0;i<users.length;i++){
                tid=$(users[i]).attr('user-id');
                if(tid==uid){
                    users[i].remove();
                    break;
                }
            }
        }
        setTimeout(function(){
            $(comment_bt_group).removeClass('active');
        },100);
    }
    e.stopPropagation();
});

/*评论的回复*/
/*open-popup和data-target打开*/

/*2发送*/
$('#finish_comment').on('click',function(){
    $.showLoading('正在发送');
    setTimeout(function() {
        $.hideLoading();
        $.toast("发送成功", "success");
        setTimeout(function() {
            $.closePopup();
        }, 1500);
    }, 1000);
});

/*底部按钮*/
//点赞
$('.act_bottom .zang').on('click',function(){
    if($(this).hasClass('active')){
        $.toast("取消点赞", "text");
        $(this).removeClass('active').find('p').html('点赞');
    }
    else{
        $.toast("点赞成功", "text");
        $(this).addClass('active').find('p').html('已点赞');
        $(this).find('.animate_thumbs').addClass('active_thumbs');
        var _this=this;
        setTimeout(function() {
            $('.act_bottom .zang').find('.animate_thumbs').removeClass('active_thumbs');
        },800);
    }
});
//收藏
$('.act_bottom .favorite').on('click',function(){
    if($(this).hasClass('active')){
        $.toast("取消收藏", "text");

        $(this).find('.animate_star').removeClass('active_star');
        $(this).removeClass('active').find('p').html('收藏');
    }
    else{
        $.toast("收藏成功", "text");
        $(this).addClass('active').find('p').html('已收藏');
        $(this).find('.animate_star').addClass('active_star');
        setTimeout(function() {
            $('.act_bottom .favorite').find('.animate_star').removeClass('active_star');
        },800);
    }
});
//报名活动
$('#take_part').on('click',function(){
    if($(this).html()=='已报名该活动'){
        $.toast("已报名该活动", "text");
    }
    else{
        $.showLoading('正在报名');
        setTimeout(function(){
            $.hideLoading();
            $.toast('成功报名');
            $('#take_part').removeClass('btn_primary').addClass('btn_alert').html('已报名该活动')
        }, 1000);
    }

});

