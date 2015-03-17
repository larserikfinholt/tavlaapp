angular.module('tavla')
    .controller('UserSettingsController', function ($stateParams, settings, TavlaService, $state, $window) {
        console.log("UserSettingsController", settings, $stateParams);
        var vm = this;

        var isEditMode = $stateParams.userIndex != -1;

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
                vm.user = settings.members[$stateParams.userIndex];
                vm.title = "Edit user";

            } else {
                vm.title = "Add new user";
                vm.user = {};
            }

        }

        init();

    });