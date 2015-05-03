angular.module('tavla')
    .controller('RegularController', function ($state, $scope, $ionicModal, settings, TavlaService) {

        var vm = this;

        vm.tavlaService = TavlaService;
    vm.weekdays = moment.weekdays();

        vm.edit = function (user) {
            console.log("State", $state);
            //$state.go("app.settingsuser", { user: user });

        }

        vm.init = function () {
            console.log("Starting regularcontroller", settings);

            if (TavlaService.tavlaSetting.regularEvents.data && TavlaService.tavlaSetting.regularEvents.data.length == 7) {
                console.log("got regular data before");
            }
            else {
                var arr = [];
                for (var i = 0; i < 7; i++) {
                    arr.push({ dayNo: i, events: [] });
                }
                TavlaService.tavlaSetting.regularEvents.data = arr;

            }
        }
        vm.init();

        vm.edit=function(event) {
            vm.currentEvent = event;
            $scope.modal.show();
            vm.currentDay = null;
        }
        vm.add=function(day) {
            vm.currentDay = day;
            vm.currentEvent = {
                user: null,
                title: null,
                hour: 12,
                minutes: 0
            };
            $scope.modal.show();
        }
        vm.save=function() {
            if (vm.currentDay) {
                // Is a new event
                console.log("Added event");
                TavlaService.tavlaSetting.regularEvents.data[vm.currentDay.dayNo].events.push(vm.currentEvent);
            }
            TavlaService.saveSettingWithName('regularEvents').then(function(r) {
                console.log("Saved", r);
                $scope.modal.hide();
            });
        }



        $ionicModal.fromTemplateUrl('templates/popup-regular.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

    });