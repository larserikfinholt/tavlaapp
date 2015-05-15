angular.module('tavla')
    .controller('SettingsMainTasksController', function ($state, settings, TavlaService) {

        var vm = this;

        vm.tavlaService = TavlaService;

       
        vm.editTask = function (task) {
            console.log("State", $state);
            $state.go("app.settingstasks", { task: task });

        }
        vm.init=function() {
            console.log("Starting SettingsMainTasksController", settings);
        }
    vm.init();

}); 