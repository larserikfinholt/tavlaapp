angular.module('tavla')
    .controller('SettingsController', function ($scope, $ionicModal, $timeout) {

        var vm = this;

        ionic.Platform.ready(function () {
            window.plugins.calendar.listCalendars(function (d) {
                console.log('Got list of calendars', d);
                vm.calendars.playlists = d;

            }, function (e) {
                console.warn('could not load calendars', e);
            });
        });

    });