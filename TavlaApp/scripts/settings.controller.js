angular.module('tavla')
    .controller('SettingsController', function ($state, settings, TavlaService) {

        var vm = this;

        vm.tavlaService = TavlaService;

        vm.edit=function(user) {
            console.log("State", $state);
            $state.go("app.settingsuser", { user: user });

        }

        vm.init=function() {
            console.log("Starting settingscontroller", settings);
        }
    vm.init();

}); 