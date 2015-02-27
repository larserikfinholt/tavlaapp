angular.module('tavla')
    .controller('LoginController', function ($state, TavlaService) {

        var vm = this;

        vm.showLoginButton = true;

        vm.loginFail = null;

        vm.login = function () {

            vm.result = null;
            TavlaService.authenticate().then(function(auth) {
                console.log("Authentication result:", auth);
                TavlaService.login().then(function(data) {
                    var d = data.result;
                    console.log("logged in to Tavla", d);

                    vm.result = d;
                    if (d.registerState === "completed") {
                        $state.go("app.home", { 'status': 'San Diego' });
                    } else {
                        console.log("Register state");
                        $state.go("register", { 'status': 'San Diego' });
                    }
                }, function(d) {
                    vm.result = d;
                    console.warn("Could not log in", d);
                    vm.loginFail = { text: "Could not log in", error: d };
                });
            });

        }

        vm.test = function () {
            vm.testProp = "nullstilt";
            TavlaService.test().then(function (a) {

                vm.testProp = {
                    fraTest: a,
                    time: new Date()
                };

            });
            vm.testCalled = new Date();

        }


        vm.logout = function () {
            vm.result = null;
            vm.testProp = null;
            TavlaService.logout().then(function (d) {

                vm.result = d;

            });
        }

    });