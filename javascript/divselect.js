jQuery.divselect = function(divselectid,inputselectid,callback) {
	var inputselect = $(inputselectid);
	$(divselectid+" cite").click(function(e){
		var ul = $(divselectid+" ul");
		$(".divselect ul").not(ul).hide(0,function(){
            ul.fadeToggle(0);
            $(ul).closest('.divselect').toggleClass('open');
            visiableUl();
            stopPropagation(e);
        });

	});
	$(divselectid+" ul li a").click(function(e){
		var txt = $(this).html();
		$(divselectid+" cite").html(txt);
		var value = $(this).attr("selectid");
		inputselect.val(value);
        $(this).parent().addClass('active');
        $(this).parent().siblings().removeClass('active');
		$(divselectid+" ul").hide();
        $(divselectid).removeClass('open');
        if(callback){
            callback();
        }
	});

	function stopPropagation(e) { 
		if (e.stopPropagation) {
			e.stopPropagation(); 
		} else {
			e.cancelBubble = true; 
		} 
	};
    function visiableUl(id){
        if($(".divselect ul").is(':visible')){
            $('.opacity_bg').show();
        }else{
            $('.opacity_bg').hide();
        }
    };
	function setWidth(){
        var w=$(window).width();
        $(divselectid+" ul").css('width',w);

        var h=$(window).height();
        $(divselectid+" ul").css('max-height',h-90);
    };
	$(document).bind('click',function(e){
		$('.divselect ul').slideUp(0);
        $('.divselect').removeClass('open');
        visiableUl();
	});
    window.onresize=function(){
        setWidth();
    }
    setWidth();
};