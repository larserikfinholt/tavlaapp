// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('tavla', ['ionic'])

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }

        console.info("Device ready, starting!!!!!!!!!", window.plugins);

    });
})

.config(function ($compileProvider, $stateProvider, $urlRouterProvider) {

    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|ghttps?|ms-appx|x-wmapp0):/);
    // // Use $compileProvider.urlSanitizationWhitelist(...) for Angular 1.2
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|ms-appx|x-wmapp0):|data:image\//);

    $stateProvider
        .state('login', {
            url: "/login",
            templateUrl: "templates/login.html",
            controller: "LoginController as vm"
        })
        .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "templates/menu.html",
            controller: 'AppController as main'
        })
        .state('app.home', {
            url: "/home",
            views: {
                'menuContent': {
                    templateUrl: "templates/home.html",
                    controller: "HomeController as vm"
                }
            },
            resolve: {
                calendarItems: function (CalendarService) {
                    return CalendarService.getItems();
                }
            }
        })
        .state('app.calendar', {
            url: "/calendar",
            views: {
                'menuContent': {
                    templateUrl: "templates/calendar.html",
                    controller: "CalendarController as vm"
                }
            }
        })
        .state('app.settings', {
            url: "/settings",
            views: {
                'menuContent': {
                    templateUrl: "templates/settings.html",
                    controller: 'SettingsController as vm'
                }
            },
            resolve: {
                settings: function (TavlaService) {
                    return TavlaService.getSettings();
                }
            }
        });

    //.state('app.single', {
    //    url: "/playlists/:playlistId",
    //    views: {
    //        'menuContent': {
    //            templateUrl: "templates/playlist.html",
    //            controller: 'PlaylistCtrl'
    //        }
    //    }
    //});
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');
}).constant('Mocks', {
    
    calendars: [
        { id: '1', name: 'lars.erik.finholt@gmail.com' }
    ],
    calendarItems: [
        { id: '1', name: 'lars.erik.finholt@gmail.com', title: 'TEST title', start: start }
    ],

    settings: {
        users: [
            { id:'1', name:'Lars Erik', calendar:'lars.erik.finholt@gmail.com'},
            { id: '2', name: 'Camilla', calendar: 'camilla.finholt@gmail.com' }
        ]
    }

});
