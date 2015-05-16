angular.module('tavla')
    .controller('LoginController', function ($state, TavlaService) {

        var vm = this;

        vm.showLoginButton = true;
        vm.state='default';

        vm.loginFail = null;

        vm.login = function (provider) {
            vm.state='authenticating';
            vm.provider=provider;

            vm.result = null;
            TavlaService.authenticate(provider).then(function (auth) {
                vm.state='login-in-process';
                
                console.log("Authentication result:", auth);
                TavlaService.login().then(function (data) {
                    var d = data.result;
                    //console.log("logged in to Tavla", d);
                    window.localStorage['hasLoggedInBefore'] = 'yes';
                    window.localStorage['authenticateProvider'] = provider;

                    vm.result = d;
                    if (d.registerState === "completed") {
                        $state.go("app.home", { 'status': 'San Diego' });
                    } else {
                        console.log("Register state");
                        $state.go("register", { 'status': 'San Diego' });
                    }
                }, function (d) {
                    vm.state='login-fail';
                    
                    vm.result = d;
                    console.warn("Could not log in", d);
                    vm.loginFail = { text: "Could not log in", error: d };
                });
            }, function(d){
                vm.state='authenticate-fail';
                
            });

        };

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
                 window.localStorage['hasLoggedInBefore'] = 'no';
                 window.localStorage['authenticateProvider'] = 'none';
            TavlaService.logout().then(function (d) {


            });
        };

        vm.init = function () {
            var hasLoggedInBefore = window.localStorage['hasLoggedInBefore'] || 'no';
            var authProvider=window.localStorage['authenticateProvider'] || 'none';
            console.log("HasLoggedInBefore: " + hasLoggedInBefore, authProvider);
            if (hasLoggedInBefore == 'yes' && authProvider!='none') {
                vm.hasLoggedInBefore = true;
                vm.state='autologin';
                vm.provider=authProvider;
                console.log("Waiting for platform ready...");
                ionic.Platform.ready(function() {
                    vm.login(authProvider);
                });
            }
        }
    vm.init();

});