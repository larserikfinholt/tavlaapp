angular.module('tavla')
    .controller('HomeController', function (TavlaService, calendarItems, CalendarService, $ionicModal, $scope,  $interval) {

        var vm = this;

        vm.updates = TavlaService.updates;
        vm.days = calendarItems;
        vm.settings = TavlaService.saved;
        vm.tavlaService = TavlaService;
        vm.calendarService = CalendarService;
      


        vm.buster = function (u) {
            $scope.modal.hide();
            $scope.modalAlert.hide();
            var user = u||vm.user;
            TavlaService.registerDoneIt(user, 1).then(function (d) { TavlaService.doneIts.push(d); });
            console.log("Buster", user);
        };

        vm.showUserDialog = function (user) {
            vm.user = user;
            $scope.modal.show();
        }
        vm.alertClick=function(type) {
            $scope.modalAlert.show();
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

    $interval(function() {
        console.log("reload calndars");
        CalendarService.reload();
    }, 30*60*1000);
});