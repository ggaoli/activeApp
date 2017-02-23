/**
 * Created by Administrator on 2016/11/1.
 */
/*活动发布js*/
/*时间*/
$(function () {
    /*活动时间*/
    //参数设置
    var staropt={};
    var endopt={};
    var starT= $("#sDateTime");
    var endT=$("#eDateTime");
    staropt.datetime = {preset : 'datetime'};
    endopt.datetime = {preset : 'datetime'};
    staropt.default = {
        theme: 'android-ics light', //皮肤样式
        display: 'bottom', //显示方式
        mode: 'scroller', //日期选择模式
        dateFormat: 'yyyy-mm-dd ',
        lang: 'zh',
        showNow: true,
        nowText: "今天",
        stepMinute:5,
        //headerText:'时间选择',
        width:58,
        height:55,
        minDate:new Date(),
        onSelect:function (valueText, inst) {
            var a=inst.values;//时间数组
            endT.mobiscroll('option', {
                minDate:new Date(a[0], a[1], a[2], a[3], a[4])
            });
        }
    };
    endopt.default = {
        theme: 'android-ics light', //皮肤样式
        display: 'bottom', //显示方式
        mode: 'scroller', //日期选择模式
        dateFormat: 'yyyy-mm-dd ',
        lang: 'zh',
        showNow: true,
        nowText: "今天",
        stepMinute:5,
        width:58,
        height:55,
        minDate:new Date(),
        onSelect:function (valueText, inst) {
            var a=inst.values;//时间数组
            starT.mobiscroll('option', {
                maxDate:new Date(a[0], a[1], a[2], a[3], a[4])
            });
            var stv=$('#sDateTime').val();
            var etv=$('#eDateTime').val();
            if(stv!=''&&etv!=''){
                var std=new Date(stv);
                var etd=new Date(etv);
                var date3=etd.getTime()-std.getTime();
                var a=etd.getTime();
                var hours=date3/(60*60*1000);
                $('#Ahours').val(hours);
            }
        }
    };
    //初始化
    var startoptDateTime = $.extend(staropt['datetime'], staropt['default']);
    $("#sDateTime").mobiscroll(startoptDateTime).datetime(startoptDateTime);

    var endoptDateTime = $.extend(endopt['datetime'], endopt['default']);
    $("#eDateTime").mobiscroll(endoptDateTime).datetime(endoptDateTime);

    /*报名时间*/
    //参数设置
    var staropt1={};
    var endopt1={};
    var starT1= $("#sDateTime1");
    var endT1=$("#eDateTime1");
    staropt1.datetime = {preset : 'datetime'};
    endopt1.datetime = {preset : 'datetime'};
    staropt1.default = {
        theme: 'android-ics light', //皮肤样式
        display: 'bottom', //显示方式
        mode: 'scroller', //日期选择模式
        dateFormat: 'yyyy-mm-dd ',
        lang: 'zh',
        showNow: true,
        nowText: "今天",
        stepMinute:5,
        width:58,
        height:55,
        minDate:new Date(),
        onSelect:function (valueText, inst) {
            var a=inst.values;//时间数组
            endT1.mobiscroll('option', {
                minDate:new Date(a[0], a[1], a[2], a[3], a[4])
            });
        }
    };
    endopt1.default = {
        theme: 'android-ics light', //皮肤样式
        display: 'bottom', //显示方式
        mode: 'scroller', //日期选择模式
        dateFormat: 'yyyy-mm-dd ',
        lang: 'zh',
        showNow: true,
        nowText: "今天",
        stepMinute:5,
        width:58,
        height:55,
        minDate:new Date(),
        onSelect:function (valueText, inst) {
            var a=inst.values;//时间数组
            starT1.mobiscroll('option', {
                maxDate:new Date(a[0], a[1], a[2], a[3], a[4])
            });
        }
    };
    //初始化
    var startoptDateTime1 = $.extend(staropt1['datetime'], staropt1['default']);
    $("#sDateTime1").mobiscroll(startoptDateTime1).datetime(startoptDateTime1);

    var endoptDateTime1 = $.extend(endopt1['datetime'], endopt1['default']);
    $("#eDateTime1").mobiscroll(endoptDateTime1).datetime(endoptDateTime1);
});

