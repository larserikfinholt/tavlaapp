/* global WindowsAzure */
/// <reference path="../../typings/tsd.d.ts"/>


angular.module('tavla')
    .factory('TavlaService', function ($q, $http, Mocks, $ionicPlatform) {
    var root = 'https://tavlaapi.azure-mobile.net/';
    var client = WindowsAzure.MobileServiceClient(root, 'jFWBtWeZsRaerKJzkCVCzkwgmdKBhI46');
    if (window.tinyHippos != undefined || !window.cordova) {
        root = "http://localhost:17588";
        console.log("Using localhost");
        client = new WindowsAzure.MobileServiceClient(root, 'jFWBtWeZsRaerKJzkCVCzkwgmdKBhI46');
    }


    var service = {

        updates: 0,
        isSettingsLoaded: false,
        saved: null,
        doneIts: null,
        tavlaSetting: {},
        shoppingList: null,
        weather: [],
        errors: [],

        authenticate: function (provider) {
            var dfd = $q.defer();

            if (window.tinyHippos != undefined ) {

                dfd.resolve('ripple');
            } else {
                console.log("DEVICE------");
                $ionicPlatform.ready(function () {
                    client = new WindowsAzure.MobileServiceClient(root, 'jFWBtWeZsRaerKJzkCVCzkwgmdKBhI46');
                    if (ionic.Platform.isWebView()) {
                        console.log("Prevent sleep - starting insomnia...");
                        window.plugins.insomnia.keepAwake();
                    }
                    console.log("Calling authenticate with google...");
                    client.login(provider).done(function (d) {
                        console.log("Login success", provider, d);
                        dfd.resolve({ isLoggedIn: true, user: d.userId });
                    }, function (e) {
                            console.warn("Noe gikk feil i google pålogging", e);
                            dfd.resolve({ isLoggedIn: false, error: e });
                        });
                });
            }

            return dfd.promise;
        },

        login: function () {

            var self = this;
            var dfd = $q.defer();
            console.log("Calling start...");
            client.invokeApi('start', {
                body: null,
                method: "get",
                headers: {
                    'Content-Type': 'application/json'
                }

            }).done(function (d) {
                self.updates++;
                console.info("Completed Start call - main setting loaded", d.result, self.updates);
                self.isSettingsLoaded = true;
                self.saved = d.result;
                dfd.resolve(d);
            }, function (e) {
                    console.warn("Noe gikk feil i pålogging", e);
                    dfd.resolve({ isLoggedIn: false, error: e });
                });

            return dfd.promise;

        },
        loadDoneItSummary:function(){
            var self = this;
            var dfd = $q.defer();
            console.log("Loading doneit summary...");
            client.invokeApi('summary', {
                body: null,
                method: "get",
                headers: {
                    'Content-Type': 'application/json'
                }

            }).done(function (d) {
                console.info("Loaded doneit summary", d.result);
                self.summary = d.result;
                dfd.resolve(d);
            }, function (e) {
                console.warn("Noe gikk feil i lasting av summary", e);
                dfd.resolve({ isLoggedIn: false, error: e });
            });

            return dfd.promise;

        },

        register: function (model) {

            var self = this;
            var dfd = $q.defer();
            console.log("Calling register...");
            client.invokeApi('start', {
                body: model,
                method: "post"
            }).done(function (d) {
                console.log("Ferdig registrert på!");
                console.log("Logged in", d.result);
                self.isSettingsLoaded = true;
                self.saved = d.result;
                dfd.resolve({ saved: true, result: d.result });
            }, function (d) {
                    console.warn("Fikk ikke registrert", d);
                    dfd.resolve({ error: d });
                });

            return dfd.promise;


        },

        test: function () {
            console.log("Calling from TavlaService");
            var dfd = $q.defer();

            var todoItemTable = client.getTable('todoitem');
            todoItemTable.read().done(function (d) {
                dfd.resolve(d);
            }, function (e) {
                    console.log("Error getting items", e);
                    dfd.resolve({ error: e });
                });
            return dfd.promise;
        },

        logout: function () {
            console.log("LOGOUT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
             window.localStorage['hasLoggedInBefore'] = 'no';
            var dfd = $q.defer();
            client.logout();
            dfd.resolve({ isLoggedIn: false, logout: new Date() });
            return dfd.promise;
        },

        getSettings: function () {
            var self = this;
            var dfd = $q.defer();
            if (self.isSettingsLoaded) {
                dfd.resolve(self.saved);
            } else {
                console.log('calling getSettings...');
                self.saved = Mocks.settings;
                self.isSettingsLoaded = true;
                dfd.resolve(self.saved);
            }
            return dfd.promise;
        },

        addOrUpdateUser: function (user) {
            var dfd = $q.defer();
            console.log("Calling add user...");
            client.invokeApi('User/addOrUpdateUser', {
                body: user,
                method: "post"
            }).done(function (d) {
                console.log("Added/saved", d.result);
                dfd.resolve({ saved: true, result: d });
            }, function (d) {
                    console.warn("Fikk ikke registrert", d);
                    dfd.resolve({ error: d });
                });

            return dfd.promise;
        },



        loadAllDoneIts: function () {
            var self = this;
            var dfd = $q.defer();
            if (self.doneIts === null) {
                console.log("Loading doneIt's...");
                var doneItTable = client.getTable('doneIt');
                doneItTable.read().then(function (d) {
                    //console.log("Loaded doneits, but waiting on TavlaSettings", d);

                    var settingsTable = client.getTable('TavlaSetting');
                    console.log("Loading settings...");
                    settingsTable.read().then(function (ts) {
                        self.parseTavlaSetting(ts);
                        self.doneIts = d;
                        self.refreshAlerts();

                        self.loadAllListItems().then(function () {
                        console.info("Loaded TavlsSettings, DoneIts and ListItems");
                            dfd.resolve({ saved: true, result: d });
                        });
                    });
                });
            } else {
                dfd.resolve(self.doneIts);
            }

            return dfd.promise;

        },
        getPointsForUser: function (user) {

            return this.getPointsForUserFromSummary(user);

            // Old method
            var self = this;
            // Get last payment
            var usersDoneIts = _.where(self.doneIts, { user: user.name });
            var clears = _.where(usersDoneIts, { type: 999 });
            var startFrom = moment("2015-1-1");
            if (clears.length > 0) {
                // find the newest
                var sortedClears = _.sortBy(clears, 'dateTime').reverse();
                startFrom = moment(sortedClears[0].dateTime);
            }
            // Get doneits for user after clear date
            var currentDoneits = _.filter(usersDoneIts, function (d) {
                return startFrom.isBefore(d.dateTime);
            });

            console.log("Calculating from", { user: user, allDonits: self.doneIts, usersDoneIts: usersDoneIts, clears: clears, startFrom: startFrom, currentDoneIts: currentDoneits });

            // Sum doneIts points
            var points = 0;
            _.each(currentDoneits, function (s) {
                // get points for type
                var task = _.find(self.tavlaSetting.tasks, function (t) { return t.data.taskTypeId === s.type; });
                if (task) {
                    points = points + task.data.points;
                } else {
                    if (s.type === 1) {
                        points = points + 10;
                    }
                    if (s.type != 1) {
                        console.warn("Unable to find task for doneIt", s);
                    }
                }
            });
            return points;
        },
        getPointsForUserFromSummary: function (user) {
            var self = this;
            // Get last payment
            var summary = _.where(self.summary, { name: user.name });

            console.log("Calculating from summary", { summary:summary });

            // Sum doneIts points
            var points = 0;
            _.each(summary, function (s) {
                // get points for type
                var task = _.find(self.tavlaSetting.tasks, function (t) { return t.data.taskTypeId === s.type; });
                if (task) {
                    points = points + (task.data.points*s.total);
                } else {
                    if (s.type === 1) {
                        points = points + 10;
                    }
                    if (s.type != 1) {
                        console.warn("Unable to find task for doneIt", s);
                    }
                }
            });
            return points;
        },

        refreshAlerts: function () {

            var self = this;
            _.each(self.saved.members, function (user) {

                user.alerts = [];

                // Only tasks where user has an alert set up
                var taskWithAlertForUser = _.where(self.tavlaSetting.tasks, function (t) {
                    if (t.data.warningDays) {
                        var u = _.find(t.data.users, { id: user.id });
                        if (u) return true;
                    }
                    return false;
                });
                if (taskWithAlertForUser.length > 0) {
                    // Only users doneit
                    var usersDoneIts = _.where(self.doneIts, { user: user.name });

                    _.each(taskWithAlertForUser, function (t) {
                        // Assume sorted list
                        var last = _.findLast(usersDoneIts, { type: t.data.taskTypeId });
                        if (last && t.data.warningDays && t.data.warningDays > 0) {

                            var maxDate = moment(last.dateTime).add(t.data.warningDays, 'days');
                            //console.log('compare', { task:t, max: maxDate.format("dddd, DD.MM HH:mm"), last:moment(last.dateTime).format("dddd, DD.MM HH:mm") });
                            if (maxDate.isBefore()) {
                                user.alerts.push({
                                    name: t.data.name,
                                    last: moment(last.dateTime),
                                    warningDays: t.data.warningDays
                                });
                            }
                        }
                    });

                    // Hack for Buster
                    if (true) {
                        // Assume sorted list
                        var last = _.findLast(usersDoneIts, { type: 1 });
                        if (last) {

                            var maxDate = moment(last.dateTime).add(2, 'days');
                            //console.log('compare', { task:t, max: maxDate.format("dddd, DD.MM HH:mm"), last:moment(last.dateTime).format("dddd, DD.MM HH:mm") });
                            if (maxDate.isBefore()) {
                                user.alerts.push({
                                    name: 'Buster',
                                    last: moment(last.dateTime),
                                    warningDays: 2
                                });
                            }
                        }


                    }

                }
                //console.log("Alerts for user calculated", user.alerts);
            });
            console.log("Alerts refreshed. Using", { members: self.saved.members, tasks: self.tavlaSetting.tasks, doneIts: self.doneIts });


        },

        parseTavlaSetting: function (ts) {
            var self = this;

//            console.log("parsing", ts);
            //var t = ts[0].type;

            var tasks = _.where(ts, { type: 'task' });
            _.each(tasks, function (t) {
                t.data = t.jsonStringifiedData ? JSON.parse(t.jsonStringifiedData) : null;
            });


            self.tavlaSetting = {
                regularEvents: {
                    id: ts[0].id,
                    data: ts[0].jsonStringifiedData ? JSON.parse(ts[0].jsonStringifiedData) : null
                },
                diverse: {
                    id: ts[1].id,
                    data: ts[1].jsonStringifiedData ? JSON.parse(ts[1].jsonStringifiedData) : {
                        yrPath: 'http://www.yr.no/sted/Norge/Telemark/Skien/Gulset/varsel.xml'
                        
                    }
                },
                tasks: tasks,
            };
            console.log("Got TavlaSettings", self.tavlaSetting);

        },

        saveSettingWithName: function (name) {
            var self = this;
            var dfd = $q.defer();
            var settingTable = client.getTable('TavlaSetting');

            switch (name) {
                case 'regularEvents':
                    var s = self.tavlaSetting.regularEvents;
                    var toSave = {
                        id: s.id,
                        Type: 'regularEvents',
                        JsonStringifiedData: JSON.stringify(s.data)
                    };

                    settingTable.update(toSave).then(function (d) {
                        console.log("Saved setting", toSave, d);
                        dfd.resolve(d);
                    });
                    break;
                case 'diverse':
                    var div = self.tavlaSetting.diverse;
                    var toSaveDiv = {
                        id: div.id,
                        Type: 'diverse',
                        JsonStringifiedData: JSON.stringify(div.data)
                    };

                    settingTable.update(toSaveDiv).then(function (d) {
                        console.log("Saved setting", toSaveDiv, d);
                        dfd.resolve(d);
                    });
                    break;

                default:
                    console.warn("Cannot saveSettingWithName", name);
            }

            return dfd.promise;

        },

        saveTask: function (task) {
            var dfd = $q.defer();
            var settingTable = client.getTable('TavlaSetting');

            if (task.type != "task") {
                console.warn("Not a real task - cant save", task);
                return;
            }
            task.JsonStringifiedData = JSON.stringify(task.data);

            if (task.id == null) {
                settingTable.insert(task).then(function (d) {
                    console.log("Created task setting", task, d);
                    dfd.resolve(d);
                }, function (err) {
                        alert("Error: " + err);
                    });
            } else {
                settingTable.update(task).then(function (d) {
                    console.log("Saved task setting", task, d);
                    dfd.resolve(d);
                });

            }


            return dfd.promise;
        },

        registerDoneIt: function (user, type) {
            var dfd = $q.defer();
            console.log("Calling add doneit...");
            var doneItTable = client.getTable('doneIt');
            doneItTable.insert({ familyMemberId: user.id, type: type }).then(function (d) {
                console.log("Added doneit", d);
                //self.doneIts.push(d);
                dfd.resolve(d);
            });

            return dfd.promise;

        },

        loadAllListItems: function () {
            var self = this;
            var dfd = $q.defer();
            if (self.shoppingList === null) {
                console.log("Loading listItems's...");
                var listItemTable = client.getTable('listItem');
                listItemTable.read().then(function (d) {
                    //console.log("Loaded doneits, but waiting on TavlaSettings", d);
                    console.log("Loaded listItems", d);
                    self.shoppingList = d;
                    dfd.resolve(d);
                });
            } else {
                dfd.resolve(self.shoppingList);
            }

            return dfd.promise;
        },
        addListItem: function (listId, data) {
            var dfd = $q.defer();
            console.log("Calling add addListItem...");
            var listItemTable = client.getTable('listItem');
            listItemTable.insert({ type: listId, data: data }).then(function (d) {
                console.log("Added listItem", d);
                dfd.resolve(d);
            });
            return dfd.promise;
        },
        removeListItem: function (item) {
            var dfd = $q.defer();
            console.log("Calling removeListItem...",item);
            var listItemTable = client.getTable('listItem');
            listItemTable.del({ id: item.id }).then(function () {
                console.log("deleted listItem", item);
                dfd.resolve(item.id);
            });
            return dfd.promise;
        },

        refresh: function () {
            var self = this;
            var dfd = $q.defer();
            console.log("Doing a TavlaService refresh....");
            self.isSettingsLoaded = true;
            self.login().then(function () {
                self.doneIts = null;
                self.shoppingList = null;
                self.loadAllDoneIts().then(function () {

                    dfd.resolve();
                    self.getWeatherForecast().then(function () {
                        self.loadDoneItSummary().then(function () {
                            console.info("refresh complete");
                        })
                    });;
                    


                });
            });
            return dfd.promise;

        },

        getWeatherForecast: function () {
            var self = this;
            var path = self.tavlaSetting.diverse.data.yrPath;
            console.log("Loading weather for", path);
            var dfd = $q.defer();
            client.invokeApi('weather', {
                body: null,
                method: "get",
                parameters: {
                    yrPath: path
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            }).done(function (d) {

                //console.log("Got weather", d.result);
                //var formatStr = 'D/M ddd HH:MM';

                var dayNo = 0;
                var days = [];
                for (var i = 0; i < d.result.length; i++) {
                    var toFind = moment().startOf('day').add(12, 'hour').add(dayNo, 'days');
                    var current = moment(d.result[i].dateFrom, "YYYY-MM-DD HH:mm");
                    //console.log('looking for ' + toFind.format(formatStr) + " --- current: " + current.format(formatStr));
                    if (current.isAfter(toFind)) {
                        days.push(d.result[i]);
                        //console.log("found:", moment(d.result[i].dateFrom, "YYYY-MM-DD HH:mm").format(formatStr));
                        dayNo++;
                    }
                }

                self.weather = days;
                console.info("Final TavlaService model", self);
                dfd.resolve(d);
            });
            return dfd.promise;

        },


        recognizeSpeech: function () {
            var dfd = $q.defer();

            var maxMatches = 1;
            var promptString = "Snakk nå"; // optional
            var language = "nb-NO";                     // optional
            if (window.tinyHippos != undefined || !window.cordova) {
                dfd.resolve({ item: { title: 'melk' } });
            } else {
                window.plugins.speechrecognizer.startRecognize(function (result) {
                    console.log("Fikk svar", result);
                    if (result && result.length === 1) {
                        dfd.resolve({
                            item: {
                                title: result[0]
                            }
                        });
                    }
                }, function (errorMessage) {
                        console.log("Error message: " + errorMessage);
                        dfd.resolve({
                            item: {
                                title: errorMessage

                            }
                        });

                    }, maxMatches, promptString, language);

            }

            return dfd.promise;
        },

        getSupportedLanguages: function () {
            window.plugins.speechrecognizer.getSupportedLanguages(function (languages) {
                // display the json array
                console.log("Languages:", languages);
            }, function (error) {
                    alert("Could not retrieve the supported languages : " + error);
                });
        },






    };

    return service;


}).filter('todaysOfType', function () {
    // function to invoke by Angular each time
    // Angular passes in the `items` which is our Array
    return function (items, type, stop) {
        // Create a new Array
        //console.log("kjører todaysOfType...........");
        var filtered = [];
        // loop through existing Array
        if (items) {
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                // check if the individual Array element begins with `a` or not
                if (item.type === type && moment(item.dateTime).isSame(moment(), 'day')) {
                    // push it into the Array if it does!
                    filtered.push(item);
                }
            }
        }
        // boom, return the Array after iteration's complete
        return filtered;
    };
}).filter('hoursOld', function () {
    // function to invoke by Angular each time
    // Angular passes in the `items` which is our Array
    return function (items, hours, stop) {
        // Create a new Array
        var filtered = [];
        //console.log("kjører hoursOld...........");
        // loop through existing Array
        if (items) {

            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                // check if the individual Array element begins with `a` or not
                if (moment(item.dateTime).add(hours, 'hours').isAfter()) {
                    // push it into the Array if it does!
                    filtered.push(item);
                }
            }
        }
        // boom, return the Array after iteration's complete
        return filtered;
    };
}).filter('taskEnabledForUser', function () {
    // function to invoke by Angular each time
    // Angular passes in the `items` which is our Array
    return function (items, user, stop) {
        // Create a new Array
        var filtered = [];
        if (items && user && user.id) {
            //console.log("kjører taskEnabledForUser...........");
            // loop through existing Array
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                // check if the individual Array element begins with `a` or not
                if (item.data.isEnabled) {
                    var enabledUser = _.findWhere(item.data.users, { enabled: true, id: user.id });
                    // push it into the Array if it does!
                    if (enabledUser) {
                        filtered.push(item);
                    }
                }
            }
        }
        // boom, return the Array after iteration's complete
        return filtered;
    };
}).filter('latestForUser', function () {
    // function to invoke by Angular each time
    // Angular passes in the `items` which is our Array
    return function (items, user, stop) {
        // Create a new Array
        var filtered = [];
        if (items && user && user.name) {
            //console.log("kjører latestForUser...........");
            // loop through existing Array
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                // check if the individual Array element begins with `a` or not
                if (moment(item.dateTime).add(7, 'days').isAfter() && item.user == user.name) {
                    // push it into the Array if it does!
                    filtered.push(item);
                }
            }
            // boom, return the Array after iteration's complete
            filtered.reverse();
        }
        return filtered;
    };
})





    .directive('tavlaWeather', function () {
    return {
        restrict: 'E',
        scope: {
            model: '='
        },
        template: '<div class="weather"><span>{{model.temperature}}</span><img ng-src="http://symbol.yr.no/grafikk/sym/b38/{{model.symbolNumber}}.png" alt="symbol"></div>'
    };

});
