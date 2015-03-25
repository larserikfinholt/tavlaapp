angular.module('tavla')
    .factory('TavlaService', function ($q, $http, Azureservice, Mocks) {

        var root = 'https://tavlaapi.azure-mobile.net/';
        if (window.tinyHippos != undefined) {
            root = "http://localhost:17588";
        }
        var client = new WindowsAzure.MobileServiceClient(root, 'jFWBtWeZsRaerKJzkCVCzkwgmdKBhI46');



        var service = {

            updates:0,
            isSettingsLoaded: false,
            saved: null,
            doneIts: null,
            tavlaSetting: {},

            authenticate: function () {
                var self = this;
                var dfd = $q.defer();

                if (window.tinyHippos != undefined) {

                    dfd.resolve('ripple');
                } else {
                    console.log("prevent sleep...");
                    window.plugins.insomnia.keepAwake();
                    console.log("Calling authenticate...");
                    client.login('google').done(function (d) {
                        // Azureservice.login('google').then(function () {
                        console.log("Ferdig logget på!");
                        //Azureservice.query('Todos').then(function (d) {
                        console.log("Logged in", d);
                        dfd.resolve({ isLoggedIn: true, user: d.userId });
                    }, function () {
                        console.warn("Noe gikk feil i pålogging", d);
                        dfd.resolve({ isLoggedIn: false, error: d });
                    });
                }

                return dfd.promise;
            },

            login: function () {

                var self = this;
                var dfd = $q.defer();
                console.log("Calling login...");
                client.invokeApi('start', {
                    body: null,
                    method: "get",
                    headers: {
                        'Content-Type': 'application/json'
                    }

                }).done(function (d) {
                    // Azureservice.login('google').then(function () {
                    self.updates++;
                    console.log("Ferdig logget på!",self.updates);
                    //Azureservice.query('Todos').then(function (d) {
                    console.log("Logged in", d.result);
                    self.isSettingsLoaded = true;
                        self.saved = d.result;
                    dfd.resolve(d);
                }, function (e) {
                    console.warn("Noe gikk feil i pålogging", e);
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
                    // Azureservice.login('google').then(function () {
                    console.log("Ferdig registrert på!");
                    //Azureservice.query('Todos').then(function (d) {
                    console.log("Logged in", d.result);
                    self.isSettingsLoaded = true;
                    self.saved = d.result;
                    dfd.resolve({ saved: true, result: d });
                }, function () {
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
                var dfd = $q.defer();
                //Azureservice.logout();
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
                var self = this;
                var dfd = $q.defer();
                console.log("Calling add user...");
                client.invokeApi('User/addOrUpdateUser', {
                    body: user,
                    method: "post"
                }).done(function (d) {
                    console.log("Added/saved", d.result);
                    dfd.resolve({ saved: true, result: d });
                }, function () {
                    console.warn("Fikk ikke registrert", d);
                    dfd.resolve({ error: d });
                });

                return dfd.promise;
            },

            loadAllDoneIts: function() {
                var self = this;
                var dfd = $q.defer();
                if (self.doneIts === null) {
                    console.log("Calling load doneit...");
                    var doneItTable = client.getTable('doneIt');
                    doneItTable.read().then(function (d) {
                        console.log("Loaded doneits, but waiting on TavlaSettings", d);

                        var settingsTable = client.getTable('TavlaSetting');
                        settingsTable.read().then(function(ts) {
                            self.parseTavlaSetting(ts);
                            console.log("Loaded TavlsSettings also", self);
                            self.doneIts = d;
                            dfd.resolve({ saved: true, result: d });
                        });
                    });
                } else {
                    dfd.resolve(self.doneIts);
                }

                return dfd.promise;

            },

            parseTavlaSetting: function (ts) {
                var self = this;

                console.log("parsing", ts);
                //var t = ts[0].type;
                self.tavlaSetting= {
                    regularEvents : {
                        id: ts[0].id,
                        data: ts[0].jsonStringifiedData ? JSON.parse(ts[0].jsonStringifiedData) : null
                    }
                };
                console.log("Got TavlaSettings", self.tavlaSetting);

            },

            saveSettingWithName: function (name) {
                var self = this;
                var dfd = $q.defer();

                var s = self.tavlaSetting.regularEvents;
                var toSave = {
                    id: s.id,
                    Type: 'regularEvents',
                    JsonStringifiedData: JSON.stringify(s.data)
                };

                var settingTable = client.getTable('TavlaSetting');
                settingTable.update(toSave).then(function(d) {
                    console.log("Saved setting", toSave, d);
                    dfd.resolve(d);
                });
                return dfd.promise;

            },

            registerDoneIt: function (user, type) {
                var self = this;
                var dfd = $q.defer();
                console.log("Calling add doneit...");
                var doneItTable = client.getTable('doneIt');
                doneItTable.insert({ familyMemberId: user.id, type: type }).then(function(d) {
                    console.log("Added doneit", d);
                    //self.doneIts.push(d);
                    dfd.resolve(d);
                });

                return dfd.promise;
                
            },


        }

        return service;


    }).filter('todaysOfType', function () {
        // function to invoke by Angular each time
        // Angular passes in the `items` which is our Array
        return function (items, type, stop) {
            // Create a new Array
            var filtered = [];
            // loop through existing Array
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                // check if the individual Array element begins with `a` or not
                if (item.type===type && moment(item.dateTime).isSame(moment(),'day')) {
                    // push it into the Array if it does!
                    filtered.push(item);
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
            console.log("kjører...........");
            // loop through existing Array
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                // check if the individual Array element begins with `a` or not
                if (moment(item.dateTime).add(hours, 'hours').isAfter()) {
                    // push it into the Array if it does!
                    filtered.push(item);
                }
            }
            // boom, return the Array after iteration's complete
            return filtered;
        };
    });