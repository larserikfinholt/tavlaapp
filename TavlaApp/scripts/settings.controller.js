angular.module('tavla')
    .controller('SettingsController', function ($state, settings) {

        var vm = this;
        vm.settings = settings;

        vm.edit=function(user) {

            var index = vm.settings.members.indexOf(user);
            $state.go("app.usersettings", { userIndex: index });

        }

        vm.init=function() {
            console.log("Starting settingscontroller", settings);
        }
    vm.init();

});