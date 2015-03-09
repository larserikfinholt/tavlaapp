angular.module('tavla')
    .factory('CalendarService', function ($q, TavlaService, Mocks) {

        console.log("Creating CalendarService....");

        var isDevice = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/);


        function fillInUserAndCalendarInfo(items, calendars, settings) {

            console.log("fillInUserAndCalendarInfo", { items: items, calendars: calendars, settings: settings });

            var arr = [];
            _.each(items, function(item) {
                // check if calendar is configured


            });


        }


        var service = {

            calendars: [],
            items: [],
            isLoaded: false,


            getAllCalendars: function () {
                var self = this;
                var dfd = $q.defer();
                if (self.isLoaded) {
                    dfd.resolve(self.calendars);
                } else {
                    console.log('calling getAllCalendars...');
                    ionic.Platform.ready(function () {
                        console.log("Device ready", plugins);
                        if (!isDevice) {
                            console.log('FAKE!!!');
                            self.calendars = Mocks.calendars;
                            dfd.resolve(self.calendars);
                        } else {
                            window.plugins.calendar.listCalendars(function (d) {
                                console.log('Got list of calendars', d);
                                self.calendars = d;
                                dfd.resolve(self.calendars);
                            });
                        }
                    });
                }
                return dfd.promise;
            },

            getItems: function (settings) {
                var self = this;
                var dfd = $q.defer();
                if (self.isLoaded) {
                    dfd.resolve(self.items);
                } else {
                    console.log("calling getItems...");
                    this.getAllCalendars().then(function (cals) {

                        // merge with settings
                        console.log('mergining', cals, settings);


                        var start = new Date();
                        var end = new Date(2015, 6, 1);
                        if (!isDevice) {
                            self.items = Mocks.calendarItems;
                            self.isLoaded = true;
                            dfd.resolve(self.items);
                        } else {
                            window.plugins.calendar.listEventsInRange(start, end, (function (d) {
                                // merge with settings
                                console.log('Got list of calendars items', d);


                                self.items = d;
                                fillInUserAndCalendarInfo(self.items, self.calendars, TavlaService.saved);
                                self.isLoaded = true;
                                dfd.resolve(self.items);
                            }), function (e) {
                                console.warn("Could not get list of cal items", e);
                                dfd.reject(e);
                            });
                        }

                    });
                }
                return dfd.promise;

            },

        }

        return service;


    });