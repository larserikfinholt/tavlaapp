angular.module('tavla')
    .controller('HomeController', function(TavlaService) {

        var vm = this;
        vm.settings = TavlaService.saved;
});