//a2627897194b5d9aad9b47e7db2227d5
var windowsArr = [];
var marker = [];
var markerP = "";
var infoWindow = "";
var mapObj = new AMap.Map("mapContainer", {
	resizeEnable: true,
	view: new AMap.View2D({
		resizeEnable: true
		//center: new AMap.LngLat(116.397428, 39.90923)//地图中心点
		//zoom: 13 //地图显示的缩放级别
	}),
	keyboardEnable: false
});

mapObj.setCity("福州");
//输入提示
function autoSearch() {
	var keywords = document.getElementById("keyword").value;
	var auto;
	//加载输入提示插件
	AMap.service(["AMap.Autocomplete"], function() {
		var autoOptions = {
			city: "" //城市，默认全国
		};
		auto = new AMap.Autocomplete(autoOptions);
		//查询成功时返回查询结果
		if (keywords.length > 0) {
			auto.search(keywords, function(status, result) {
				autocomplete_CallBack(result);
			});
		} else {
			document.getElementById("result1").style.display = "none";
		}
	});
}

//输出输入提示结果的回调函数
function autocomplete_CallBack(data) {
	var resultStr = "";
	var tipArr = data.tips;
	if (tipArr && tipArr.length > 0) {
		for (var i = 0; i < tipArr.length; i++) {
			resultStr += "<div id='divid" + (i + 1) + "' onmouseover='openMarkerTipById(" + (i + 1) + ",this)' onclick='selectResult(" + i + ")' onmouseout='onmouseout_MarkerStyle(" + (i + 1) + ",this)' style=\"font-size: 1rem;cursor:pointer;padding:10px;\"" + "data=" + tipArr[i].adcode + ">" + tipArr[i].name + "<span style='color:#C1C1C1;'>" + tipArr[i].district + "</span></div>";
		}
	} else {
		resultStr = " 无法查询到结果<br />要不试试：<br />1.请确保所有字词拼写正确<br />2.尝试不同的关键字<br />3.尝试更宽泛的关键字";
	}
	document.getElementById("result1").curSelect = -1;
	document.getElementById("result1").tipArr = tipArr;
	document.getElementById("result1").innerHTML = resultStr;
	document.getElementById("result1").style.display = "block";
}

//输入提示框鼠标滑过时的样式
function openMarkerTipById(pointid, thiss) { //根据id打开搜索结果点tip 
	//thiss.style.background = '#CAE1FF';
}

//输入提示框鼠标移出时的样式
function onmouseout_MarkerStyle(pointid, thiss) { //鼠标移开后点样式恢复 
	//thiss.style.background = "";
}

//从输入提示框中选择关键字并查询
function selectResult(index) {
	if (index < 0) {
		return;
	}
	if (navigator.userAgent.indexOf("MSIE") > 0) {
		document.getElementById("keyword").onpropertychange = null;
		document.getElementById("keyword").onfocus = focus_callback;
	}
	//截取输入提示的关键字部分
	var text = document.getElementById("divid" + (index + 1)).innerHTML.replace(/<[^>].*?>.*<\/[^>].*?>/g, "");
	var cityCode = document.getElementById("divid" + (index + 1)).getAttribute('data');
	document.getElementById("keyword").value = text;
	document.getElementById("result1").style.display = "none";
	//根据选择的输入提示关键字查询
	mapObj.plugin(["AMap.PlaceSearch"], function() {
		var msearch = new AMap.PlaceSearch(); //构造地点查询类
		AMap.event.addListener(msearch, "complete", placeSearch_CallBack); //查询成功时的回调函数
		msearch.setCity(cityCode);
		msearch.search(text); //关键字查询查询
	});
}

//定位选择输入提示关键字
function focus_callback() {
	if (navigator.userAgent.indexOf("MSIE") > 0) {
		document.getElementById("keyword").onpropertychange = autoSearch;
	}
}

//输出关键字查询结果的回调函数
function placeSearch_CallBack(data) {
	//清空地图上的InfoWindow和Marker
	windowsArr = [];
	marker = [];
	mapObj.clearMap();
	var resultStr1 = "";
	var poiArr = data.poiList.pois;
	var resultCount = poiArr.length;
	for (var i = 0; i < 1; i++) {
		resultStr1 += "<div id='divid" + (i + 1) + "' onmouseover='openMarkerTipById1(" + i + ",this)' onmouseout='onmouseout_MarkerStyle(" + (i + 1) + ",this)' style=\"font-size: 14px;cursor:pointer;padding:0px 0 4px 2px; border-bottom:1px solid #C1FFC1;\"><table><tr><td><img src=\"http://webapi.amap.com/images/" + (i + 1) + ".png\"></td>" + "<td><h3><font color=\"#00a6ac\">名称: " + poiArr[i].name + "</font></h3>";
		resultStr1 += TipContents(poiArr[i].type, poiArr[i].address, poiArr[i].tel) + "</td></tr></table></div>";
		addmarker(i, poiArr[i]);
	}
	mapObj.setFitView();
}

