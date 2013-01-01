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


//获取联系方式
var ToolBar = {
	personCount : 1,
	flowerCount : 1,
	eggCount : 1,
	showContant : function (){
		this.closeAll("contant");
		var obj = document.getElementById("room-contant-box");
		if(this.personCount%2==1)
			obj.style.display = "block";
		else
			obj.style.display = "none";
		this.personCount++;
	},
	showFlower : function(){
		this.closeAll("flower");
		var obj = document.getElementById("room-flower-box");
		if(this.flowerCount%2==1)
			obj.style.display = "block";
		else
			obj.style.display = "none";
		this.flowerCount++;
	},
	showEgg : function(){
		this.closeAll("egg");
		var obj = document.getElementById("room-egg-box");
		if(this.eggCount%2==1)
			obj.style.display = "block";
		else
			obj.style.display = "none";
		this.eggCount++;
	},
	closeAll : function(mark){
		var contant = document.getElementById("room-contant-box");
		var flower = document.getElementById("room-flower-box");
		var egg = document.getElementById("room-egg-box");
		if(mark == "contant"){
			if(flower.style.display == "block"){
				flower.style.display = "none";
				this.flowerCount++;
			}
			if(egg.style.display == "block"){
				egg.style.display = "none";
				this.eggCount++;
			}
		}
		else if(mark == "flower"){
			if(contant.style.display == "block"){
				contant.style.display = "none";
				this.personCount++;
			}
			if(egg.style.display == "block"){
				egg.style.display = "none";
				this.eggCount++;
			}
		}
		else if(mark == "egg"){
			if(contant.style.display == "block"){
				contant.style.display = "none";
				this.personCount++;
			}
			if(flower.style.display == "block"){
				flower.style.display = "none";
				this.flowerCount++;
			}
		}
	}
};