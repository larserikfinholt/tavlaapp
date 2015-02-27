angular.module('tavla')
    .controller('RegisterController', function ($state, TavlaService, CalendarService, mode) {

        var vm = this;

        vm.mode = mode;

        vm.toCreate = {
            action:'RegisterNewFamily',
            users: [
                {
                    userName:'name1',
                    calendar: ''
                }
            ]
        }

    vm.calendars = [];

        vm.setMode = function (m) {
            if (m === 'register') {
                console.log("Go state: newfamily", $state);
                $state.go('newfamily');
            } else {
                console.log("Go state: join", $state);
                $state.go('join');

            }
        }

        vm.register = function () {

            console.log("Register...", vm.toCreate);
            TavlaService.register(vm.toCreate).then(function(d) {

                $state.go('app.home');

            });

        }

        vm.addUser=function() {

            vm.toCreate.users.push({ userName: null, calendar: null });

        }

        vm.removeUser=function(user) {

            var indx = vm.toCreate.users.indexOf(user);
            vm.toCreate.users.splice(indx, 1);

        }

        vm.join = function () {
            console.log("Join...");

        }

        vm.init=function() {
            CalendarService.getAllCalendars().then(function (c)
            {
                vm.calendars = c.map(function (d) { return d.name; });
            });
        }
    vm.init();
});