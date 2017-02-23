/*兼容jQuery操作符'$'和'jQuery'*/
/*li表示id1里面的li元素*/
/*j表示id2里面的li元素的个数*/
//id1左边 id2右边 id3页面
$(function(){

});
function setpeoselectH(){
    var h=$('.weui-popup-container').find('.peopleSelect').height();
    var hdh=$('.weui-popup-container').find('.peopleSelect .pselect_hd').height()+10;
    $('.weui-popup-container').find('.peopleSelect .peo-select').css('height',h-hdh);
}
(function($){
    //高度重定
	//显示隐藏函数  配置deploy
	/*document.onclick = function(e){
		var e = e || event;
		var target = e.target || e.srcElement;
		if($(target).hasClass("deploy")){
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
    }*/
    $('.people .look-more').click(function(){
        var _this=$(this);
        if(_this.hasClass('btn_disabled')){

        }else{
            $('.right-list').toggleClass('height-open');
            if(this.title == "展开"){
                this.innerHTML='<i class="fa fa-minus"></i>收起';
                this.title="收起";
            }else{
                this.title="展开";
                this.innerHTML='<i class="fa fa-plus"></i>展开';
            }
        }
        setpeoselectH();
    });
	//判断right-list 中内容是否为空
	/*function ifnull(){
		var $sure = id2.parents(".modal_wrap").siblings(".confirm").find('.sure'); 
		if(id2.find('li').length > 0){
			$sure.addClass('close-reveal-modal');
		}
		else{
			$sure.removeClass('close-reveal-modal');
		}
	}
	//input宽度计算
	function width(){
		$('.input-label').each(function(){
			var target = $(this)[0];
			var leftwidth = target.offsetLeft;
			var targetwidth = target.offsetWidth;
			var parentwidth = target.parentNode.offsetWidth;
			var a = parentwidth - leftwidth
			if(a > targetwidth){
				target.style.width = a -38 + "px"  ;
			}else{
				target.style.width = "100%"
			}	
		});
	}
	$('.part-peo_selected').each(function(){
		var target = $(this).find('.input-label');
		var _input = target.find("input")[0];
		$(this).mouseover(function(){
			width();
		}).mouseout(function(){
			if(_input.value.length>0){
				width();
			}else{
				target[0].style.width="33px";
			}
		});
	});
	*/
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
	var peofun = {
		//默认展示顶级层级
        //一级加载
		defaultDeplay:function(id1,_grid,num,id2,id3,orgCode,reset,url){
		/*	Cfg.contextPath="/psc";*/
			var orgCode=$("input[name='orgCode']").val();

			var _spin = '<i class="fa fa-spinner fa-spin"></i>';
		
			if(orgCode!=""&&reset){
				id1.prepend(_spin);//导入效果
                //顶层数据ajax加载
				$.ajax({
						url: 'javascript/p/'+orgCode,//Cfg.contextPath+"/party/interface/findOrgs/"+orgCode,//导入数据源
						dataType:"JSON",
						type : "GET",
						success: function(data) {
							var grid_l=[];
							for(var i=0;i<data.length;i++){
								grid_l.push('<li class="li-css grid-0">' +
                                                '<div class="deploy" orgCode='+data[i].orgCode+'>' +
                                                    '<a class="addCurall right" onclick=findUser1(this)>添加所有成员</a>' +
                                                    '<i class="turn-right"></i>' +
                                                    '<div onclick=findUser(this)>'+data[i].orgName+'</div>' +
                                                '</div>' +
                                                '<ul class="grid-2 endCss member-grid"></ul>' +
                                            '</li>');
							}
							$('.'+_grid).html(grid_l);
							id1.find('.fa-spin').remove();//隐藏加载效果
							if(num){
								id1.find('.addCurall').css('display','none');//隐藏添加全部功能
							}
						},
						error: function(error) {
						}
					});
				}
			},
			//编辑功能
			edit:function(id1,id2,id3){
			//保持页面编辑和右边数据一致
				//console.log('编辑功能:'+new Date().getTime());
				var sureLi = id3.find('li').not($('.input-label')).clone();
				var len = sureLi.length;
				id2.find('ul').html(sureLi);
				id1.find('.endCss li').show();
				var arr = this.getClass(id3);
				if(arr){
					var Class = arr[0];
					var len = arr[1];
					for(var i=0 ; i<len;i++){
						id1.find('.'+Class[i]).hide();
					}
				}
			},
			//确定按钮功能
			sure:function(sure,id2,id3){
				sure.click(function(){
					//console.log('确定按钮功能:'+new Date().getTime());
					id3.find('li').not($('.input-label')).remove();//清空页面数据
					var li = id2.find('ul li');
					id3.prepend(li);
				});
			},
			//全部清空
			clearAll:function(_target,id1,id2){
				var cancle = _target.find('.modal_wrap .infs .clear-all');
				cancle.click(function(){
					//console.log('全部清空:'+new Date().getTime());
					id1.find('.endCss li').show();//显示左边全部li
					id2.find('ul li').remove();
                    $(_target).find('.peonum').text('0');
                    setPBtn(_target);
				});
			},
            //获取选中人员的class(编号)
			getClass:function(id3){
				//console.log('getClass:'+new Date().getTime());
				var li = id3.find('li').not($('.input-label'));
				var len = li.length;
				var attr = [];
				if(len>0){
					for( var i=0; i<len; i++ ){
						attr.push(li[i].getAttribute('class'));
					}
					return [attr,len];	
				}
			}
	}
	//页面点击事件
	$(document).on('click','.part-peo_selected ul li',function(){
		//console.log('页面点击事件:'+new Date().getTime());
		/*var _this = $(this);
		var id = _this.parents('.part-peo_selected').prev().attr('reveal-model-id');
		var id1 = $('#'+id).find('.peo-select');
		if(!_this.hasClass('input-label') ){
			var Class = _this.attr('class');
			id1.find('.'+Class).show();
			_this.remove();
		}*/
	});
	//左边点击事件
	$(document).on('click','.endCss li' ,function(){
		//console.log('左边点击事件:'+new Date().getTime());
		var curModal = modal.curModal();
		var curModId = curModal[0];
		var num = curModal[1];
        var _this = $(this);
		var id2 = $('#'+curModId).find('.right-list');
        var _ul2 = id2.find('ul');
        var clone = _this.clone();
        var peonum=$('#'+curModId).find('.peonum');
		var len2 = id2.find('ul li').length;

		if(num&&num>=1){
            if(num>1){
                if(len2<num){
                    _ul2.prepend(clone);
                    _this.hide();
                }else{
                    peonumTip(num);
                }
            }else{
                _ul2.children().trigger('click');
                _ul2.html(clone);
                _this.hide();
            }
		}else{
			_ul2.prepend(clone);
			_this.hide();
		}
        var numli=_ul2.children().length;
        $(peonum).text(numli);
        setPBtn($('#'+curModId));
	});
	//右边点击事件
	$(document).on('click','.right-list li',function(){
		//console.log('右边点击事件:'+new Date().getTime());
		var curModal = modal.curModal();
		var curModId = curModal[0];
        var peonum=$('#'+curModId).find('.peonum');
        var rightListUl=$(this).parent();
		var id1 = $('#'+curModId).find('.peo-select');
		var _this = $(this);
		var _class = _this.attr('class');
		id1.find('.'+_class).show();
		_this.remove();
        $(peonum).text(rightListUl.children().length);
        setPBtn($('#'+curModId));
	});
    function setPBtn(_target){
        var curMod=_target;
        var right_list=$(curMod).find('.right-list');
        var right_listUl=$(right_list).find('ul');

        var f=$(right_list).hasClass('height-open');
        var rl=right_listUl.height();
        var r=right_list.height();
        if((right_listUl.height()>=right_list.height())&&(right_listUl.height()>44)){
            $(curMod).find('.look-more').removeClass('btn_disabled');
        }else{
            $(curMod).find('.look-more').addClass('btn_disabled');
            $(curMod).find('.look-more').attr('title','展开');
            $(curMod).find('.look-more').html('<i class="fa fa-plus"></i>展开');
            $(right_list).removeClass('height-open');

        }
        if(right_listUl.children().length>0){
            $(curMod).find('.clear-all').removeClass('btn_disabled');
        }else{
            $(curMod).find('.clear-all').addClass('btn_disabled');

            $(curMod).find('.look-more').addClass('btn_disabled');
            $(curMod).find('.look-more').attr('title','展开');
            $(curMod).find('.look-more').html('<i class="fa fa-plus"></i>展开');
            $(right_list).removeClass('height-open');
        }
        setpeoselectH();
    }
	$.fn.peoSelect = function(options){//JQuery插件机制
		var defaultSet = {//可配置参数
			num : '',//数量限制
			_grid : 'grid-ul',//初始化对象（顶级存放的位置）
			reset:true,
            url:''
		};
		var ops = $.extend(defaultSet,options);//合并参数
		var flag = 0;//设置标志位让他只执行一次执行次数
		var ordCode;//放置旧的orgCode	
		/*编辑的功能*/
		$(this).click(function(){//点击出现弹窗的id事件
			var _grid = ops._grid;
			var num = parseInt(ops.num);
			var url=ops.url;
			_this = $(this);
			var boxid = _this.attr('reveal-model-id');
			var _target = $('#'+boxid);

			var sure =_target.find('.sure');
			sure.addClass('close-reveal-modal');
			//添加属性并赋值
			_target.attr('num',num); 
			var id1 = _target.find('.peo-select');
			var id2 = _target.find('.right-list');
			var id3 = _this.find('.part-peo_selected ul');
			peofun.edit(id1,id2,id3);

			var orgCode=$("#orgCode").val();//获取组织代码
            orgCode='C50';//临时数据
			if(ordCode != orgCode){
				ordCode = orgCode;
				peofun.defaultDeplay(id1,_grid,num,id2,id3,orgCode,ops.reset,url);
				peofun.clearAll(_target,id1,id2,id3);
			}
			if(flag == 0){
				peofun.sure(sure,id2,id3);
				flag=1;
			}
            //重置num
            var numli=$(_target).find('.right-list ul').children().length;
            var peonum= $(_target).find('.peonum');
            $(peonum).text(numli);
            setTimeout(function(){
                setpeoselectH();
            },50);

		});
	}
})(jQuery);