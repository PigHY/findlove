Meteor.Router.add({
    '/':'login',
    '/register':'register',
    '/gameHall/:userId&:userName&:userGender':function(userId,userName,userGender){
      Session.set("user_id",userId);
      Session.set("user_name",userName);
      Session.set("user_gender",userGender);
      return "gameHall";
    },
    '/gameRoom/:roomId&:userId&:gender':function(roomId,userId,userGender){
      Session.set("room_id",roomId);
      Session.set("user_id",userId);
      Session.set("user_gender",userGender);
      return "gameRoom";
    },
    '/gameSuccess/:male&:female&:userId' : function(male,female,userId){
      Session.set("male_id",male);
      Session.set("female_id",female);
      Session.set("user_id",userId);
      return "gameSuccess";
    }
});

   /*login.html*/
Template.login.events({
  "submit .create" : function(evt){
    evt.preventDefault();
    var form = evt.target;
    var mark = UserHandler.login(form);
    if(mark){
      Meteor.Router.to("/gameHall/"+Session.get("user_id")+"&"+Session.get("user_name")+"&"+Session.get("user_gender"));
    }
    else{
      //login fail
    }
  }
});

   /*register.html*/
Template.register.events({
  "submit .create" : function(evt){
    evt.preventDefault();
    var form = evt.target;
    var mark = UserHandler.register(form);
    /*Users.remove({});*/
    if(mark){
      Meteor.Router.to("/gameHall/"+Session.get("user_id")+"&"+Session.get("user_name")+"&"+Session.get("user_gender"));
    }
    else{
      //tips false
    }
  }
});

   /*game-hall.html*/
Template.gameHall.username = function (){
  return Session.get("user_name");
}

Template.gameHall.gender = function (){
  return Session.get("user_gender");
}

Template.gameHall.events({
  "click .create-room-li":function (evt){
    evt.preventDefault();
    changeContent("create");
  },
  "click .tool-room-li":function (evt){
    evt.preventDefault();
    changeContent("tool");
  },
  "click .bordcast-room-li":function (evt){
    evt.preventDefault();
    changeContent("bordcast");
  },
  "click .personal-room-li":function (evt){
    evt.preventDefault();
    changeContent("personal");
  },
  "submit .hall-personal-form":function(evt){
    evt.preventDefault();
    var form = evt.target;
    UserHandler.update(form);
  },
  "submit .create-room" : function(evt){
    evt.preventDefault();
    var form = evt.target;
    //some problem
    var user = Users.findOne({_id:Session.get("user_id")});
    if(user){
      if(!user.mobile_phone || !user.name || !user.real_name || !user.standard || !user.tel_phone){
        alert("请完善个人资料才进行游戏！");
        return false;
      }
    }
    var mark = RoomHandler.create(form);
    if(mark){
        Meteor.Router.to("/gameRoom/"+Session.get("room_id")+"&"+Session.get("user_id")+"&"+Session.get("user_gender"));
    }
    else
      alert("创建房间失败!");
  },
  "click .hall-enter-btn" : function(evt){
    evt.preventDefault();
    var user = Users.findOne({_id:Session.get("user_id")});
    if(user){
      if(user.gender == "male"){
        alert("亲，不要打断人家泡妞");
        return false;
      }
      if(!user.mobile_phone || !user.name || !user.real_name || !user.standard || !user.tel_phone){
        alert("请完善个人资料才进行游戏！");
        return false;
      }
    }
    var obj = evt.target;
    var room = Rooms.findOne({_id:obj.value});
    if(room.part != 0){
      alert("游戏中");
      return false;
    }
    RoomHandler.enterRoom(obj.value);
    Meteor.Router.to("/gameRoom/"+obj.value+"&"+Session.get("user_id")+"&"+Session.get("user_gender"));
  },
  "click #nav-exit-light" :function (evt){
    evt.preventDefault();
    Meteor.Router.to("/");
    Session.init();
  }
});
Template.gameHall.room = function(){
  return RoomHandler.findRoom();
}
Template.gameHall.checkGender = function(gender){
  return Session.get("user_gender") === gender;
}

