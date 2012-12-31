// Init Session
Session.init = function(){
	/*user information*/
	Session.set("user_id",null);
	Session.set("user_name",null);
	Session.set("user_gender",null);
	Session.set("room_id",null);
	Session.set("male_id",null);
	Session.set("female_id",null);
};
Session.init();