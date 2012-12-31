//效果
function objOver(obj1Name,obj2Name){
	var obj1 = document.getElementById(obj1Name);
	var obj2 = document.getElementById(obj2Name);
	obj1.style.display = "none";
	obj2.style.display = "block";
}
function objOut(obj1Name,obj2Name){
	var obj1 = document.getElementById(obj1Name);
	var obj2 = document.getElementById(obj2Name);
	obj1.style.display = "block";
	obj2.style.display = "none";
}
//检验


//切换
function changeContent(objName){
	var items = document.getElementsByClassName("hall-nav-item");
	for(var i=0;i<items.length;i++)
		items[i].style.display = "none";
	if(objName){
		var obj = document.getElementById(objName);
		obj.style.display = "block";
	}
}

//说话
function showInput(){
	var input = document.getElementById("chart");
	input.style.display = "block";
}
function closeInput(){
	var input = document.getElementById("chart");
	input.style.display = "none";
}
function saying(obj){
	
}


function getElementsByClassName(name) {
    var classElements = [],allElements = document.getElementsByTagName('div');
    for (var i=0; i< allElements.length; i++ )
   {
       if (allElements[i].className == name ) {
           classElements[classElements.length] = allElements[i];
        }
   }
   return classElements;
}


//获取联系方式.加个控制时间
var Person = {
	count : 1,
	showPerson : function (){
		var obj = document.getElementById("room-contant-box");
		if(this.count%2==1)
			obj.style.display = "block";
		else
			obj.style.display = "none";
		this.count++;
	}
};