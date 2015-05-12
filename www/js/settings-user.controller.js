angular.module('tavla')
    .controller('UserSettingsController', function ($stateParams,  TavlaService, CalendarService, $state, user) {
        console.log("UserSettingsController", $stateParams);
        var vm = this;

        var isEditMode = !!user;

    vm.calendars = CalendarService.calendars;

        vm.save = function () {
            TavlaService.addOrUpdateUser(vm.user).then(function (d) {
                TavlaService.login().then(function (d) {
                    //$state.transitionTo("app.settings", $stateParams, {
                    //    reload: true,
                    //    inherit: false,
                    //    notify: true
                    //});
                    $state.go("app.settings", { 'status': 'San Diego' }, { reload: true });
                 
                });
            });
        }

        function init() {
            if (isEditMode) {
                vm.user = user;
                vm.title = "Edit user";

            } else {
                vm.title = "Add new user";
                vm.user = {};
            }

        }

        init();

    });