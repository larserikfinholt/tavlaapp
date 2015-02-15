angular.module('tavla')
    .controller('LoginController', function ($state, TavlaService) {

        var vm = this;

        vm.showLoginButton = true;

    vm.loginFail = null;

        vm.doLogin = function() {

            TavlaService.login().then(function(d) {
                console.log("logged in", d);
                $state.go("app.home", { 'status': 'San Diego' });
            }, function(d) {
                console.warn("Could not log in", d);
                vm.loginFail = { text: "Could not log in", error: d };
            });

        }

    });