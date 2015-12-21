(function(){

  'use strict';

  var itemService = angular.module('app').service('Items', __ItemService);

  function __ItemService($http, $rootScope, $filter, Utils)
  {
    var service = {};

    var item = {
      iid : undefined,
      email : undefined,
      childrenId : []
    };

    var DATA_LOCATION = "http://localhost/test";

    var list = [];

    //service.get = get;
    //service.list = list;
    //service.remove = remove;
    service.create = create;
    service.save = save;
    service.getList = getList;
    service.createUser = createUser;
    service.createGroup = createGroup;
    service.notify = notify;
    service.register = register;
    service.getAllUsers = getAllUsers;
    service.getAllGroups = getAllGroups;
    service.getAllItems = getAllItems;

    getAllItems();

    function create(mail, firstName, lastName, tel)
    {
      var newItem = angular.copy(item);
      newItem.iid = Utils.generateUUID();
      newItem.email = mail;
      newItem.firstName = firstName;
      newItem.lastName = lastName;
      newItem.tel = tel;
      return newItem;
    }

    function create(mail, _name)
    {
      var newItem = angular.copy(item);
      newItem.iid = Utils.generateUUID();
      newItem.email = mail;
      newItem._name = _name;
      return newItem;
    }

    function create()
    {
      var newItem = angular.copy(item);
      newItem.iid = Utils.generateUUID();
      newItem.email = "example@mail.com";
      return newItem;
    }

    /********************* Factory Pattern takes place here ********************************************/

    /* to create a user, calling just the constructor isn't enough
    *  because the user constructor doesn't know how to generate an ID
    *  to solve this problem, we will delegate this work to the FACTORY
    */
    function createUser(firstName, lastName, tel, email)
    {
      var user = new User(firstName, lastName, tel, email);
      user.iid = Utils.generateUUID();
      return user;
    }

    /* same thing for group */
    function createGroup(name, email)
    {
      var group = new Group(name, email);
      group.iid = Utils.generateUUID();
      return group;
    }
    /******************* End of Factory Pattern ****************************************************/

    // save into the list item and in the database
    function save(item)
    {
      console.log("saving item : "+item);
      var found = false;
      for (var idx in list)
      {
        if (list[idx].iid === item.iid)
        {
          list[idx] = item;
          found = true;
          break;
        }
      }
      if ( !found )
      {
        list.push(item);
      }
      var _type;
      if ( item instanceof User )
      {
         _type = "user";
      }
      else if ( item instanceof Group )
      {
         _type = "group";
      }
      console.log(DATA_LOCATION+"?type="+_type+"&action=save&item="+JSON.stringify(item));
      $http.get(DATA_LOCATION+"?type="+_type+"&action=save&item="+JSON.stringify(item))
        .then(function(response) {
          console.log("server response "+response.data);
        });
      console.log(list);
    }


    function getList()
    {
      return list;
    }

    function attachUserToGroup(user, groupId)
    {
      if ( user && groupId )
      {
        for(var i=0; i<groupId.length; i++)
        {
            user.parentId.push(groupId[i]);
        }
      }
    }


    function loadData(_type)
    {
      console.log("Attempting to load data ...");
      $http.get(DATA_LOCATION+"?type="+_type+"&action=get")
        .then(function(response) {
          console.log(response.data);
          // after loading data, parse data
          var jsonData = JSON.parse(JSON.stringify(response.data));
          switch ( _type )
          {
             case "all":
               var users = jsonData.users;
               var groups = jsonData.groups;
               if ( users != undefined )
               {
                 //loadUsers
                 for (var i = 0; i < users.length; i++) {
                     // construct Items out of json file
                     var user = createUser(users[i].firstName, users[i].lastName, users[i].tel, users[i].email);
                     // override id
                     user.iid = users[i].iid;
                     // atach user to the appropriate groups
                     attachUserToGroup(user, users[i].parentId)
                     list.push(user);
                     console.log(user);
                   }
               }
               if ( groups != undefined)
               {
                 //load groups
                 for (var i = 0; i < groups.length; i++) {
                 // construct Items out of json file
                 var group = createGroup(groups[i].name, groups[i].email);
                 // override id
                 group.iid = groups[i].iid;
                 list.push(group);
                 console.log(group);
                 }
               }
               break;
             case "users":
               var users = jsonData.users;
               if ( users != undefined )
               {
                 //loadUsers
                 for (var i = 0; i < users.length; i++) {
                     // construct Items out of json file
                     var user = createUser(users[i].firstName, users[i].lastName, users[i].tel, users[i].email);
                     // override id
                     user.iid = users[i].iid;
                     // atach user to the appropriate groups
                     attachUserToGroup(user, users[i].parentId)
                     list.push(user);
                     console.log(user);
                   }
               }
             case "groups":
               var groups = jsonData.groups;
               if ( groups != undefined)
               {
                 //load groups
                 for (var i = 0; i < groups.length; i++) {
                 // construct Items out of json file
                 var group = createGroup(groups[i].name, groups[i].email);
                 // override id
                 group.iid = groups[i].iid;
                 list.push(group);
                 console.log(group);
                 }
               }
               break;
          }
          // notify observers ( Controller ) that data load is complete
          // so that they can update the view
          // because the data loading is asynchronous, which may causes the view
          // te be rendered before the data is completely loaded
          notify("DataLoadComplete");
      });
    }

    function notify(_event)
    {
       $rootScope.$emit(_event);
    }

    // register an observer with a specified event and a callback
    function register(scope, _event, callback) {
        var handler = $rootScope.$on(_event, callback);
        scope.$on('$destroy', handler);
    }

    function getAllUsers()
    {
      loadData("users");
    }

    function getAllGroups()
    {
      loadData("groups");
    }

    function getAllItems()
    {
      loadData("all");
    }

    return service;
  }

})();
