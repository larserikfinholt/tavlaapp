angular.module('tavla')
    .controller('SettingsController', function ( settings) {

        var vm = this;
        vm.init=function() {
            console.log("Starting settingscontroller", settings);
        }

    });