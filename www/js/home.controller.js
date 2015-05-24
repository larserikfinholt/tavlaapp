angular.module('tavla')
    .controller('HomeController', function (TavlaService, calendarItems, CalendarService, $ionicModal, $scope, $interval, $ionicLoading) {

        var vm = this;
        vm.points = 1;
        vm.updates = TavlaService.updates;
        vm.days = calendarItems;
        vm.settings = TavlaService.saved;
        vm.tavlaService = TavlaService;
        vm.calendarService = CalendarService;




        vm.buster = function (u) {
            vm.user = u || vm.user;
            console.log("Buster");
            vm.taskClick({data: { taskTypeId: 1 } });
        };
        vm.taskClick = function (task) {
            vm.loading = true;
            $scope.modal.hide();
            $scope.modalAlert.hide();
            TavlaService.registerDoneIt(vm.user, task.data.taskTypeId).then(function(d) {
                TavlaService.doneIts.push(d);
                TavlaService.refreshAlerts();
                vm.loading = false;

            });
            console.log("TaskClick", task, vm.user);
            vm.user = null;
        };
        //vm.calculatePoints=function() {
        //    TavlaService.doneIts
        //}
        vm.getTaskNameForType = function (doneIt) {
            if (doneIt.type === 1) {
                return "Buster";
            }
            if (doneIt.type === 999) {
                return "Nullstilling";
            }
            var t = _.find(vm.tavlaService.tavlaSetting.tasks, function(a){ return a.data.taskTypeId===doneIt.type;  });
            if (t) {
                return t.data.name;
            } else {
                return "Unknown task";
            }
        };

        vm.showUserDialog = function (user) {
            vm.user = user;
            vm.points = TavlaService.getPointsForUser(user);
            $scope.modal.show();
        };
        vm.alertClick = function (type) {
            $scope.modalAlert.show();
        };
        vm.showShopping = function () {
            $scope.modalShopping.show();
        };
        vm.addShopping = function () {
            vm.tavlaService.recognizeSpeech().then(function (a) {
                if (a.item.title && a.item.title != 0) {
                    vm.addShoppingListItem(a.item.title);
                } else {
                    $ionicLoading.show({
                        template: 'Sorry, could you please repeat...',
                        duration: 1500
                    });
                }
            });
        };
        vm.addShoppingListItem = function (item) {
            var toAdd = {};
            toAdd.data = item;
            console.log("Addding", toAdd);
            vm.saving = true;

            vm.tavlaService.addListItem(0, item).then(function (d) {
                vm.tavlaService.shoppingList.push(d);
                console.log("Added", d, vm.tavlaService.shoppingList);
                vm.saving = false;
            });

            //vm.tavlaService.saveSettingWithName('diverse').then(function (r) {
            //    //$ionicLoading.show({
            //    //    template: 'Added: ' + item,
            //    //    duration: 1500
            //    //});
            //    console.log("Saved", r);
            //    vm.saving = false;
            //});
        };
        vm.shoppingListRemoveItem = function (item) {
            vm.tavlaService.removeListItem(item).then(function(id){
                _.remove(vm.tavlaService.shoppingList, {id:id});
            });
        };


        vm.refresh = function () {
            TavlaService.refresh().then(function () {
                CalendarService.refresh().then(function () {
                    console.log("Refresh complete");
                    $scope.$broadcast('scroll.refreshComplete');

                });
            });
        };

        function init() {
            vm.tavlaService.getWeatherForecast().then(function () {
                vm.tavlaService.loadDoneItSummary();
            });
            
        }

        $ionicModal.fromTemplateUrl('templates/popup-user.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });
        $ionicModal.fromTemplateUrl('templates/popup-alerts.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modalAlert = modal;
        });
        $ionicModal.fromTemplateUrl('templates/popup-shopping.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modalShopping = modal;
        });

        $interval(function () {
            console.log("reload calndars");
            CalendarService.refresh();
        }, 30 * 60 * 1000);

        init();
    });