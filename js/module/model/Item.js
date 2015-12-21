/*
*  This file contains definition of Item, User and Group
*  for the model part of the application
*
*/

/********* Item Class definition ********************/
var Item = function(email){

  this.iid = undefined;
  this.email = email;

};
/********* End of Item class definition *************/

/********* User class definition, inherits from Item ******************/

// specify inheritance
User.prototype = Object.create(Item.prototype);
// specify constructor
User.prototype.constructor = User;

// define User constructor
function User(firstName, lastName, tel, email) {
  // call super Class constructor
  Item.call(this, email);
  // attributes
  this.firstName = firstName;
  this.lastName = lastName;
  this.tel = tel;
  this.parentId =  [];
}

// Methods for User class
User.prototype.toString = function(){
  console.log(this.firstName + " " + this.lastName);
  return this.firstName + " " + this.lastName;
};

/********* End of User class definition ************/

/********* Group class definition, inherits from Item ******************/

// specify inheritance
Group.prototype = Object.create(Item.prototype);
// specify constructor
Group.prototype.constructor = Group;

// define Group constructor
function Group(name, email) {
  // call super Class constructor
  Item.call(this, email);
  // attributes
  this.name = name;
  this.childrenId = [];
}

// Methods for Group class
Group.prototype.toString = function(){
  console.log(this.name + " " + this.email);
  return this.name + " " + this.email;
};

/********* End of Group class definition ************/
