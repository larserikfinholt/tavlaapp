angular.module('tavla')
    .controller('CalendarController', function (TavlaService, CalendarService) {
        var vm = this;
        vm.tavlaService = TavlaService;
        vm.calendarService = CalendarService;

        vm.reload=function() {
            CalendarService.reload();
        };
        vm.logout=function() {
            window.localStorage['hasLoggedInBefore'] = 'no';
        };

});