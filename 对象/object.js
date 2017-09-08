
//第一种创建:直接创建   
function firstMethodCreateObject() {
	var dog1 = {
	name : "旺财",
	age: 10,
	loves:["eat", "play"],
	call:function () {
		alert("dog name  is "+this.name);
	}
};
    dog1.call();
    alert(dog1.loves);
}


//第二种创建:函数构建对象
function createObjectByFunction() {
	var dog = new Dog("wangcai", 15, ["11", "22", "33"]);
	dog.call();
    window.open("http://www.w3school.com.cn");
}

//在构建对象函数时 函数名首字母规定要大写 ， 调此方法时： var dog = new Dog("abc", 100, ["1", "2"]);
function Dog(name, age, loves) {
	this.name = name;
	this.age = age;
	this.loves = loves;
	this.call = function () {
		alert("dog name  is "+this.name);
		alert(this.loves);
	};
}

window.onload = createObjectByFunction;