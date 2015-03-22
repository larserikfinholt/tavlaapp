angular.module('tavla')
    .controller('CalendarController', function (TavlaService, CalendarService) {
        var vm = this;
        vm.tavlaService = TavlaService;
    vm.calendarService = CalendarService;

});