<!--下一步跳转页面初始化-->
$(function(){
    pageInit(50);
});
function pageInit(anotherH){
    // marginH=
    var activeClass='ui-page-active';
    var slideClass='slide';
    var inClass='in';
    var outClass='out';
    var reverseClass='reverse';
    var nowid=window.location.hash;//eg:#page1
    var pages=$('.ui-page');
    $(pages).removeClass('ui-page-active');
    if(nowid){
        $(nowid).addClass(activeClass);
    }
    else{
        $(pages[0]).addClass(activeClass);
    }
    var h=$('.ui-page-active').height();
    $('.ui-mobile-viewport').css('height',h);
    //alert('gao'+h);
    $('.page_button').each(function(){
        $(this).click(function(){
            var nextid=$(this).attr('href');
            var thisid='#'+$(this).closest('.ui-page').attr('id');
            if(nextid){
                var reverse=$(this).attr('data-direction');
                $('html,body').animate({ scrollTop: 0 }, 0);
                var h= $(window).height();
                $('.ui-mobile-viewport').css('height',h-anotherH);
                $(thisid).parent().addClass('ui-mobile-viewport-transitioning');
                $(nextid).addClass(activeClass).addClass(slideClass);
                $(thisid).addClass(activeClass).addClass(slideClass);
                if(nextid&&reverse){
                    $(thisid).addClass(outClass).addClass(reverseClass);
                    $(nextid).addClass(inClass).addClass(reverseClass);
                }
                else{
                    $(thisid).addClass(outClass);
                    setTimeout(function(){
                        $(nextid).addClass(inClass);
                    },1);
                }

                setTimeout(function(){
                    $(thisid).removeClass().addClass('ui-page');
                    $(nextid).removeClass().addClass('ui-page '+activeClass);
                    $(thisid).parent().removeClass('ui-mobile-viewport-transitioning');
                    var h=$(nextid).height();
                    $('.ui-mobile-viewport').css('height',h);
                },350);
                $(this).removeAttr('href');
            }
        });
    });
}
/*分类选择*/
/*$('#select1').mobiscroll().select({
    mode: 'scroller',
    display: 'modal',
    lang: 'zh',
    theme:'android-ics light'
});*/

$("input[name='fenlei']").change(function() {
    $('#fenlei').val($(this).val());
});
$("input[name='host']").change(function() {
    $('#host').val($(this).val());
});
<!--switch赞助捐赠显示收起-->
$('#zangzhu').on('click', function () {
    $('#sponsor-radio').toggle();
});
$('#juanzen').on('click', function () {
    $('#donation-radio').toggle();
});

<!--表单验证-->
$('#step2').on('click',function(){
    //跳转到第二步，第一步验证
    //通过
    if($('#page1').find('input').val()==''||$('#page1').find('textarea').val()==''){
        flag = false;
    }
    else{
        flag=true;
    }
    var firstinput;
    var inputS=$('#page1').find('input');
    var aaa=inputS.length,i;
    for(i=0;i<aaa;i++){
        if($(inputS[i]).val()==''){
            if(!firstinput){
                firstinput=inputS[i];
            }
            $(inputS[i]).parents('.cell').addClass('cell_warn');

        }else{
            $(inputS[i]).parents('.cell').removeClass('cell_warn');
        }
    }
    if(firstinput){
        /* var sH=$(firstinput).scrollHeight();*/
        var pH=$(firstinput).offset().top;
        var tip=$(firstinput).parents('.cell').find('.cell_title').text();
        $('.content').scrollTop(-pH);
        $.toptip('请输入'+tip,'error');
        $(this).attr('href','#page2');//跳转链接
    }else{
        $(this).attr('href','#page2');//跳转链接
    }

    if(true){

    }
    else{
        //$.toast("填写不完整", "forbidden");
    }
});
/*点击按钮*/
$('#step2_1').on('click',function(){
    $(this).attr('href','#page1');//跳转链接
});
/*点击步骤*/
$('#page2 .step_icon_box').on('click',function(){
    $(this).attr('href','#page1');//跳转链接
});
$('#page3 .step_icon_box').on('click',function(){
    $(this).attr('href','#page2');//跳转链接
});

