angular.module('tavla')
    .controller('RegisterJoinController', function ($state, TavlaService, CalendarService, mode) {

        var vm = this;
        vm.d = null;
        vm.state = 'verify';

        vm.members = [];
 
        vm.tryRegister = function (nameToJoin) {
            var model = {
                action: 'JoinFamily',
                familyName: vm.joinFamilyName,
                secret: vm.joinFamilyPassword,
                nameToJoin: nameToJoin,
                users: []
            };
            console.log("Join...", model);
            TavlaService.register(model).then(function (d) {
                vm.d = d;
                console.log("Register result", d);
                if (d.result && d.result.currentUser) {
                    console.log("Successfully joined! - Restarintng...........");
                    $state.go('login');
                    window.location.reload();
                    

                } else {

                    if (d.result) {
                        vm.members = d.result.map(function (m) {
                            return {
                                name: m.name,
                                registered: !!m.userId
                            };
                        });
                        vm.state = 'selectPerson';

                    } else {
                        vm.err = d.message || 'Unable to find family with that name and password';
                    }
                }
                //
            });
        }

        vm.init=function() {

        }
    vm.init();
});