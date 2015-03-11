angular.module('tavla')
    .controller('HomeController', function (TavlaService, calendarItems) {

        var vm = this;
        vm.calendars = TavlaService.calendars;
        vm.days = calendarItems;
        vm.settings = TavlaService.saved;
    });