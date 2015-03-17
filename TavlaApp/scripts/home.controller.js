angular.module('tavla')
    .controller('HomeController', function (TavlaService, calendarItems, CalendarService) {

        var vm = this;
    vm.updates = TavlaService.updates;
        vm.days = calendarItems;
        vm.settings = TavlaService.saved;
        vm.calendarService = CalendarService;
    });