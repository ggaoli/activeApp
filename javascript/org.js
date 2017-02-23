// JavaScript Document
//Cfg.contextPath="/psc";
		//清楚垃圾数据
		function clearData(data){
			for(var i = 0;i<data.length;i++){
				if(parseInt(data[i].orgCode.substr(-1))==0){
					data.splice(i,1);
					i--;
				}
			}
		}
		
	 	//机构展开
	 	function findOrg(currOrg){
			var _bsflag; //长度比较大小标志
			var parentLi=$(currOrg).closest('li');
			var orgCode=$(currOrg).attr("orgCode");
			var grid = parentLi.closest('ul').attr('grid');
			var $brother = $(currOrg).next()[0];
			/*console.log(grid);*/
			if(!$brother){
				$.ajax({
					url: "javascript/o/"+orgCode+".json",
					dataType:"JSON",
					type : "POST",	
					async:true,
					success: function(data) {
						if(data.length==0){
							$(currOrg).find('.turn-right').hide();
							return;	
						} 
						clearData(data);
						switch(grid){
							case 'org-0':
								var flagment= '<ul class="org-2" grid="org-2"></ul>'
								parentLi.append(flagment);
								var orgPart=[];
								
								for(var i=0;i<data.length;i++){
									orgPart.push('<li class="'+data[i].orgCode+'"><div class="orgPloy" orgCode='+data[i].orgCode+' onclick=findOrg(this)><a class="addCur right">添加</a><i class="turn-right"></i><div title="'+data[i].orgName+'">'+data[i].orgName+'</div><small>×</small></div></li>');
								}
								parentLi.find('.org-2').html(orgPart);
								_bsflag = comp(data,parentLi);
								if(_bsflag==1){
									parentLi.find('.org-2 li .addCur').hide();
									parentLi.find('.org-2 li').addClass('no-active')
								}
								break;
							case 'org-2':
								var flagment= '<ul class="org-3" grid="org-3"></ul>'
								parentLi.append(flagment);
								var orgPart=[];
								for(var i=0;i<data.length;i++){
									orgPart.push('<li class="'+data[i].orgCode+'"><div class="orgPloy" orgCode='+data[i].orgCode+' onclick=findOrg(this)><a class="addCur right">添加</a><i class="turn-right"></i><div title="'+data[i].orgName+'">'+data[i].orgName+'</div><small>×</small></div></li>');
								}
								parentLi.find('.org-3').html(orgPart);
								_bsflag = comp(data,parentLi);
								if(_bsflag==1){
									parentLi.find('.org-3 li .addCur').hide();
									parentLi.find('.org-3 li').addClass('no-active')
								}
								break;
							case 'org-3':
								var flagment= '<ul class="org-4" grid="org-4"></ul>'
								parentLi.append(flagment);
								var orgPart=[];
								for(var i=0;i<data.length;i++){
									orgPart.push('<li class="'+data[i].orgCode+'"><div class="orgPloy" orgCode='+data[i].orgCode+' onclick=findOrg(this)><a class="addCur right">添加</a><i class="turn-right"></i><div title="'+data[i].orgName+'">'+data[i].orgName+'</div><small>×</small></div></li>');
								}
								parentLi.find('.org-4').html(orgPart);
								_bsflag = comp(data,parentLi);
								if(_bsflag==1){
									parentLi.find('.org-4 li .addCur').hide();
									parentLi.find('.org-4 li').addClass('no-active')
								}
								break;
							case 'org-4':
								var flagment= '<ul class="org-5" grid="org-5"></ul>'
								parentLi.append(flagment);
								var orgPart=[];
								for(var i=0;i<data.length;i++){
									orgPart.push('<li class="'+data[i].orgCode+'"><div class="orgPloy" orgCode='+data[i].orgCode+' onclick=findOrg(this)><a class="addCur right">添加</a><i class="turn-right"></i><div title="'+data[i].orgName+'">'+data[i].orgName+'</div><small>×</small></div></li>');
								}
								parentLi.find('.org-5').html(orgPart);
								_bsflag = comp(data,parentLi);
								if(_bsflag==1){
									parentLi.find('.org-5 li .addCur').hide();
									parentLi.find('.org-5 li').addClass('no-active')
								}
								break;
							case 'org-5':
								var flagment= '<ul class="org-6" grid="org-6"></ul>'
								parentLi.append(flagment);
								var orgPart=[];
								for(var i=0;i<data.length;i++){
									orgPart.push('<li class="'+data[i].orgCode+'"><div class="orgPloy" orgCode='+data[i].orgCode+' onclick=findOrg(this)><a class="addCur right">添加</a><i class="turn-right"></i><div title="'+data[i].orgName+'">'+data[i].orgName+'</div><small>×</small></div></li>');
								}
								parentLi.find('.org-6').html(orgPart);
								_bsflag = comp(data,parentLi);
								if(_bsflag==1){
									parentLi.find('.org-6 li .addCur').hide();
									parentLi.find('.org-6 li').addClass('no-active')
								}
								break;
							case 'org-6':
								var flagment= '<ul class="org-6" grid="org-6"></ul>'
								parentLi.append(flagment);
								var orgPart=[];
								for(var i=0;i<data.length;i++){
									orgPart.push('<li class="'+data[i].orgCode+'"><div class="orgPloy" orgCode='+data[i].orgCode+' onclick=findOrg(this)><a class="addCur right">添加</a><i class="turn-right"></i><div title="'+data[i].orgName+'">'+data[i].orgName+'</div><small>×</small></div></li>');
								}
								parentLi.find('.org-7').html(orgPart);
								_bsflag = comp(data,parentLi);
								if(_bsflag==1){
									parentLi.find('.org-7 li .addCur').hide();
									parentLi.find('.org-7 li').addClass('no-active')
								}
								break;
						}
					},
					error: function(error) {
						//alert(error);
					}
				});
			}
	 	}
		/*点击机构加载子集的时候userID跟机构orgCode权限判断*/
		function comp(data,parentLi,_bsflag){
			if(parentLi.hasClass('no-active')){
//				var userID=$("input[name='orgCode']").val();
				var userID=$("#orgCode").val();
				var userLength = userID.length;
				var orgCoL = data[0].orgCode.length;
				if( userLength > orgCoL ){
					_bsflag = 1;    //ID判断权限注释掉就可以取消功能（需不需要自己控制）
					return _bsflag;
				}
			}
		}
		 