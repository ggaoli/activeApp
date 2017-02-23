$(function(){
   /* var hh=$(window).height();
    $('.weui-popup-container').find('.modal_wrap').css('height',hh-117);*/
});
function setorgselectH(){
    var h=$('.weui-popup-container').find('.orgSelect').height();
    var hdh=$('.weui-popup-container').find('.orgSelect .oselect_hd').height()+10;
    $('.weui-popup-container').find('.orgSelect .no-seclect').css('height',h-hdh);
}
(function($){
    $('.org .look-more').click(function(){
        var _this=$(this);
        if(_this.hasClass('btn_disabled')){
        }else{
            $('.h-selected').toggleClass('height-open');
            if(this.title == "展开"){
                this.innerHTML='<i class="fa fa-minus"></i>收起';
                this.title="收起";
            }else{
                this.title="展开";
                this.innerHTML='<i class="fa fa-plus"></i>展开';
            }
        }
        setorgselectH();
    });
    $('.org .look-more')

	//显示隐藏函数  配置deploy 跟人员插件重复
	document.onclick = function(e){
		var e = e || event;
		var target = e.target || e.srcElement;
		if($(target).hasClass("orgPloy")){
			var $ul = $(target).next();
			var style = $ul.css("display");
			if(style == 'none'){
				$ul.css('display','block');
			}else{
				$ul.css('display','none');
			}
		}else if($(target).closest(".orgPloy").hasClass("orgPloy")){
			var $ul = $(target).closest(".orgPloy").next();
			var style = $ul.css("display");
			if(style == 'none'){
				$ul.css('display','block');
			}else{
				$ul.css('display','none');
			}
		}else if($(target).hasClass("deploy")){
			var $ul = $(target).next();
			var style = $ul.css("display");
			if(style == 'none'){
				$ul.css('display','block');
			}else{
				$ul.css('display','none');
			}
		}else if($(target).closest(".deploy").hasClass("deploy")){
			var $ul = $(target).closest(".deploy").next();
			var style = $ul.css("display");
			if(style == 'none'){
				$ul.css('display','block');
			}else{
				$ul.css('display','none');
			}
		}
	}
    /*调用方法打开*/
    var modal = {
        //返回当前显示的弹出层的id
        curModal:function(){
            //console.log('调用方法打开:'+new Date().getTime());
            var curModal = $('.weui-popup-container-visible');
            var length = curModal.length;

            if(length < 0) return;

            for( var i = 0; i < length; i++ ){

                var curId =  curModal[i].getAttribute('id');
                var num = parseInt(curModal[i].getAttribute('num'));
                return [curId,num];

            }
        }
    };
	var orgFun = {
		//页面上
		getClass:function(){
			var hClass = [];
            var sureUl = $('#orgselect').find('ul');
			var sure_sel = sureUl.find('li').not($('.lastInp'));
			var slen = sure_sel.length;	
			for(var i = 0;i <slen;i++){
				hClass.push(sure_sel[i].getAttribute('class').split(' ')[0])
			}
			return [hClass,slen,sureUl];
		},
		//得到的数组返回这个数组的class
		arrayClass:function(array){
			var length = array.length;
			var classArr = [];
			if(length>0){
				for(var i = 0;i<length;i++){
					classArr.push(array[i].getAttribute('class'));
				}	
			}
			return [classArr,length];
		},
		//页面上权限判断
		permission:function(userLength){
			var paras = this.getClass();
			var slen = paras[1];
			var Hclass = paras[0];
			var sureUl = paras[2];
			for(var i =0 ;i<slen;i++){
				if(userLength>Hclass[i].length){
					sureUl.find('.'+Hclass[i]).addClass('no-active');
					sureUl.find('.'+Hclass[i]).find('small').html('<i class="fa fa-key"></i>');
				}
			}
		},
		//功能编辑
		edit:function(selectedCon,orgCon){
			var sureUl = $('#orgselect').find('ul');
			var sureLi = sureUl.find('li').not($('.lastInp')).clone();
			var len = sureLi.length;
			selectedCon.html(sureLi);	
			this.hide(orgCon);
			this.update();
		},
		//编辑后相同的隐藏了
		hide:function(orgCon){
			var editClass = this.getClass()[0];	
			var editClen = editClass.length;
			for(var i=0;i<editClen;i++){
				orgCon.find('.'+editClass[i]).hide();
			}
		},
		//等级低的机构隐藏，等级高的覆盖；
		Replace:function(hideLi){
			var Data = this.arrayClass(hideLi);
			var tjClass =Data[0];//获取到的Class
			var tjLength =Data[1];//数组的长度
			
			var h_sel =$('.h-selected').find('ul'); 
			
			if(tjLength>0){
				for(var i=0;i<tjLength;i++){
					h_sel.find('.'+tjClass[i]).remove();
				}
			}
		},
		//判断是否操作
		update:function(){
            var thisM=modal.curModal();
			var sure = $('#'+thisM[0]).find('.sure');
			var cancle = $('#'+thisM[0]).find('.close-reveal-modal')
			sure.addClass('close-reveal-modal');
			this.sureSel(sure);	
			this.cancle(cancle);		
		},
		cancle:function(cancle){
			var ops = this.getClass()[0];
			cancle.click(function(){
                var sureUl = $('#orgselect').find('ul');
				var sureLi = sureUl.find('li').not($('.lastInp')).clone();
				var h_selected = $('.h-selected').find('ul');
				h_selected.html(sureLi);
				var no_seclect = $('.no-seclect');
				var li = no_seclect.find('li');
				var len = ops.length;
				no_seclect.find('li').show();
				for(var i=0;i<len;i++){
					no_seclect.find('.'+ops[i]).hide();
				}
			});
		},
		//提交
		sureSel:function(sure){
			sure.click(function(){
                var obj = $('.h-selected').find('ul li');
                var ops = obj.clone();
                var pageSel = $('#orgselect').find('ul');
                pageSel.html(ops);
				//var inp = '<li class="lastInp"><input type="text" autocomplete="off" placeholder="" class="" aria-invalid="false"></li>'
				//pageSel.append(inp);	
				
			})
		}

	}
	$(document).on('click','.searchOrg ul li',function(){
		/*var _this = $(this);
		if(!_this.hasClass('no-active') && !_this.hasClass('.lastInp') ){
			var Class = _this.attr('class');
			$('.no-seclect').find('.'+Class).show();
			_this.remove();
		}*/
	});
	$(document).on("click",'.addCur',function(){
		//左边
		var _this = $(this);
		var parLi = _this.closest('li');
		var name = parLi.attr('class');	
		var text = _this.next().next().text();
        var num=_this.closest('.org').attr('num');
		//右边
		var _selected = $('.h-selected').find('ul');
		var flagment = '<li class="'+name+'"><div class="orgPloy"><div>'+text+'</div><small>×</small></div></li>';
        var nownum=_selected.children().length;
        //一个覆盖，多个多选
        if(num){
            if(num>1){
                if(num>nownum){
                    _selected.prepend(flagment);
                    var hideLi=parLi.find('ul li:hidden');
                    hideLi.show();
                    parLi.hide();
                    orgFun.update();
                }
                else{
                    /*提示函数*/
                    orgnumTip(num);
                }
//		orgFun.Replace(hideLi);
            }
            else{
                _selected.children().trigger('click');
                _selected.html(flagment);
                var hideLi=parLi.find('ul li:hidden');
                hideLi.show();
                parLi.hide();
                orgFun.update();
            }
        }
        else{
            _selected.prepend(flagment);
            var hideLi=parLi.find('ul li:hidden');
            hideLi.show();
            parLi.hide();
            orgFun.update();
        }
        //更新选择数显示
        var numli=_selected.children().length;
        var orgnum= _this.closest('.org').find('.orgnum');
        $(orgnum).text(numli);
        setOBtn( _this.closest('.org'));
	});
	$(document).on('click','.h-selected ul li',function(){
		var _this = $(this);
        var _selected = _this.parent();
        var orgnum= _this.closest('.org').find('.orgnum');
        var _target=this.closest('.org');
		if(!_this.hasClass('no-active')){
			var Class = _this.attr('class');
			$('.no-seclect').find('.'+Class).show();
			_this.remove();
			orgFun.update();
		}
        var numli=_selected.children().length;
        $(orgnum).text(numli);
        
        setOBtn( _target);
	});

	/*默认展示最顶级*/
	function pretermit(selectedCon,orgCon,num){
		var orgCode=$("#orgCode").val();
		var userCL=orgCode.length;
		var _spin = '<i class="fa fa-spinner fa-spin"></i>';
		var _targe = $('.no-seclect');

		if(orgCode!=""){
			_targe.prepend(_spin);//导入效果
			var len=orgCode.length;
			if(len>=6){
				orgCode=orgCode.substring(0,orgCode.length-3);
			}
			$.ajax({
					url: "javascript/o/"+orgCode,
					dataType:"JSON",
					type : "GET",	
					success: function(data) {
						var grid_l=[];
						clearData(data);
						var len=data.length;
						for(var i=0;i<len;i++){
							grid_l.push('<li class="'+data[i].orgCode+'"><div class="orgPloy" orgCode='+data[i].orgCode+' onclick=findOrg(this)><a class="addCur right">添加</a><i class="turn-right"></i><div title="'+data[i].orgName+'">'+data[i].orgName+'</div><small>×</small></div></li>');
						}
						$(".org-0").html(grid_l);
						_targe.find('.fa-spin').hide();
						orgFun.edit(selectedCon,orgCon);
						
						var orgLi = orgCon.find('li');
						var len = orgLi.length;
						if(len>0){
							var _length = orgLi[0].getAttribute('class').length;
							if( _length < userCL ){
//								orgLi.find('.addCur').hide();
//								orgLi.addClass('no-active');
							}
						}
					},
					error: function(error) {
						//alert(error);
					}
				});
		}
	}
    function setOBtn(_target){
        var curMod=_target;
        var right_list=$(curMod).find('.h-selected');
        var right_listUl=$(right_list).find('ul');
        if((right_listUl.height()>=right_list.height())&&(right_listUl.height()>42)){
            $(curMod).find('.look-more').removeClass('btn_disabled');
        }else{
            $(curMod).find('.look-more').addClass('btn_disabled');
            $(curMod).find('.look-more').attr('title','展开');
            $(curMod).find('.look-more').html('<i class="fa fa-plus"></i>展开');
            $(right_list).removeClass('height-open');
        }
        setorgselectH();
    }
	$.fn.orgSelect=function( options ){
		var defaultSet = {
			name: '',/*存放数据的input名字*/
			id:'#flow-data', //存放用户信息的表单
            num:''//数量限制,默认是无限添加
		};
		var ops = $.extend(defaultSet,options);
		/*获取当前用户下的orgCode*/
        //var userID = $(ops.id).find('input[name=orgCode]').val();
        var num=ops.num;
		var userID = $("#orgCode").val();
		if(userID==null){
			userID="C59";
		}
		var userLength = userID.length;
		
		orgFun.permission(userLength);//权限判断
		
		return this.each(function(i){
			var _this=$(this);
			var modal_id = _this.attr('reveal-model-id');
			var orgCon = $('#'+modal_id).find('.no-seclect');
			var selectedCon = $('#'+modal_id).find('.h-selected ul');
			var flag = 0 ;//执行的次数
            $('#'+modal_id).attr('num',num);
            $('#'+modal_id).on('click',function(){
                var numli=$(this).find('.h-selected ul').children().length;
                var orgnum= $(this).find('.orgnum');
                $(orgnum).text(numli);
            });
			_this.click(function(){
				if(flag ==0){
					pretermit(selectedCon,orgCon,num);
					flag = 1;
				}
                setTimeout(function(){
                    setorgselectH();
                },50);
			});
		});
	}

})(jQuery)