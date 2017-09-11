window.onload = getMyLocation;
function getMyLocation() {
	if (navigator.geolocation) {//navigator.geolocation对象存在，说明浏览器支持这个api
        navigator.geolocation.getCurrentPosition(displayLocation, errorHandler);//getCurrentPosition(successHandler（必填，如果浏览器成功获取地理位置 则调此函数）, errorHandler（可选，如果获取地理位置失败 则调此函数 并传失败对象）, options(可选，允许我们定制地理定位方法，一般用不到)) 实际上有三个参数                                                                                                                                                             获取到地理位置后 走我们自己定义的方法 并传参数position    如果用户不允许定位 则不会走自定义的方法
	} else {
		alert("抱歉，浏览器不支持定位");
	}
}


//地图失败处理函数
function errorHandler(error) {
	switch(error.code)
    {
    case error.PERMISSION_DENIED:
      alert("请授权定位功能");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("找不到您的位置");
      break;
    case error.TIMEOUT:
      alert("定位超时");
      break;
    case error.UNKNOWN_ERROR:
      alert("位置错误");
      break;
    }
}


//地图成功函数
function displayLocation(position) {
	var lat = position.coords.latitude;
	var longitude = position.coords.longitude;

	var div = document.getElementById('location');
	div.innerHTML = "your location is lat:"+ lat +" long:"+longitude;

   var imgUrl = "http://apis.map.qq.com/ws/staticmap/v2/?center="+lat+","+longitude+"&zoom=10&size=600*300&maptype=roadmap&markers=size:large|color:0xFFCCFF|label:k|39.8802147,116.415794&key=CISBZ-M53K3-NZI3O-3HPS5-VVZO7-NBFX2";
   div.innerHTML = "<img src='"+imgUrl+"' />";

}