angular.module('tavla')
    .factory('TavlaService', function ($q,Mocks) {

        console.log("Creating TavlaService....");

        var client = new WindowsAzure.MobileServiceClient(
            "https://tavla-service.azure-mobile.net/",
            "bPNdSHXgGsxOxvCcDzxBybTCxNtbIb24"
        );

        var service = {

            isSettingsLoaded: false,
            saved: null,

            login: function () {
                client.login();
            },

            getSettings: function() {
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
            }


        }

        return service;


    });