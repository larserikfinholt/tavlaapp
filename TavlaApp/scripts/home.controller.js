angular.module('tavla')
    .controller('HomeController', function (TavlaService, calendarItems, CalendarService, $ionicModal, $scope,  $interval) {

        var vm = this;

        vm.updates = TavlaService.updates;
        vm.days = calendarItems;
        vm.settings = TavlaService.saved;
        vm.tavlaService = TavlaService;
        vm.calendarService = CalendarService;
      


        vm.buster = function () {
            $scope.modal.hide();
            TavlaService.registerDoneIt(vm.user, 1).then(function (d) { TavlaService.doneIts.push(d); });
            console.log("Buster", vm.user);
        };

        vm.showUserDialog = function (user) {
            vm.user = user;
            $scope.modal.show();
        }


        $ionicModal.fromTemplateUrl('templates/popup-user.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal; 
        });


    $interval(function() {
        console.log("interval");
    }, 30*60*1000);
});