angular.module('tavla')
    .factory('CalendarService', function ($q, TavlaService, Mocks) {

        console.log("Creating CalendarService....");

        var isDevice = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/);

        function fillInUserAndCalendarInfo(data, days) {

            console.log("fillInUserAndCalendarInfo", data);


            var arr = [];
            for (var i = 0; i < days; i++) {
                arr.push({
                    date: moment().startOf('day').add(i, 'days'),
                    items: []
                });

            }
            _.each(arr, function (day) {
                // check if  is configured
                var correctDay = _.filter(data.calendarItems, function (item) {
                    return day.date.isSame(item.dtstart, 'day');
                });


                // add username
                var withUserInfo = correctDay.map(function (d) {

                    // find calendar
                    d.calendar = _.find(data.calendars, { id: d.calendar_id });
                    if (!d.calendar) {
                        console.warn("Fant ikke kalendar for item", d);
                    }

                    d.user = _.find(data.settings.members, { calendars: d.calendar.name });
                    if (!d.user) {
                        console.warn("Fant ikke bruker for kalender item", d);
                    }
                    return d;
                });

                // add to return array
                _.each(withUserInfo, function (w) {
                    // only add if userinfo is present
                    if (w.user) {
                        day.items.push(w);
                    }
                });

            });

            console.log("Result", arr);
            return arr;
        }




        var service = {

            calendars: [],
            days: [],
            isLoaded: false,
            allEvents:[],


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
                            self.days = fillInUserAndCalendarInfo({
                                calendarItems: Mocks.calendarItems,
                                calendars: self.calendars,
                                settings: TavlaService.saved
                            }, 30);

                                
                            self.isLoaded = true;
                            dfd.resolve(self.days);
                        } else {
                            window.plugins.calendar.listEventsInRange(start, end, (function (d) {
                                // merge with settings
                                console.log('Got list of calendars items', JSON.stringify(d));
                                self.allEvents = d;


                                self.days = fillInUserAndCalendarInfo( {
                                    calendarItems: d,
                                    calendars: self.calendars,
                                    settings: TavlaService.saved
                                }, 30);
                                self.isLoaded = true;
                                dfd.resolve(self.days);
                            }), function (e) {
                                console.warn("Could not get list of cal items", e);
                                dfd.reject(e);
                            });
                        }

                    });
                }
                return dfd.promise;

            },

            reload: function() {
                var self = this;
                self.isLoaded = false;
                self.getItems();
            },

        }

        return service;


    }).filter('dayRange', function () {
        // function to invoke by Angular each time
        // Angular passes in the `items` which is our Array
        return function (items, start, stop) {
            // Create a new Array
            var filtered = [];
            var startDate = moment().startOf('day').add(start, 'days');
            var stopDate = moment().startOf('day').add(stop, 'days');

            var range = moment().range(startDate, stopDate );
            // loop through existing Array
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                // check if the individual Array element begins with `a` or not
                if (range.contains(item.date)) {
                    // push it into the Array if it does!
                    filtered.push(item);
                }
            }
            // boom, return the Array after iteration's complete
            return filtered;
        };
    }).filter('upcommingEvents', function () {
        // function to invoke by Angular each time
        // Angular passes in the `items` which is our Array
        return function (items, start, stop) {
            // Create a new Array
            var filtered = [];
            var startDate = moment().startOf('day').add(start, 'days');
            var stopDate = moment().startOf('day').add(stop, 'days');

            var range = moment().range(startDate, stopDate);
            // loop through existing Array
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                // check if the individual Array element begins with `a` or not
                if (range.contains(item.date)) {
                    // push it into the Array if it does!
                    filtered= filtered.concat(item.items);
                }
            }
            // boom, return the Array after iteration's complete
            return filtered;
        };
    });