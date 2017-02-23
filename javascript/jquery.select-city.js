
e = {};
(function($, e){
	var selectareas = e.selectareas = {};
	var map=null ,point=null;
	var v_provtxt="",v_citytxt="",v_disttxt="";
	if($('#allmap').length){
		//console.info($('#allmap'));map = new BMap.Map("allmap");//在百度地图容器中创建一个地图
		point = new BMap.Point(116.376673,39.92556);//定义一个中心点坐标
		map.centerAndZoom(point,12)//设定地图的中心点和坐标并将地图显示在地图容器中
	}
	//百度地图
	function chooseArea($prov,$city,$dist,$stre,areaData){
		map.enableScrollWheelZoom();//启用地图滚轮放大缩小
		map.enableKeyboard();//启用键盘上下左右键移动地图
		var vv_prov = $prov.val();
		var area = "北京市";
		if($prov.val()!=""){
			v_provtxt=$prov[0].options[$prov[0].selectedIndex].text;
			area = v_provtxt;
			if(v_provtxt=="台湾省"){
				area = "台湾";
			}
		}
		if($city.val() != "" && $city.val() != null){
			v_citytxt=$city[0].options[$city[0].selectedIndex].text;
			area += v_citytxt;
		}
		if($dist.val() != "" && $dist.val() != null){
			v_disttxt=$dist[0].options[$dist[0].selectedIndex].text;
			area += v_disttxt;
		}
		if(area==="北京市"){
			return;
		}
		addMarker(area,map,$prov,$city,$dist,$stre,areaData);
	}

	//创建marker
	function addMarker(area,map,$prov,$city,$dist,$stre,areaData){
		map.clearOverlays();
		var mygeo = new BMap.Geocoder();// 创建地址解析器实例
		// 将地址解析结果显示在地图上,并调整地图视野
		mygeo.getPoint(area, function(point) {
			if(point){
				//标注点数组
				var markerArr = [{title:"当前地址",content:area,point:point,isOpen:0,icon:{w:50,h:50,l:0,t:0,x:6,lb:5}}];
				for(var i=0;i<markerArr.length;i++){
					var json = markerArr[i];
					var iconImg = createIcon(json.icon);
					map.centerAndZoom(point, 14);
					var marker = new BMap.Marker(json.point,{icon:iconImg});
					var iw = createInfoWindow(json);
					var label = new BMap.Label(json.content,{"offset":new BMap.Size(json.icon.lb-json.icon.x+10,-20)});
					marker.setLabel(label);
					map.addOverlay(marker);
					map.setCenter(json.point);
					map.panBy(440, 270);
					marker.enableDragging();
					label.setStyle({
						borderColor:"#808080",
						color:"#333",
						cursor:"pointer"
					});

					(function(){
						var index = i;
						var _iw = createInfoWindow(json);
						var _marker = marker;
						_marker.addEventListener("dragend",function(){
							var point=_marker.getPosition();
							json.point=point;
							mygeo.getLocation(point, function(rs) {
								var addComp = rs.addressComponents;
								var v = addComp.province + addComp.city
									+ addComp.district + addComp.street
									+ addComp.streetNumber;
								MarkerMove($prov,$city,$dist,$stre,addComp.province,addComp.city,addComp.district,areaData);
								$stre.val(v);
								json.content=v;
								_marker.getLabel().setContent(json.content);
								_iw = createInfoWindow(json);
								_iw.open(_marker);
								_iw.addEventListener("open",function(){
									_marker.getLabel().hide();
								});
								_iw.addEventListener("close",function(){
									_marker.getLabel().show();
								});
							});
						});
						_iw.addEventListener("open",function(){
							_marker.getLabel().hide();
						});
						_iw.addEventListener("close",function(){
							_marker.getLabel().show();
						});
						_marker.addEventListener("click",function(){
							_iw.open(_marker);
						});
						if(!!json.isOpen){
							label.hide();
							_iw.open(_marker);
						}
					})();
				}
			}
		});
	}

	//创建InfoWindow
	function createInfoWindow(json){
		var content='<div style="margin:0;line-height:20px;padding:2px;">' +
			'<div style=\"height:45px;\"><b>地址：</b>' +json.content+
			'</div></div>';
		var iw = null;
		iw = new BMapLib.SearchInfoWindow(map, content, {
			title  : json.title,      //标题
			width  : 240,             //宽度
			height : 90,              //高度
			panel  : "panel",         //检索结果面板
			enableAutoPan : true,     //自动平移
			searchTypes   :[
			]
		});
		return iw;
	}
	//创建一个Icon
	function createIcon(json){
		var icon = new BMap.Icon("http://www.iconpng.com/png/flat-vector-icons/location.png", new BMap.Size(json.w+2,json.h+52),{imageOffset: new BMap.Size(-json.l,-json.t),infoWindowOffset:new BMap.Size(json.lb+4,1),offset:new BMap.Size(json.x,json.h)});
		return icon;
	}

	function MarkerMove($prov,$city,$dist,$stre,v_prov, v_city, v_dist,areaData) {
		$prov.empty();
		$city.empty();
		$dist.empty();
		$.each(areaData, function(k, v) {
			for(var code in v){
				appendOptTo1($prov, code, v[code].name, v_prov);
				if ((new RegExp(v[code].name)).test(v_prov)) {
					if (v[code].citys) {
						$.each(v[code].citys, function(k, v) {
							for(var code in v){
								appendOptTo1($city, code, v[code].name, v_city);
								if ((new RegExp(v[code].name)).test(v_city)) {
									$.each(v[code].citys, function(k, v) {
										for(var code in v){
											appendOptTo1($dist, code, v[code], v_dist);
										}
									});
								}
							}
						});
					}
				}
			}
		});
	}



	selectareas.initArea = function(callback){
		$.ajax({
			type:"GET",
			url: 'javascript/allareas.json',
			dataType: "json",
			success:function(data){
				callback(data);
			}
		});
	};

	// 自定义下拉列表的数据函数
	function appendOptTo($o, k, v, d) {
		var $opt = $("<option>").text(v).val(k);
		if (k == d) {
			$opt.attr("selected", "true");
		}
		$opt.appendTo($o);
	}

	// 通过地图获取来的数据进行改变下拉列表
	function appendOptTo1($o, k, v, d) {
		var $opt = $("<option>").text(v).val(k);
		if ((new RegExp(v)).test(d)) {
			$opt.attr("selected", "true");
		}
		$opt.appendTo($o);
	}

	selectareas.acccordToCode=function($o,v_code){
		var	$prov = $($o).find(".city-province");
		var	$city = $($o).find(".city-city");
		var	$dist = $($o).find(".city-district");
		$prov.empty();
		$city.empty();
		$dist.empty();
		$prov.show();
		$city.show();
		$dist.show();
		var v_prov = "";
		var v_city = "";
		var v_dist = "";
		if(v_code!=null&&v_code!=""){
			var cv = v_code.substring(2,4);
			var cd = v_code.substring(4,6);
			if(cv==="00"){
				v_prov=v_code;
			}else if(cv!="00" && cd === "00"){
				v_prov=v_code.substring(0,2)+"0000";
				v_city=v_code;
			}else{
				v_prov=v_code.substring(0,2)+"0000";
				v_city=v_code.substring(0,4)+"00";
				v_dist=v_code;
			}
		}
		selectareas.initArea(function(data){
			var areaData=data;
			if($prov.is(":hidden")||$prov.css('display')=="none")
				appendOptTo($dist, "", "区县", v_dist);
			$.each(areaData, function(k, v) {
				for(var code in v){
					appendOptTo($prov, code, v[code].name, v_prov);
					if (code===v_prov) {
						if (v[code].citys) {
							$.each(v[code].citys, function(k, v) {
								var count=0;
								for(var code in v){
									count++;
									var codeval = code.split("_");
									for(i=0;i<codeval.length;i++){
										if(codeval[i]===v_city&&codeval[i]!=""){
											v_city=code;
										}
									}
									appendOptTo($city, code, v[code].name, v_city);
									if(code.indexOf(v_city) != -1){
										if (v[code].citys) {
											var city_curr_val = $city.val();
											$.each(v[code].citys, function(k, v) {
												count=0;
												for(var code in v){
													count++;
													if(city_curr_val.substring(0,4) === code.substring(0,4)){
														appendOptTo($dist, code, v[code], v_dist);
													}
												}
												if(count==0){
													$dist.hide();
												}
											});
										}
									}
								}
								if(count==0){
									$city.hide();
									$dist.hide();
								}
							});
						}
					}
				}
			});
		});
		if($dist!=""){
			$dist.parents("div").removeClass("error");
		}
	};

	selectareas.getSelectedAreaCode=function($o){
		var	$prov = $($o).find(".city-province");
		var	$city = $($o).find(".city-city");
		var	$dist = $($o).find(".city-district");
		if($dist.css("display") != "none" && $dist.val() != ""){
			return $dist.val();
		}else if($city.css("display") != "none" && $city.val() != ""){
			return $city.val();
		}else if($prov.val() != ""){
			return $prov.val();
		}else{
			return;
		}
	};

	selectareas.init=function($elem,v_code){
		var areaData;
		var $lt=$elem;
		if($elem.find(".area-select").length > 0){
			$lt = $elem.find(".area-select");
		}
		// 设置下拉列表的的默认值
		var v_prov = "";
		var v_city = "";
		var v_dist = "";
		if(typeof(v_code)!=undefined&&v_code!=null&&v_code!=""){
			var cv = v_code.substring(2,4);
			var cd = v_code.substring(4,6);
			if(cv==="00"){
				v_prov=v_code;
			}else if(cv!="00" && cd === "00"){
				v_prov=v_code.substring(0,2)+"0000";
				v_city=v_code;
			}else{
				v_prov=v_code.substring(0,2)+"0000";
				v_city=v_code.substring(0,4)+"00";
				v_dist=v_code;
			}
		}
		if(! areaData){
			selectareas.initArea(function(data){
				areaData=data;
				$lt.each(function(){
					var $op=$(this);
					var	$prov = $op.find(".city-province");
					var	$city = $op.find(".city-city");
					var	$dist = $op.find(".city-district");
					var $stre = $op.find(".city-street");
					var $strepanel = $op.find(".searchResultPanel");

					$prov.html("");
					$city.html("");
					$dist.html("");
					appendOptTo($prov, "", "省份", v_prov);
					// 设置省下拉列表框的数据
					$.each(areaData, function(k, v) {
						for(var code in v){
							appendOptTo($prov, code, v[code].name, v_prov);
						}
					});

					// 省下拉列表事件
					$prov.change(function() {
						$city.html("");
						$dist.html("");
						$city.show();
						$dist.show();

						var count=0;
						var prov_curr_val = $prov.val();
						if (this.selectedIndex == -1){
							return;
						}
						if(!($prov.is(":hidden")||$prov.css('display')=="none"))
							appendOptTo($city, "", "城市", v_city);
						$.each(areaData, function(k, v) {
							for(var pcode in v){
								if (prov_curr_val == pcode) {
									if (v[pcode].citys) {
										$.each(v[pcode].citys, function(k, v) {
											for(var code in v){
												count++;
												var codeval = code.split("_");
												for(i=0;i<codeval.length;i++){
													if(codeval[i]===v_city&&codeval[i]!=""){
														v_city=code;
													}
												}
												appendOptTo($city, code, v[code].name, v_city);
											}
											if(count==0){
												$city.hide();
												$dist.hide();
											}
										});
									}
								}
							}
						});
						if($stre.length>0 && count == 0){
							$stre.val("");
							chooseArea($prov,$city,$dist,$stre,areaData);
						}
						$city.change();
					}).change();

					// 城市下拉列表事件
					$city.change(function() {
						$dist.html("");
						var city_curr_val = $city.val();
						if (this.selectedIndex == -1){
							return;
						}
						if(!($prov.is(":hidden")||$prov.css('display')=="none")||city_curr_val!=""||v_city=="")
							appendOptTo($dist, "", "区县", v_dist);
						$.each(areaData, function(k, v) {
							for(var code in v){
								var prov_curr_val = $prov.val();
								if (prov_curr_val == code) {
									if (v[code].citys) {
										$.each(v[code].citys, function(k, v) {
											for(var code in v){
												$.each(v[code].citys, function(k, v) {
													for(var code in v){
														var codeval = city_curr_val.split("_");
														if(codeval.length==1){
															if(city_curr_val.substring(0,4) == code.substring(0,4)){
																appendOptTo($dist, code, v[code], v_dist);
															}
														}else{
															if(codeval[0].substring(0,4) == code.substring(0,4) || codeval[1].substring(0,4) == code.substring(0,4)){
																appendOptTo($dist, code, v[code], v_dist);
															}
														}
													}
												});
											}
										});
									}
								}
							}
						});
						if($stre.length>0){
							$stre.val("");
							chooseArea($prov,$city,$dist,$stre,areaData);
						}
						//重新定位地图位置
						if(typeof(mapObj)!="undefined"&&$city.val()!=""){
							var $keyword = $("#keyword");
							var provcode=$prov.val();
							var provname=$prov.find('[value='+provcode+']').html();
							var citycode=$city.val();
							var cityname=$city.find('[value='+citycode+']').html();
							var code=$city.val();
							var name=$city.find('[value='+code+']').html();
							var str=provname+cityname;
							if($dist.val()!=""){
								code=$dist.val();
								name=$dist.find('[value='+code+']').html();
								if(name=="永定县"){
									name="永定区";
								}
								str=str+name;
							}
							if($keyword.length>0){
								$keyword.val(str);
							}
							mapObj.setCity(name);
						}
						v_dist="";
						if(!($prov.is(":hidden")||$prov.css('display')=="none")){
							v_city="";
						}
					}).change();

					// 区县下拉列表事件
					$dist.change(function() {
						if(typeof(mapObj)!="undefined"&&$city.val()!=""){
							var $keyword = $("#keyword");
							var provcode=$prov.val();
							var provname=$prov.find('[value='+provcode+']').html();
							var citycode=$city.val();
							var cityname=$city.find('[value='+citycode+']').html();
							var code=$city.val();
							var name=$city.find('[value='+code+']').html();
							var str=provname+cityname;
							if($dist.val()!=""){
								code=$dist.val();
								name=$dist.find('[value='+code+']').html();
								if(name=="永定县"){
									name="永定区";
								}
								str=str+name;
							}
							if($keyword.length>0){
								$keyword.val(str);
							}
							mapObj.setCity(name);
						}
						// 事件方法
						if($stre.length>0){
							$stre.val("");
							chooseArea($prov,$city,$dist,$stre,areaData);
						}
					});
					if($stre.length>0){
						/**
						 * 关键字提示  地点提示
						 */
						$stre.click(function(){
							var provtxt="",citytxt="",disttxt="";
							if($prov.val()!=""){
								provtxt=$prov[0].options[$prov[0].selectedIndex].text;
							}
							if($city.val() != "" && $city.val() != null){
								citytxt=$city[0].options[$city[0].selectedIndex].text;
							}
							if($dist.val() != "" && $dist.val() != null){
								disttxt=$dist[0].options[$dist[0].selectedIndex].text;
							}
							if($stre.val()==="")
								$stre.val(provtxt+citytxt+disttxt);
						});
						var myValue;
						var ac = new BMap.Autocomplete( // 建立一个自动完成的对象
							{
								"input" : $stre[0],
								"location" : map
							});

						ac.addEventListener("onhighlight", function(e) { // 鼠标放在下拉列表上的事件
							var str = "";
							console.info(e);
							var _value = e.fromitem.value;
							var value = "";
							if (e.fromitem.index > -1) {
								value = _value.province + _value.city + _value.district + _value.street + _value.business;
							}
							str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
							value = "";
							if (e.toitem.index > -1) {
								_value = e.toitem.value;
								value = _value.province + _value.city + _value.district + _value.street + _value.business;
							}
							str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
							$strepanel[0].innerHTML = str;
						});

						ac.addEventListener("onconfirm", function(e) { // 鼠标点击下拉列表后的事件
							var _value = e.item.value;
							myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
							$strepanel[0].innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
//							setPlace();
						});
					}
				});
			});
		}
	};
	$(function() {

	});
})(jQuery,e);