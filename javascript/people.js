// JavaScript Document
/*Cfg.contextPath="/psc";*/
		//添加所有成员预加载
		function findUser1(currPeople1){
			//console.log('点击次数:'+new Date().getTime());
			var ul = $(currPeople1).closest("div").next();
			var li = ul.children();
			var len =li.length;
			//在右边添加loading效果；
			var id2 = $(currPeople1).parents('.weui-popup-container').find('.right-list');
			var id1 =$(currPeople1).parents('.weui-popup-container').find('.peo-select');
			if(len<=0){
				/*var _spin = '<i class="fa fa-spinner fa-spin"></i>';
				id2.prepend(_spin);

				var orgCode=$(currPeople1).closest("div").attr("orgCode");
				if(orgCode != ""){
					//console.log('执行数:'+new Date().getTime());
					//orgCode="C59F19";
					$.ajax({
						url: Cfg.contextPath+"/party/interface/findUsers/"+orgCode+".json",
						dataType:"JSON",
						type : "POST",
						async:false,
						success: function(people) {
							//console.log('返回执行:'+new Date().getTime());
	  					    var grid_21=[];
                            grid_21=addpeople(people);//获取人员字符串
							ul.html(grid_21);//填充左边数据
							//id2右边操作
							var li2 = id2.find('ul').children();
							var Length = li2.length;
							if(Length>0){
								var arr = peoFun.getClass(li2,Length);
								var class2 = arr[0];
								var len = arr[1];
								peoFun.hide(id1,len,class2);
							}
							//id1左边操作
							var li = ul.children();
							var cloneLi = li.clone();
							li.hide();
							id2.find('ul').prepend(cloneLi);
							id2.find('.fa-spin').remove();//隐藏加载效果
							//console.log('返回执行成功:'+new Date().getTime());
						},
						error: function(error) {
							//alert(error);
						}
					});	
				}*/

                if(findUser(currPeople1)==true){
                    //console.log('加载人员数据成功:'+new Date().getTime());
                    //id1左边操作
                    var li = ul.children();
                    var cloneLi = li.clone();
                    li.hide();
                    id2.find('ul').prepend(cloneLi);
                    //console.log('全部选中人员数据成功:'+new Date().getTime());
                    id2.find('.fa-spin').remove();//隐藏加载效果
                }
                else{
                    alert('失败');
                    //console.log('加载人员数据失败:'+new Date().getTime());
                }

			}else{
				//添加显示的元素
				li = ul.children();
				var cloneLi = li.clone();
				var newCloneLi=[];
				for(var i=0;i<cloneLi.length;i++){
					//console.log(new Date().getTime()+":"+$(cloneLi[i]).css("display"));
					if($(cloneLi[i]).css("display")!=="none"){
						newCloneLi.push(cloneLi[i]);
					}
				}
				li.hide();
				id2.find('ul').prepend(newCloneLi);
			}
            var _target=$(currPeople1).parents('.weui-popup-container');
            setBtn(_target);

            var peonum=$(_target).find('.peonum');
            var id2 = $(_target).find('.right-list');
            var _ul2 = id2.find('ul');
            var numli=_ul2.children().length;
            $(peonum).text(numli);
		}
	 	//支部人员展开
        //根据组织代码加载其下的人员数据
	 	function findUser(currPeople){
	 		//console.log('支部人员展开:'+new Date().getTime());
			var ul = $(currPeople).parent().next();
			var li = ul.children();
			var len =li.length;
			
			var id1 =$(currPeople).parents('.box-content').find('.peo-select');
			var id2 = $(currPeople).parents('.box-content').find('.right-list');
			var flag=false;
			if(len<= 0){
				//loading
				var _spin = '<i class="fa fa-spinner fa-spin"></i>';
				id1.prepend(_spin);
				var orgCode=$(currPeople).parent().attr("orgCode");
				$.ajax({
					url: 'javascript/p/'+orgCode+'.json',/*Cfg.contextPath+"/party/interface/findUsers/"+orgCode+".json"*/
					dataType:"JSON",
					type : "POST",	
					async:false,
					success: function(people) {
                        var grid_2=[];
                        grid_2=addpeople(people);//获取人员字符串
						ul.html(grid_2);//添加左边人员数据
						var li2 = id2.find('ul').children();
						var Length = li2.length;
						if(Length>0){
							var arr = peoFun.getClass(li2,Length);
							var class2 = arr[0];
							var len = arr[1];
							peoFun.hide(id1,len,class2);
						}
						id1.find('.fa-spin').remove();//隐藏加载效果
                        flag =true;
					
					},
					error: function(error) {
						//alert(error);
                        flag = false;
					}
				});
			}
            return flag;
	 	}
       //获取人员字符串
		function addpeople(people){
            var grid_=[];
            for(var i = 0;i < people.length;i++){
                if(typeof(people[i].ssoId)!="undefined"&&typeof(people[i].ssoId)!==null&&people[i].ssoId!=null){
                    //var photo=Cfg.contextPath+"/user/img/"+people[i].ssoId+".png";
                    var photo='images/face24.png';
                    grid_.push('<li class="'+people[i].ssoId+'" pid ="'+people[i].ssoId+'">' +
                                        '<a class="clearfix" href="javascript:;">' +
                                            '<small></small>' +
											'<div class="tip-con">' +
											'<div class="user-name clearfix"><img src="'+photo+'" alt=""/><span>'+ people[i].userName +'</span></div>' +
											'<div class="org-name">所属组织：'+ people[i].orgCodeName +'</div>' +
											'<div class="user-addr">所在地：'+ people[i].address +'</div>' +
											'<div class="user-phone">手机号：'+ people[i].mobilePhone +'</div>' +
											'<div class="user-qq">QQ号码：'+ people[i].qq +'</div>' +
											'<div class="arrow"></div>'+
											'</div>' +
                                            '<img src="'+photo+'" alt=""/>' +
                                            '<span>'+ people[i].userName +'</span>' +
                                        '</a>' +
                                   '</li>');
                }
            }
            return grid_;
        }
		var peoFun = {
			//左右相等就隐藏了
			hide:function(id1,len,class2){
				var i = 0;
				for( ; i<len;i++){
					id1.find('.'+class2[i]).hide();
				}
			},
			//获取子元素的class名字
			getClass:function(li,len){
				var arrClass = [];
				var i = 0
				if(len>0){
					for(  ; i<len ;i++){
						arrClass.push(li[i].getAttribute('class'));
					}	
					return [arrClass,len];
				}else{
					console.log('当前没有人员被选择');
				}
			}
		}
        function setBtn(_target){
            var curMod=_target;
            var right_list=$(curMod).find('.right-list');
            var right_listUl=$(right_list).find('ul');
            if(right_listUl.outerHeight()>right_list.outerHeight()){
                $(curMod).find('.look-more').removeClass('btn_disabled');
            }else{
                $(curMod).find('.look-more').addClass('btn_disabled');
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
        }
   