//鼠标滑过查询结果改变背景样式，根据id打开信息窗体
function openMarkerTipById1(pointid, thiss) {
	thiss.style.background = '#CAE1FF';
	windowsArr[pointid].open(mapObj, marker[pointid]);
}

//添加查询结果的marker&infowindow   
function addmarker(i, d) {
	var lngX = d.location.getLng();
	var latY = d.location.getLat();
	var markerOption = {
		map: mapObj,
		//icon: "http://webapi.amap.com/images/" + (i + 1) + ".png",
        icon: new AMap.Icon({
            size: new AMap.Size(35, 30),  //图标大小
            image: "http://webapi.amap.com/theme/v1.3/images/newpc/poi-1.png",
            imageOffset: new AMap.Pixel(-337, -30)
        }),
		position: new AMap.LngLat(lngX, latY),
		draggable: true, //点标记可拖拽
		cursor: 'move', //鼠标悬停点标记时的鼠标样式
		raiseOnDrag: true //鼠标拖拽点标记时开启点标记离开地图的效果
	};
	var mar = new AMap.Marker(markerOption);
	markerP = mar;
	marker.push(new AMap.LngLat(lngX, latY));

	infoWindow = new AMap.InfoWindow({
		//content: "<h3><font color=\"#222222\">  " + (i + 1) + ". " + d.name + "</font></h3>" + TipContents(d.type, d.address, d.tel),
		content: "<h3><font color=\"#222222\">  "+ d.name + "</font></h3>" + TipContents(d.type, d.address, d.tel),
		size: new AMap.Size(300, 0),
		autoMove: true,
		offset: new AMap.Pixel(0, -30)
	});
	geocoder(d.location,true);
	$('[name=address]').val(d.name);
	$('[name=lng]').val(d.location.lng);
	$('[name=lat]').val(d.location.lat);
	$('#keyword').val(d.name);
	windowsArr.push(infoWindow);
	infoWindow.open(mapObj, mar.getPosition());
	dragEvenInit();

    //sure_address(result,lnglatXY);
}

$('#baidu').click(function(){
	if(markerP==""){
		alert("还没有定位坐标");
		return;
	}
	var lng=markerP.getPosition().lng;
	var lat=markerP.getPosition().lat;
	window.open("http://192.168.4.125:8020/gaode/baidu.html?lng="+lng+"&lat="+lat);
});
//鼠标点击监听
var clickEventListener = AMap.event.addListener(mapObj, 'click', function(e) {
	var lngX = e.lnglat.getLng();
	var latY = e.lnglat.getLat();
	//从未初始化过点
	if (markerP == "") {
		var markerOption = {
			map: mapObj,
			//icon: "http://webapi.amap.com/images/1.png",
            //: "http://webapi.amap.com/theme/v1.3/images/newpc/poi-1.png",
            icon: new AMap.Icon({
                size: new AMap.Size(35, 30),  //图标大小
                image: "http://webapi.amap.com/theme/v1.3/images/newpc/poi-1.png",
                imageOffset: new AMap.Pixel(-337, -30)
            }),
            position: new AMap.LngLat(lngX, latY),
			draggable: true, //点标记可拖拽
			cursor: 'move', //鼠标悬停点标记时的鼠标样式
			raiseOnDrag: true //鼠标拖拽点标记时开启点标记离开地图的效果
		};
        //mapObj.setCenter(new AMap.LngLat(lngX, latY));
		markerP = new AMap.Marker(markerOption);
		geocoder(markerP.getPosition());
		dragEvenInit();
	} else {
		var newPosition = new AMap.LngLat(lngX, latY);
		markerP.setPosition(newPosition);
		geocoder(markerP.getPosition());
	}
});
//拖拽事件
function dragEvenInit() {
	var closefunc = function(e) {
		infoWindow.close();
	};
	var openfunc = function(e) {
		//拖拽结束后，获取坐标点
		var markerPosition = markerP.getPosition();
		geocoder(markerPosition);
		//infoWindow.open();
	};
	AMap.event.addListener(markerP, "dragstart", closefunc);
	AMap.event.addListener(markerP, "dragend", openfunc);
}
//逆加载地理位置
function geocoder(lnglatXY,type) {
	var MGeocoder;
	//加载地理编码插件
	AMap.service(["AMap.Geocoder"], function() {
		MGeocoder = new AMap.Geocoder({
			radius: 1000,
			extensions: "all"
		});
		//逆地理编码
		MGeocoder.getAddress(lnglatXY, function(status, result) {
			if (status === 'complete' && result.info === 'OK') {
				if(!type){
					infoWindow = new AMap.InfoWindow({
						content: "<h3><font color=\"#222222\">" + result.regeocode.formattedAddress + "</font></h3>",
						size: new AMap.Size(300, 0),
						autoMove: true,
						offset: new AMap.Pixel(0, -30)
					});
					//$('[name=address]').val(result.regeocode.formattedAddress);
					$('[name=lng]').val(lnglatXY.lng);
					$('[name=lat]').val(lnglatXY.lat);

					$('#keyword').val(result.regeocode.formattedAddress);

					infoWindow.open(mapObj, lnglatXY);
				}

                //初始化确定按钮事件
                sure_address(result,lnglatXY);
				e.selectareas.init($('#areaselct'));
				e.selectareas.acccordToCode($('#areaselct'),result.regeocode.addressComponent.adcode);
			}
		});
	});
	//加点
	//		var marker = new AMap.Marker({
	//			map: map,
	//			icon: new AMap.Icon({
	//				image: "http://cache.amap.com/lbs/static/jsdemo001.png",
	//				size: new AMap.Size(58, 30),
	//				imageOffset: new AMap.Pixel(-32, -0)
	//			}),
	//			position: lnglatXY,
	//			offset: new AMap.Pixel(-5, -30)
	//		});
	//		map.setFitView();
}

