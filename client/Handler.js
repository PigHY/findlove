//test
var UserHandler = {
	login : function (form){
		var user = {
			account : form.account.value,
			password : form.password.value
		};
		user = Users.findOne({account:user.account,password:user.password});
		Session.init(null);
		if(user){
			Session.set("user_id",user._id);
			Session.set("user_name",user.name);
			Session.set("user_gender",user.gender);
			Users.update({_id:user._id},{$set:{room_id:null,flag:false,light:false,comment:null,turn:0}})
			return true;
		}
		else{
			return false;
		}
	},
	register : function (form){
		var radioValue;
		var radio = document.all.gender;
		for(var i=0;i<radio.length;i++){
			if(radio[i].checked){
				radioValue = radio[i].value;
				break;
			}
		}
		var user  = {
			account : form.account.value,
			password : form.password.value,
			name : form.name.value,
			gender : radioValue,
			real_name:null,
			tel_phone:null,
			mobile_phone:null,
			standard:null,
			declaration:null,
			room_id:null,
			flag:false,
			light:false,
			comment:null,
			turn:0
		};
		userId = Users.insert(user);
		Session.init();
		if(userId){
			Session.set("user_id",userId);
			Session.set("user_name",user.name);
			Session.set("user_gender",user.gender);
			return true;
		}
		else{
			//have session already,but register again
			return false;
		}
	},
	update : function(form){
		Users.update(
			{_id:Session.get("user_id")},{$set:{
					real_name:form.realName.value,
					tel_phone:form.telPhone.value,
					mobile_phone:form.mobilePhone.value,
					standard:form.standard.value,
					declaration:form.declaration.value
			}});
	},
	examine : function (obj){
		var account = document.getElementById("account").value;
		var tips = document.getElementById("tips");
		var user = Users.findOne({account:account});
		tips.style.visibility = "visible";
		if(!user){
			tips.innerHTML = "没被注册";
		}
		else{
			tips.innerHTML = "已被注册";
		}
	}
};

var RoomHandler = {
	create : function (form){
		var user = Users.findOne({_id:Session.get("user_id")});
		var room = {
			name : form.roomName.value,
			owner : {ownerName:Users.findOne({_id:Session.get("user_id")}).name,ownerId:Session.get("user_id"),flag:false,comment:null},
			part : 0,
			count : Rooms.find({}).count(),
			num : 0,
			speaker : null
		};
		roomId = Rooms.insert(room);
		if(roomId){
			Session.set("room_id",roomId);
			Users.update({_id:Session.get("user_id")},{$set:{room_id:roomId}});
			return true;
		}
		else
			return false;
	},
	enterRoom : function (roomId){
		var room = Rooms.findOne({_id:roomId});
		var count = room.num+1;
		Rooms.update({_id:roomId},{$inc:{num:1}});
		Users.update({_id:Session.get("user_id")},{$set:{room_id:roomId,flag:false,light:true,turn:count}});
	},
	findRoom : function (){
		var result = Rooms.find({});
		return result;
	},
	exitRoom : function (msg){
		var room = Rooms.findOne({_id:Session.get("room_id")});
	    var user = Users.findOne({_id:Session.get("user_id")});
	    if(room){
	      if(room.part == 0||room.part == 8||msg =="success"){
	        if(user.gender == "male"){
	          Rooms.remove({_id:Session.get("room_id")});
	        }
	        Users.find({room_id:room._id,turn:{$gt:user.turn}}).forEach(function(item){
	        	Users.update({_id:item._id},{$inc:{turn:-1}});
	        });
	        Users.update({_id:user._id},{$set:{room_id:null}});
	        Rooms.update({_id:Session.get("room_id")},{$inc:{num:-1}});
	      }
	      else{
	        alert("亲，请在白富美和高富帅面前注意礼貌，回到自己座位！");
	        return false;
	      }
	    }
	    Meteor.Router.to("/gameHall/"+user._id+"&"+user.name+"&"+user.gender);
	    return false;
	}
};

var GameHandler = {
	userId : null,
	roomId : null,
	time : 0,
	map : {
		1 : "maleTalk",
		2 : "light",
		3 : "turnTalk",
		4 : "light",
		5 : "maleTalk",
		6 : "light",
		7 : "choice"
	},
	begin : function(){
		this.userId = Session.get("user_id");
		this.roomId = Session.get("room_id");
		var room = Rooms.findOne({_id:Session.get("room_id")});
		Rooms.update({_id:room._id},{$set:{speaker:null}});

		//1: male Self-introduction(20S)
		Rooms.update({_id:room._id},{$set:{speaker:room.owner.ownerId},$inc:{part:1}});
		this.time+=20000;

		//2:light(15S)
		setTimeout(function(){
			Rooms.update({_id:Session.get("room_id")},{$set:{speaker:null},$inc:{part:1}});
		},this.time);
		this.time+=15000;

		//3: Turns dialogue
		var queue = [];
		var male = Users.findOne({_id:room.owner.ownerId});
		var females = Users.find({room_id:this.roomId});
		females.forEach(function(female){
			if(female.light){
				queue.push(male);
				queue.push(female);
			}
		});
		setTimeout(function(){
			Rooms.update({_id:room._id},{$inc:{part:1}});
		},this.time);
		for(var i=0;i<queue.length;i++){
			setTimeout(function(){
				var user = queue.pop();
				Rooms.update({_id:room._id},{$set:{speaker:user._id}});
			},this.time);
			this.time+=8000;
		}

		//4:light(5S)
		setTimeout(function(){
			Rooms.update({_id:Session.get("room_id")},{$set:{speaker:null},$inc:{part:1}});
		},this.time);
		this.time+=5000;

		//5: Thorough Understand
		setTimeout(function(){
			Rooms.update({_id:room._id},{$set:{speaker:room.owner.ownerId},$inc:{part:1}});
		},this.time);
		this.time+=20000;

		//6 light
		setTimeout(function(){
			Rooms.update({_id:Session.get("room_id")},{$set:{speaker:null},$inc:{part:1}});
		},this.time);
		this.time+=5000;

		//7 choice
		setTimeout(function(){
			Rooms.update({_id:Session.get("room_id")},{$inc:{part:1}});
		},this.time);
		this.time+=10000;

		//8 exit
		setTimeout(function(){
			Rooms.update({_id:Session.get("room_id")},{$inc:{part:1}});
		},this.time);
	},
	chart : function(topic){
		if(Session.get("user_gender") == "male"){
			this.maleChart(topic);
		}
		else{
			this.femaleChart(topic);
		}
	},
	maleChart : function(topic){
		var room = Rooms.findOne({_id:this.roomId });
		Rooms.update({_id:this.roomId},{$set:{owner:{ownerId:room.owner.ownerId,ownerName:room.owner.ownerName,comment:topic,flag:true}}});
		setTimeout(function(){
			Rooms.update({_id:this.roomId},{$set:{owner:{ownerId:room.owner.ownerId,ownerName:room.owner.ownerName,comment:topic,flag:false}}});
		},2000);
	},
	femaleChart : function(topic){
		var room = Rooms.findOne({_id:Session.get("room_id")});
		Users.update({_id:room.speaker},{$set:{comment:topic,flag:true}});
		/*console.log(Users.findOne({_id:room.speaker}));*/
		setTimeout(function(){
			Users.update({_id:room.speaker},{$set:{comment:topic,flag:false}});
		},2000);
	},
	maleTalk : function(){

	},
	turnTalk : function(){

	},
	light : function(){

	},
	choice : function(){

	},
	
};