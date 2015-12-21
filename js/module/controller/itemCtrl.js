(function(){

    'use strict';

    angular.module('app').controller('ItemCtrl', ItemCtrl);
    angular.module('app').controller('UserCtrl', UserCtrl);
    angular.module('app').controller('GroupCtrl', GroupCtrl);


	function ItemCtrl($scope, Items, $location)
	{
		$scope.ctrlData = {
			item : undefined,
			list : [],
      filter: '',
      currentTab: ''
		};


		$scope.newItem = function() {
			$scope.ctrlData.item = Items.create();
		}
    //
		// $scope.saveItem = function(item)
		// {
    //   console.log("in save item");
		// 	Items.save(item);
    //   $scope.$emit("ItemListChanged");
		// }

    this.saveItem =  function(item)
		{
      console.log("in save item");
			Items.save(item);
      // Observer Pattern appears here
      // ItemCtrl notify other observers that list has been changed
      //$scope.$emit("ItemListChanged");
      notify("ItemListChanged");
		}

    $scope.deleteItem = function(iid)
    {

    }

    $scope.getItemType = function getItemType(item)
    {
      console.log("item instance of user ?"+ item instanceof User);
       return item instanceof User ? 0: 1;
    }

    $scope.filteredItems = '';

		function updateList()
		{
      console.log("ItemController: updateListe > ");
			$scope.ctrlData.list = angular.copy(Items.getList());
      console.log($scope.ctrlData.list);
		}

    // Notifier function for Observer Pattern purpose
    function notify(_event)
    {
       $scope.$emit(_event);
    }

    $scope.$watch(function () {
      $scope.filteredItems = $scope.$eval("ctrlData.list | filter: ctrlData.filter");
    });

    Items.register($scope, "DataLoadComplete",  function(){
       console.log("data load complete");
       notify("ItemListChanged");
    });

    // update list whenever ItemListChanged event is fired
    $scope.$on("ItemListChanged", updateList);
	}

  /*
  *  User Controller class definition inherits from ItemCtrl
  */
  // inheritance
  UserCtrl.prototype = Object.create(ItemCtrl.prototype);
  function UserCtrl($scope, Items)
  {
      ItemCtrl.call(this, $scope, Items);

      $scope.usrData = {
         user: Items.createUser("", "", "", ""),
         list: []
      }

      init();

      $scope.newUser = function(firstName, lastName, tel, email)
      {
        console.log("in new user");
        $scope.usrData.user = Items.createUser(firstName, lastName, tel, email);
      }

      $scope.createUser = function(firstName, lastName, tel, email)
      {
        console.log("in new user");
        $scope.ctrlData.item = Items.createUser(firstName, lastName, tel, email);
      }

      function updateList()
      {
        console.log("User Controller: updating list ...");
        var itemList = angular.copy(Items.getList());
        // filter user list from list of items
        for(var i=0; i<itemList.length;  i++)
        {
          if ( !(itemList[i] instanceof User) )
          {
            // remove
            itemList.splice(i, 1);
            i--;
          }
        }
        $scope.usrData.list = angular.copy(itemList);
        console.log($scope.usrData.list);
      }

      function init()
      {
        updateList();
      }

      // Observer pattern, call the observer function
      $scope.$on("ItemListChanged", updateList);

  }

  /*************** Enf of UserCtrl definition ********************/
  /*
  *  GroupCtrl class definition inherits from ItemCtrl
  */
  // inheritance
  GroupCtrl.prototype = Object.create(ItemCtrl.prototype);
  function GroupCtrl($scope, Items, $filter)
  {
    // call super class constructor

    ItemCtrl.call(this, $scope, Items);

    $scope.grpData = {
       group: Items.createGroup("", ""),
       list: []
    }

    init();

    $scope.newGroup = function(name, email)
    {
      $scope.ctrlData.item = Items.createGroup(name, email);
    }

    function updateList()
    {
      console.log("Group Controller: updating list ...");
      var itemList = angular.copy(Items.getList());
      // filter group list from list of items
      for(var i=0; i<itemList.length;  i++)
      {
        if ( !(itemList[i] instanceof Group) )
        {
          // remove
          itemList.splice(i, 1);
          i--;
        }
      }
      $scope.grpData.list = angular.copy(itemList);
      console.log($scope.grpData.list);
    }

    function init()
    {
      updateList();
    }

    $scope.newGroup = function(name, email)
    {
      $scope.ctrlData.item = Items.createGroup(name, email);
    }

    // get a group by it's id
    $scope.get = function get(groupId)
    {
      // if groupId is undefined, no filter would be applied, thus same list will be returned
      if ( groupId != undefined )
      {
        var filteredList = $filter('filter')($scope.grpData.list, { iid: groupId });
        //console.log("GroupCtrl.get("+groupId+") : "+filteredList[0]);
        return filteredList[0];
      }
    }

    $scope.$on("ItemListChanged", updateList);
  }

})();
