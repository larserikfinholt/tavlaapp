// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('tavla', ['ionic'])

.run(function ($ionicPlatform) {

        //moment.locale('nb-no');

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
        .state('register', {
            url: '/login/register',
            templateUrl: "templates/register.html",
            controller: "RegisterController as vm",
            resolve: {
                mode: function () { return 'select'; }
            }
        })
        .state('newfamily', {
            url: '/login/newfamily',
            templateUrl: "templates/register.newfamily.html",
            controller: "RegisterController as vm",
            resolve: {
                mode: function () { return 'newfamily'; }
            }
        })
        .state('join', {
            url: '/login/join',
            templateUrl: "templates/register.join.html",
            controller: "RegisterJoinController as vm",
            resolve: {
                mode: function () { return 'join'; }
            }


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
                calendarItems: function (CalendarService, doneIts) {
                    return CalendarService.getItems();
                },
                doneIts: function(TavlaService) {
                    return TavlaService.loadAllDoneIts();
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
        .state('app.settings-main', {
            url: "/settings/main",
            views: {
                'menuContent': {
                    templateUrl: "templates/settings.html",
                    controller: 'SettingsMainController as vm'
                }
            },
            resolve: {
                settings: function (TavlaService) {
                    return TavlaService.getSettings();
                }
            }
        })
        .state('app.settings-main-users', {
            url: "/settings/main/users",
            views: {
                'menuContent': {
                    templateUrl: "templates/settings-main-users.html",
                    controller: 'SettingsMainUsersController as vm'
                }
            },
            resolve: {
                settings: function (TavlaService) {
                    return TavlaService.getSettings();
                }
            }
        })
             .state('app.settings-main-tasks', {
            url: "/settings/main/tasks",
            views: {
                'menuContent': {
                    templateUrl: "templates/settings-main-tasks.html",
                    controller: 'SettingsMainTasksController as vm'
                }
            },
            resolve: {
                settings: function (TavlaService) {
                    return TavlaService.getSettings();
                }
            }
        }).state('app.regular', {
              url: "/regular",
              views: {
                  'menuContent': {
                      templateUrl: "templates/regular.html",
                      controller: 'RegularController as vm'
                  }
              },
              resolve: {
                  settings: function (TavlaService) {
                      return TavlaService.getSettings();
                  }
              }
          })
        .state('app.settingsuser', {
            url: "/settingsuser",
            views: {
                'menuContent': {
                    templateUrl: "templates/settings-user.html",
                    controller: 'UserSettingsController as vm',
                }
            },
            params: {
                user:null
            },
            resolve: {
                user: function ($stateParams) {
                    return $stateParams.user;
                }
            }
        }).state('app.settingstasks', {
            url: "/settingstasks",
            views: {
                'menuContent': {
                    templateUrl: "templates/settings-tasks.html",
                    controller: 'TasksSettingsController as vm',
                }
            },
            params: {
                task:null
            },
            resolve: {
                task: function ($stateParams) {
                    return $stateParams.task;
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
    $urlRouterProvider.otherwise('/login');
})
 .constant('AzureMobileServiceClient',
 {
     API_URL: "https://tavla-service.azure-mobile.net/",
     API_KEY: 'bPNdSHXgGsxOxvCcDzxBybTCxNtbIb24'
 })

    .constant('Mocks', {

        calendars: [
            { id: '1', name: 'lars.erik.finholt@gmail.com' },
        { id: '2', name: 'camilla.finholt@gmail.com' },
        { id: '3', name: 'markus.finholt@gmail.com' },
        { id: '4', name: 'sigrid.finholt@gmail.com' }
        ],
        calendarItems: [
       { calendar_id: '1', eventLocation: "", title: "TEST1 title", allDay: 0, dtstart: new Date(new Date().getTime() + 2 * 60 * 60 * 1000).getTime(), dtend: 1426183200000 }, // moment().add(0,'days').add(2, 'hours') },
       { calendar_id: '2', eventLocation: "Camillas", title: "TEST2 title", allDay: 0, dtstart: new Date(new Date().getTime() + 3 * 60 * 60 * 1000).getTime() },//moment().add(0, 'days').add(3, 'hours') },
       { calendar_id: '1', eventLocation: "", title: "TEST3 title", allDay: 0, dtstart: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).getTime() }, //moment().add(2, 'days') },
       { calendar_id: '1', eventLocation: "", title: "TEST4 title", allDay: 0, dtstart: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000).getTime() }, //moment().add(1, 'days') },
       { calendar_id: '1', eventLocation: "", title: "TESTx title", allDay: 0, dtstart: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).getTime() }, //moment().add(1, 'days') },
       { calendar_id: '1', eventLocation: "", title: "TESTx title", allDay: 0, dtstart: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).getTime() }, //moment().add(1, 'days') },
       { calendar_id: '1', eventLocation: "", title: "TESTx title", allDay: 0, dtstart: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).getTime() }, //moment().add(1, 'days') },
       { calendar_id: '1', eventLocation: "", title: "TESTx title", allDay: 0, dtstart: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).getTime() }, //moment().add(1, 'days') },
       { calendar_id: '1', eventLocation: "", title: "TESTx title", allDay: 0, dtstart: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).getTime() }, //moment().add(1, 'days') },
       { calendar_id: '1', eventLocation: "", title: "TESTx title", allDay: 0, dtstart: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).getTime() }, //moment().add(1, 'days') },
       { calendar_id: '1', eventLocation: "", title: "TESTx title", allDay: 0, dtstart: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).getTime() }, //moment().add(1, 'days') },
       { calendar_id: '1', eventLocation: "", title: "TESTx title", allDay: 0, dtstart: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).getTime() }, //moment().add(1, 'days') },
       { calendar_id: '1', eventLocation: "", title: "TESTx title", allDay: 0, dtstart: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).getTime() }, //moment().add(1, 'days') },
       { calendar_id: '1', eventLocation: "", title: "TESTx title", allDay: 0, dtstart: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).getTime() }, //moment().add(1, 'days') },
       { calendar_id: '1', eventLocation: "", title: "TESTx title", allDay: 0, dtstart: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).getTime() }, //moment().add(1, 'days') },
       { calendar_id: '1', eventLocation: "", title: "TESTx title", allDay: 0, dtstart: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).getTime() }, //moment().add(1, 'days') },
       { calendar_id: '1', eventLocation: "", title: "TESTx title", allDay: 0, dtstart: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).getTime() }, //moment().add(1, 'days') },
       { calendar_id: '1', eventLocation: "", title: "TESTx title", allDay: 0, dtstart: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).getTime() }, //moment().add(1, 'days') },
       { calendar_id: '1', eventLocation: "", title: "TESTx title", allDay: 0, dtstart: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).getTime() }, //moment().add(1, 'days') },
       { calendar_id: '1', eventLocation: "", title: "TESTx title", allDay: 0, dtstart: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).getTime() }, //moment().add(1, 'days') },
       { calendar_id: '1', eventLocation: "", title: "TESTx title", allDay: 0, dtstart: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).getTime() }, //moment().add(1, 'days') },
       { calendar_id: '1', eventLocation: "", title: "TESTx title", allDay: 0, dtstart: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).getTime() }, //moment().add(1, 'days') },
       { calendar_id: '1', eventLocation: "", title: "TESTx title", allDay: 0, dtstart: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).getTime() }, //moment().add(1, 'days') },
       { calendar_id: '3', eventLocation: "Markus", title: "TEST5 title", allDay: 0, dtstart: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000).getTime() } //moment().add(1, 'days') },
        ],

        settings: {
            family: {
                "id": "784eda9d-9e09-48a5-bf5e-e307d48a35b9",
                "name": "Finholt",
                "secret": "123"
            },
            members: [
              {
                  "id": "2d9db721-eefb-4d7f-ade8-c2480b811f04",
                  "name": "Markus",
                  "familyId": "784eda9d-9e09-48a5-bf5e-e307d48a35b9"
              },
              {
                  "id": "4a7a0a3f-afda-48f1-b418-e6cc3a9fd21c",
                  "name": "Camilla",
                  "calendars": "",
                  "familyId": "784eda9d-9e09-48a5-bf5e-e307d48a35b9"
              },
              {
                  "id": "5f00d18e-a5c9-49da-91dc-6f309b452f7c",
                  "userId": "NOUSER",
                  "name": "Lars Erik",
                  "calendars": "lars.erik.finholt@gmail.com",
                  "familyId": "784eda9d-9e09-48a5-bf5e-e307d48a35b9",
                  "isAdmin": true
              }
            ],
            "registerState": "completed",
            "currentUserId": "NOUSER"
        }

    });