Template.gameRoom.events({
  "click .room-begin-game":function(evt){
    evt.preventDefault();
    GameHandler.begin();
  },
  "click .room-dialog-btn":function(evt){
    var topic = document.getElementById("content");
    GameHandler.chart(topic.value);
  },
  "click #choice-light-light" : function(evt){
    evt.preventDefault();
    var userId = Session.get("user_id");
    if(userId){
      Users.update({_id:userId},{$set:{light:false}});
    }
  },
  "click .room-choice-btn":function(evt){
    evt.preventDefault();
    var obj = evt.target;
    var user = Users.findOne({_id:Session.get("user_id")});
    var room = Rooms.findOne({_id:Session.get("room_id")});
    if(room){
      if(user._id == room.owner.ownerId){
        var couple = {
          male_id : Session.get("user_id"),
          female_id : obj.value,
          room_id : room._id,
          room_name:room.name,
          date : new Date()
        };
        Couples.insert(couple);
        obj.style.display = "none";
        Session.set("male_id",couple.male_id);
        Session.set("female_id",couple.female_id);
      }
    }
    return false;
  },
  "click .room-prop-box-light":function(evt){
    evt.preventDefault();
    RoomHandler.exitRoom();
  },
  "click .room-contant":function(evt){
    evt.preventDefault();
    var maleId = Session.get("male_id");
    var femaleId = Session.get("female_id");
    if(maleId&&femaleId){
      Meteor.Router.to("/gameSuccess/"+maleId+"&"+femaleId+"&"+Session.get("user_id"));
    }
    var room = Rooms.findOne({_id:Session.get("room_id")});
    var couple = Couples.findOne({room_id:room._id});
    if(couple&&(couple.female_id == Session.get("user_id"))){
      Meteor.Router.to("/gameSuccess/"+couple.male_id+"&"+couple.female_id+"&"+Session.get("user_id"));
    }
  },
  "click .room-tool-item-btn" : function (evt){
    evt.preventDefault();
    var obj = evt.target;
    if(obj.name == "contant"){
      var userId = obj.value;
      var user = Users.findOne({_id:userId});
      if(user){
        var box = document.getElementById("room-person");
        box.style.display = "block";
        var avatar = document.getElementById("room-person-avatar");
        if(user.gender == "male"){
          avatar.src = "../avatar-male.png";
        }
        else{
          avatar.src = "../avatar-female.png";
        }
        var nickname = document.getElementById("room-person-nickname");
        nickname.innerHTML = user.name;
        var gender = document.getElementById("room-person-gender");
        gender.innerHTML = user.gender;
        var standard = document.getElementById("room-person-standard");
        standard.innerHTML = user.standard;
        var declaration = document.getElementById("room-person-declaration");
        declaration.innerHTML = user.declaration;
      }
    }
    else {
      var sender = Users.findOne({_id:Session.get("user_id")});
      var receiver = Users.findOne({_id:obj.value});
      var tool = {
        sender_id : sender._id,
        receiver_id : receiver._id,
        room_id : Session.get("room_id"),
        type : obj.name,
        receiver_turn : null,
        sender_name : sender.name,
        receiver_name : receiver.name
      };
      if(receiver.gender == "male"){
        tool.receiver_turn = "male";
      }
      else{
        tool.receiver_turn = "female"+receiver.turn;
      }
      var toolId = ToolStatus.insert(tool);
      setTimeout(function(){
        ToolStatus.remove({_id:toolId});
      },2000);
    }
  },
  "click .room-person-box-exit" : function (evt){
    evt.preventDefault();
    var box = document.getElementById("room-person");
    box.style.display = "none";
  }
});

Template.gameHall.couple = function(){
  var couples = [];
  var tempCouples = Couples.find({});
  if(tempCouples){
    tempCouples.forEach(function(tempCouple){
    var male = Users.findOne({_id:tempCouple.male_id});
    var female = Users.findOne({_id:tempCouple.female_id});
    var couple = {
      male_name:male.name,
      female_name:female.name,
      room_name:tempCouple.room_name
    };
    couples.push(couple);
    });
    return couples;
  }
  return false;
}

Template.gameRoom.tips = function(status){
  var room = Rooms.findOne({_id:Session.get("room_id")});
  if(room){
    if(status == room.part)
      return true;
  }
  return false;
}

Template.gameRoom.roomName = function(){
  var room = Rooms.findOne({_id:Session.get("room_id")});
  if(room){
    return room.name;
  }
  else
    return "";
}
Template.gameRoom.roomOwner = function(){
  var room = Rooms.findOne({_id:Session.get("room_id")});
  if(room){
    return room.owner.ownerName;
  }
  else
    return "";
}
Template.gameRoom.checkGender = function(gender){
  return Session.get("user_gender") === gender;
}
Template.gameRoom.guest = function(){
  var users = Users.find({room_id:Session.get("room_id")},{sort:{name:-1}});
  if(users){
    return users;
  }
  return "";
}
Template.gameRoom.maleSaying = function(){
  var room = Rooms.findOne({_id:Session.get("room_id")});
  if(room){
    return room.owner.flag;
  }
  return false;
}
Template.gameRoom.maleContent = function(){
  var room = Rooms.findOne({_id:Session.get("room_id")});
  if(room){
    return room.owner.comment;
  }
  return false;
}
Template.gameRoom.femaleContent = function(){
  var room = Rooms.findOne({_id:Session.get("room_id")});
  var user = Users.findOne({_id:room.speaker});
  if(user){
    if(user.comment)
      return user.comment;
  }
  return false;
}

Template.gameRoom.dialog = function(){
  var room = Rooms.findOne({_id:Session.get("room_id")});
  if(room){
    if(room.speaker == Session.get("user_id")){
      return true;
    }
  }
  return false;
}