//infowindow显示内容
function TipContents(type, address, tel) { //窗体内容
	var str = "  地址：" + address || "暂无" + "<br />  电话：" + tel || "暂无" + " <br />  类型：" + type || "暂无";
	return str;
}

function keydown(event) {
	var key = (event || window.event).keyCode;
	var result = document.getElementById("result1")
	var cur = result.curSelect;
	if (key === 40) { //down
		if (cur + 1 < result.childNodes.length) {
			if (result.childNodes[cur]) {
				result.childNodes[cur].style.background = '';
			}
			result.curSelect = cur + 1;
			result.childNodes[cur + 1].style.background = '#CAE1FF';
			document.getElementById("keyword").value = result.tipArr[cur + 1].name;
		}
	} else if (key === 38) { //up
		if (cur - 1 >= 0) {
			if (result.childNodes[cur]) {
				result.childNodes[cur].style.background = '';
			}
			result.curSelect = cur - 1;
			result.childNodes[cur - 1].style.background = '#CAE1FF';
			document.getElementById("keyword").value = result.tipArr[cur - 1].name;
		}
	} else if (key === 13) {
		var res = document.getElementById("result1");
		if (res && res['curSelect'] !== -1) {
			selectResult(document.getElementById("result1").curSelect);
		}
	} else {
		autoSearch();
	}
    if(document.getElementById("keyword").value==''){
        $('.map-delete-icon').hide();
    }else{
        $('.map-delete-icon').show();
    }
	document.getElementById("keyword").onkeyup = keydown;
}

function sure_address(result,lnglatXY){
    $("#sure_address").one("click",function(){
        //重置经纬度
        resetlnglatXY(lnglatXY);
        /*重置地区*/
        resetArea(result);
        /*重置地址表单*/
        resetAddress(result);
    });
}
/*设置页面的经纬id*/
function resetlnglatXY(lnglatXY){
    var resultStr=lnglatXY.lng + "," + lnglatXY.lat;
    $('#lnglatXY').val( resultStr);
}
/*重置地区*/
function resetArea(result){
    var a=result.regeocode.addressComponent.city;
    a= a.substring(0,a.length-1);
    $('#area').val(a);
}
/*重置地址*/
function resetAddress(result){
    $('#address').val(result.regeocode.formattedAddress);
}
/*重绘maker和提示框*/
function  resetMarker(lnglatXY){
    var lngX = lnglatXY[0];
    var latY = lnglatXY[1];
    var newPosition = new AMap.LngLat(lngX, latY);
    markerP.setPosition(newPosition);
    geocoder(markerP.getPosition());
}

$('#openMap').on('click',function(){
    var lnglatXY=$('#lnglatXY').val().split(',');
    if($('#lnglatXY').val()){
        resetMarker(lnglatXY);
    }
});
$('.map-delete-icon').on('click',function(){
    $('#keyword').val('');
    $('.result-box').hide();
    $(this).hide();
});