$('#step3').on('click',function(){
    //跳转到第三步，第二步验证
    //通过
    var flag=true;
    if(flag){
        $(this).attr('href','#page3');//跳转链接
    }
    else{
        $.toast("填写不完整", "forbidden");
    }
});
$('#step3_2').on('click',function(){
    $(this).attr('href','#page2');//跳转链接
});
$('#save').on('click',function(){
    //保存，第三步验证
    //不通过
    var flag=true;
    if(flag){
        $.showLoading('正在保存');
        setTimeout(function() {
            //$.hideLoading();
            window.location.href='previewActivity.html';
        }, 1500);
    }
    else{
        $.toast("填写不完整", "forbidden");
    }
});

<!--活动方案-->
/*打开活动方案光标聚焦*/
$('#open_active_plan').on('click',function(){
    var id=$(this).attr('data-target');
    var textarea=$(id).find('textarea');
    if(textarea.length>0){
        setTimeout(function(){
            $(textarea)[0].focus();
        },400);
    }
});
/*关闭时提交活动方案至页面表单*/
$('#finish_plan').on('click',function(){
    var id=$(this).closest('.weui-popup-container').attr('id');
    var plan=$('#'+id).find('.active_plan textarea').val();
    $("a[data-target='#"+id+"']").find('textarea').val(plan);
});

<!--单选标签-->
//所属专题选择
$(function(){
    var specialSelBox=$('.special-sel-box');
    specialSelBox.find('.special-sel-base ul li').on('click',function(e){
        e.preventDefault();
        e.stopPropagation();
        specialSelBox.find('ul li').removeClass('selected');
        $(this).addClass('selected');
        var copyThisA = $(this).clone();
        if ($("#selectA").length > 0) {
            $("#selectA").find('span').html($(this).text());
            //$('.text_default').hide();
        } else {
            specialSelBox.find(".select-result ul").append(copyThisA.attr("id", "selectA"));
            //$('.text_default').hide();
        }
        /*$('.select-result li span').tipso({
            useTitle: false
        });*/
    });

    $('.select-result').on('click',function(e){
        e.preventDefault();
        e.stopPropagation();
        /*$(this).find('.arrow').toggleClass('on');
         $('.special-sel-base').slideToggle();*/
    });
    $('#finish_zhuanti').on('click',function(e){
        $.closePopup();
        e.preventDefault();
        e.stopPropagation();
        var specialSelBox=$('.special-sel-box');
        var li=specialSelBox.find('.select-result #selectA');
        var specialSelInputBox=$('.special-input-sel-box');
        specialSelInputBox.find('input').val($(li[0]).find('span').text());
    });

    $('.select-result').on("click","li", function(e) {
        e.preventDefault();
        e.stopPropagation();
        //$(this).remove();
    });
    $('.select-result').on("click","li i", function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).parent().remove()
    });

});

<!--多选标签-->

//-----所属分类end----

//------活动标签------
var tag = new Tag('activeTags',{
    listUrl:'javascript/tag.json',//下拉数据地址
    recoUrl: 'javascript/rec-tag.json',//推荐数据地址
    isReco:true,
    isdataPs1:true,
    isdataPs2:true,
    tagstitle:'常用标签：'
});
tag.setDataParser2(function(data2){//推荐框
    var vl = {};
    vl.text = data2.tagName;
    vl.id=data2.tagName;
    vl.isSystem=data2.isSystem;
    return vl;
});
tag.loadTag();//加载插件
//------活动标签end---

/*标签共用*/
/*打开弹出层使光标聚焦在标签输入框内*/
$('.open-popup').on('click',function(){
    var id=$(this).attr('data-target');
    var input=$(id).find('.select2-input');
    if(input.length>0){
        setTimeout(function(){
            $(input)[0].focus();
        },400);
    }
});
/*提交标签*/
$('.finish_tag').on('click',function(){
    var tag=$(this).closest('.weui-popup-container').find('.select2-container');
    var lis =  $(tag).find('ul .select2-search-choice');
    var id=$(this).closest('.weui-popup-container').attr('id');
    var tagInputUl=$('a[data-target=#'+id+']').find('.tag-input ul');
    if(lis.length>0){
        tagInputUl.html(lis.clone());
    }else{
        tagInputUl.html('<div class="inputtip">添加标签</div>');
    }

});