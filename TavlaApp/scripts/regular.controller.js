angular.module('tavla')
    .controller('RegularController', function ($state, settings, TavlaService) {

        var vm = this;

        vm.tavlaService = TavlaService;

        vm.edit=function(user) {
            console.log("State", $state);
            //$state.go("app.settingsuser", { user: user });

        }

        vm.init=function() {
            console.log("Starting regularcontroller", settings);
        }
    vm.init();

}); 