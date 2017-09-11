window.onload = getMyLocation;
function getMyLocation() {
	if (navigator.geolocation) {//navigator.geolocation对象存在，说明浏览器支持这个api
        navigator.geolocation.getCurrentPosition(displayLocation);//获取到地理位置后 走我们自己定义的方法 并传参数position    如果用户不允许定位 则不会走自定义的方法
	} else {
		alert("抱歉，浏览器不支持定位");
	}
}

function displayLocation(position) {
	var lat = position.coords.latitude;
	var longitude = position.coords.longitude;

	var div = document.getElementById('location');
	div.innerHTML = "your location is lat:"+ lat +" long:"+longitude;
}