/*Template.gameRoom.Showlight = function(){
  var user = Users.findOne({_id:Session.get("user_id")});
  var room = Rooms.findOne({_id:Session.get("room_id")});
  if(user&&user.light&&(room.part == 2||room.part == 4||room.part == 6)){
    console.log(room.part);
    return true;
  }
  return false;
}*/
Template.gameRoom.choice = function(info){
  var user = Users.findOne({_id:info});
  var room = Rooms.findOne({_id:Session.get("room_id")});
  if(user&&user.light&&room.part == 7){
    return true;
  }
  return false;
}
Template.gameRoom.checkLight = function(){
  var userId = Session.get("user_id");
  if(userId){
    var user = Users.findOne({_id:userId});
    if(user){
      return user.light;
    }
  }
  return false;
}
//获取联系人
/*Template.gameRoom.contact = function(){
  var room = Rooms.findOne({_id:Session.get("room_id")});
  if(room&&(room.part==7||room.part==8)){
    var maleId = Session.get("male_id");
    var femaleId = Session.get("female_id");
    if(maleId&&femaleId){
      return true;
    }
    var userId = Session.get("user_id");
    var ownerId = room.owner.ownerId;
    var couple = Couples.findOne({male_id:ownerId,female_id:userId});
    if(couple){
      return true;
    }
  }
  return false;
}*/
Template.gameRoom.person = function(){
  var roomId = Session.get("room_id");
  if(roomId){
    var users = Users.find({room_id:roomId});
    return users;
  }
}
Template.gameRoom.gender = function(gender){
  return this.gender == gender;
}
Template.gameRoom.toolStatus = function(){
  var roomId = Session.get("room_id");
  if(roomId){
    var toolStatus = ToolStatus.find({room_id:roomId});
    return toolStatus;
  }
  return false;
}
Template.gameRoom.type = function(type){
  return this.type == type;
}
/*Template.gameRoom.toolCheck = function(userId){
  var roomId = Session.get("room_id");
  if(roomId){
    var tool = ToolStatus.findOne({room_id:roomId,sender_id:userId});
    if(tool)
      return true;
  }
  return false;
}*/
Template.gameRoom.toolTips = function(userId){
  var roomId = Session.get("room_id");
  if(roomId){
    var tool = ToolStatus.findOne({room_id:roomId,sender_id:userId});
    if(tool){
      if(tool.type == "flower")
        return tool.sender_name + "向" + tool.receiver_name + "献上鲜花一朵";
      else if(tool.type == "egg")
        return tool.sender_name + "向" + tool.receiver_name + "扔了一只鸡蛋";
      return tool;
    }
  }
  return ;
}

Template.gameSuccess.events({
  "click .success-back-btn" : function (evt){
    evt.preventDefault();
    var user = Users.findOne({_id:Session.get("user_id")});
    if(user){
      Meteor.Router.to("/gameHall/"+user._id+"&"+user.name+"&"+user.gender);
    }
    return false;
  }
});

Template.gameSuccess.maleNickName = function (){
  var male = Users.findOne({_id:Session.get("male_id")});
  if(male){
    return male.name;
  }
}
Template.gameSuccess.maleRealName = function (){
  var male = Users.findOne({_id:Session.get("male_id")});
  if(male){
    return male.name;
  }
}
Template.gameSuccess.maleGender = function (){
  var male = Users.findOne({_id:Session.get("male_id")});
  if(male){
    return male.gender;
  }
}
Template.gameSuccess.maleTelPhone = function (){
  var male = Users.findOne({_id:Session.get("male_id")});
  if(male){
    return male.tel_phone;
  }
}
Template.gameSuccess.maleMobilePhone = function (){
  var male = Users.findOne({_id:Session.get("male_id")});
  if(male){
    return male.mobile_phone;
  }
}
Template.gameSuccess.maleStandard = function (){
  var male = Users.findOne({_id:Session.get("male_id")});
  if(male){
    return male.standard;
  }
}
Template.gameSuccess.maleDeclaration = function (){
  var male = Users.findOne({_id:Session.get("male_id")});
  if(male){
    return male.declaration;
  }
}
Template.gameSuccess.femaleNickName = function (){
  var female = Users.findOne({_id:Session.get("female_id")});
  if(female){
    return female.name;
  }
}
Template.gameSuccess.femaleRealName = function (){
  var female = Users.findOne({_id:Session.get("female_id")});
  if(female){
    return female.name;
  }
}
Template.gameSuccess.femaleGender = function (){
  var female = Users.findOne({_id:Session.get("female_id")});
  if(female){
    return female.gender;
  }
}
Template.gameSuccess.femaleTelPhone = function (){
  var female = Users.findOne({_id:Session.get("female_id")});
  if(female){
    return female.tel_phone;
  }
}
Template.gameSuccess.femaleMobilePhone = function (){
  var female = Users.findOne({_id:Session.get("female_id")});
  if(female){
    return female.mobile_phone;
  }
}
Template.gameSuccess.femaleStandard = function (){
  var female = Users.findOne({_id:Session.get("female_id")});
  if(female){
    return female.standard;
  }
}
Template.gameSuccess.femaleDeclaration = function (){
  var female = Users.findOne({_id:Session.get("female_id")});
  if(female){
    return female.declaration;
  }
}