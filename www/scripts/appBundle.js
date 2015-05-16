/// <reference path="../../typings/tsd.d.ts"/>
var tavla;
(function (tavla) {
    var SettingsMainController = (function () {
        function SettingsMainController($state, tavlaService) {
            this.$state = $state;
            this.tavlaService = tavlaService;
        }
        SettingsMainController.prototype.usersClick = function () {
            this.$state.go('app.settings-main-users');
        };
        SettingsMainController.prototype.tasksClick = function () {
            this.$state.go('app.settings-main-tasks');
        };
        SettingsMainController.prototype.logout = function () {
            var _this = this;
            this.tavlaService.logout().then(function (x) {
                _this.$state.go('login');
                console.log("Reloading....");
                window.cookies.clear(function () {
                    console.log('Cookies cleared!');
                });
                window.location.reload();
            });
        };
        SettingsMainController.$inject = ['$state', 'TavlaService'];
        return SettingsMainController;
    })();
    tavla.SettingsMainController = SettingsMainController;
})(tavla || (tavla = {}));
angular.module('tavla').controller('SettingsMainController', tavla.SettingsMainController);
/// <reference path="../../typings/tsd.d.ts"/>
var jalla = (function () {
    function jalla(asd) {
        console.log("Created");
        ionic.Platform.isAndroid();
    }
    return jalla;
})();
//# sourceMappingURL=appBundle.js.map